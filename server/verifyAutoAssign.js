const mongoose = require('mongoose');
const User = require('./models/User');
const Booking = require('./models/Booking');
const dotenv = require('dotenv');

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

const verifyAutoAssign = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');

        const serviceId = 99; // Test Service ID

        // Cleanup old test users
        await User.deleteMany({ servicesOffered: serviceId });
        await User.deleteMany({ email: 'client_auto@servease.com' });
        await Booking.deleteMany({ serviceId: serviceId });

        // Create Provider
        const provider = await User.create({
            name: 'Auto Provider',
            email: 'provider_auto@servease.com',
            password: 'password123',
            role: 'staff',
            phone: '1112223333',
            address: '123 Provider St',
            servicesOffered: [serviceId]
        });
        console.log('Provider created with service:', serviceId);

        // Create Client
        const client = await User.create({
            name: 'Auto Client',
            email: 'client_auto@servease.com',
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
            body: JSON.stringify({ email: client.email, password: 'password123' })
        });
        const clientToken = (await clientLoginRes.json()).token;

        // Create Booking WITHOUT selecting provider
        const bookingRes = await fetch(`${API_URL}/bookings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${clientToken}`
            },
            body: JSON.stringify({
                service: 'Auto Service',
                serviceId: serviceId,
                date: new Date().toISOString().split('T')[0],
                time: '10:00',
                duration: 2,
                address: 'Client Address'
                // No assignedHelper passed
            })
        });
        const bookingData = await checkResponse(bookingRes, 'Create Auto Booking');
        const booking = bookingData.booking;

        console.log('Booking created:', booking._id);
        console.log('Assigned Helper (Booking):', booking.assignedHelper);
        console.log('Provider ID:', provider._id);
        console.log('Status:', booking.status);

        // Use loose equality to handle String vs Object ID
        if (booking.assignedHelper == provider._id && booking.status === 'confirmed') {
            console.log('AUTO ASSIGNMENT VERIFIED SUCCESSFUL');
        } else {
            throw new Error('Auto assignment failed');
        }

        process.exit();
    } catch (error) {
        console.error('Verification Error:', error.message);
        process.exit(1);
    }
};

verifyAutoAssign();
