const mongoose = require('mongoose');
const User = require('./models/User');
const Booking = require('./models/Booking');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const API_URL = 'http://localhost:5000/api';

const verifyReviewFlow = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');

        // 1. Setup Data
        // Create/Get Provider
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        let provider = await User.findOne({ email: 'provider_test@servease.com' });
        if (!provider) {
            provider = await User.create({
                name: 'Test Provider Review',
                email: 'provider_test@servease.com',
                password: hashedPassword,
                role: 'staff',
                phone: '1112223333',
                address: '123 Test St'
            });
        }

        // Create/Get Client
        let client = await User.findOne({ email: 'client_test@servease.com' });
        if (!client) {
            client = await User.create({
                name: 'Test Client Review',
                email: 'client_test@servease.com',
                password: hashedPassword,
                role: 'client',
                phone: '4445556666',
                address: '456 Test Ave'
            });
        }

        // Login Client to get Token
        const loginRes = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'client_test@servease.com',
                password: 'password123',
                role: 'client'
            })
        });
        const loginData = await loginRes.json();
        const token = loginData.token;
        console.log('Client logged in, token received');

        // Create Completed Booking
        const booking = await Booking.create({
            user: client._id,
            service: 'Test Service',
            serviceId: 1,
            date: new Date(),
            time: '12:00',
            duration: 2,
            address: 'Test Address',
            status: 'completed',
            assignedHelper: provider._id,
            helperName: provider.name,
            totalAmount: 500,
            paymentMethod: 'cash',
            paymentStatus: 'paid'
        });
        console.log('Completed booking created:', booking._id);

        // 2. Add Rating (API Call)
        console.log('Adding rating...');
        body: JSON.stringify({ rating: 5, review: 'Fantastic service w/ fetch!' })
    });
    const ratingData = await ratingRes.json();
    console.log('Rating added:', ratingData.success);

    // 3. Get Reviews (API Call)
    console.log('Fetching provider reviews...');
    const reviewsRes = await fetch(`${API_URL}/bookings/provider/${provider._id}/reviews`);
    const reviewsData = await reviewsRes.json();

    console.log('Reviews Data Full Response:', JSON.stringify(reviewsData, null, 2));

    if (
        reviewsData.success &&
        reviewsData.reviews &&
        reviewsData.reviews.length > 0 &&
        reviewsData.reviews[0].review === 'Fantastic service w/ fetch!' &&
        reviewsData.stats.averageRating === 5
    ) {
        console.log('VERIFICATION SUCCESSFUL');
    } else {
        console.log('VERIFICATION FAILED');
    }

    // Cleanup
    // await Booking.deleteMany({ user: client._id });
    // await User.findByIdAndDelete(client._id);
    // await User.findByIdAndDelete(provider._id);

    process.exit();
} catch (error) {
    console.error('Verification Error:', error.message);
    process.exit(1);
}
};

verifyReviewFlow();
