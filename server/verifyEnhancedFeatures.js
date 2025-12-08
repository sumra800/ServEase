const mongoose = require('mongoose');
const User = require('./models/User');
const Booking = require('./models/Booking');
const dotenv = require('dotenv');
// const bcrypt = require('bcryptjs'); // Not needed if we don't hash manually

dotenv.config();

const API_URL = 'http://localhost:5000/api';

const checkResponse = async (res, name) => {
    const data = await res.json();
    if (!res.ok) {
        console.error(`${name} failed with status ${res.status}:`, JSON.stringify(data, null, 2));
        throw new Error(`${name} failed`);
    }
    return data;
};

const verifyEnhancedFeatures = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');

        // 1. Setup Service and Provider
        const serviceId = 99; // Test Service ID

        // Cleanup old test users
        await User.deleteMany({ email: { $in: ['provider_enh@servease.com', 'client_enh@servease.com'] } });
        await Booking.deleteMany({ serviceId: 99 }); // Cleanup bookings for this service

        const provider = await User.create({
            name: 'Enhanced Provider',
            email: 'provider_enh@servease.com',
            password: 'password123',
            role: 'staff',
            phone: '1112223333',
            address: '123 Provider St',
            servicesOffered: [serviceId]
        });
        console.log('Provider created with service:', serviceId);

        // Create Client
        const client = await User.create({
            name: 'Enhanced Client',
            email: 'client_enh@servease.com',
            password: 'password123',
            role: 'client',
            phone: '4445556666',
            address: '456 Client Ave'
        });
        console.log('Client created');

        // Login Client
        const clientLoginRes = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: ('client_enh@servease.com').toLowerCase(), password: 'password123' })
        });
        const clientData = await checkResponse(clientLoginRes, 'Client Login');
        const clientToken = clientData.token;

        // Login Provider
        const providerLoginRes = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: ('provider_enh@servease.com').toLowerCase(), password: 'password123' })
        });
        const providerData = await checkResponse(providerLoginRes, 'Provider Login');
        const providerToken = providerData.token;

        console.log('Tokens received');

        // 2. Fetch Providers for Service
        const providersRes = await fetch(`${API_URL}/auth/providers?serviceId=${serviceId}`);
        const providersData = await checkResponse(providersRes, 'Fetch Providers');
        console.log('Providers fetched count:', providersData.count);

        if (providersData.count !== 1 || providersData.providers[0]._id !== provider._id.toString()) {
            throw new Error('Provider filtering failed');
        }
        console.log('Provider filtering verified');

        // 3. Create Booking with Selected Provider
        const bookingRes = await fetch(`${API_URL}/bookings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${clientToken}`
            },
            body: JSON.stringify({
                service: 'Enhanced Service',
                serviceId: serviceId,
                date: new Date().toISOString().split('T')[0],
                time: '14:00',
                duration: 2,
                address: 'Client Address',
                paymentMethod: 'cash',
                assignedHelper: provider._id,
                helperName: provider.name
            })
        });
        const bookingData = await checkResponse(bookingRes, 'Create Booking');
        const bookingId = bookingData.booking._id;
        console.log('Booking created with provider:', bookingId);

        // 4. Verify Provider can see booking
        const providerBookingsRes = await fetch(`${API_URL}/bookings`, {
            headers: { 'Authorization': `Bearer ${providerToken}` }
        });
        const providerBookingsData = await checkResponse(providerBookingsRes, 'Fetch Provider Bookings');
        console.log('Provider bookings count:', providerBookingsData.count);

        if (!providerBookingsData.bookings.find(b => b._id === bookingId)) {
            throw new Error('Provider cannot see assigned booking');
        }
        console.log('Provider dashboard visibility verified');

        // 5. Provider Updates Status
        const updateStatusRes = await fetch(`${API_URL}/bookings/${bookingId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${providerToken}`
            },
            body: JSON.stringify({ status: 'completed' })
        });
        await checkResponse(updateStatusRes, 'Update Status');
        console.log('Booking marked completed');

        // 6. Provider Rates Client
        const rateClientRes = await fetch(`${API_URL}/bookings/${bookingId}/client-rating`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${providerToken}`
            },
            body: JSON.stringify({ rating: 5, review: 'Great client!' })
        });
        const rateClientData = await checkResponse(rateClientRes, 'Rate Client');

        if (!rateClientData.success || rateClientData.booking.clientRating !== 5) {
            throw new Error('Client rating failed');
        }
        console.log('Client rating verified');

        console.log('ALL ENHANCED FEATURES VERIFIED SUCCESSFUL');
        process.exit();

    } catch (error) {
        console.error('Verification Error:', error.message);
        process.exit(1);
    }
};

verifyEnhancedFeatures();
