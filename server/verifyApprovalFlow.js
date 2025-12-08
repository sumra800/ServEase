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

const verifyApprovalFlow = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');

        const serviceId = 99; // Test Service ID

        // Cleanup
        await User.deleteMany({ servicesOffered: serviceId });
        await User.deleteMany({ email: { $in: ['client_flow@servease.com', 'provider_flow@servease.com', 'admin_flow@servease.com'] } });
        await Booking.deleteMany({ serviceId: serviceId });

        // Create Users
        const provider = await User.create({
            name: 'Flow Provider',
            email: 'provider_flow@servease.com',
            password: 'password123',
            role: 'staff',
            phone: '111',
            address: 'Provider St',
            servicesOffered: [serviceId]
        });

        const client = await User.create({
            name: 'Flow Client',
            email: 'client_flow@servease.com',
            password: 'password123',
            role: 'client',
            phone: '222',
            address: 'Client St'
        });

        // Create Admin manually (since signup is restricted)
        const admin = await User.create({
            name: 'Flow Admin',
            email: 'admin_flow@servease.com',
            password: 'password123',
            role: 'admin',
            phone: '333',
            address: 'Admin St'
        });

        // Tokens
        const clientToken = (await checkResponse(await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: client.email, password: 'password123' })
        }), 'Client Login')).token;

        const providerToken = (await checkResponse(await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: provider.email, password: 'password123' })
        }), 'Provider Login')).token;

        const adminToken = (await checkResponse(await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: admin.email, password: 'password123' })
        }), 'Admin Login')).token;

        console.log('Users created and logged in');

        // 1. Client creates booking (with provider selected)
        const bookingRes = await fetch(`${API_URL}/bookings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${clientToken}`
            },
            body: JSON.stringify({
                service: 'Flow Service',
                serviceId: serviceId,
                date: new Date().toISOString().split('T')[0],
                time: '12:00',
                duration: 2,
                address: 'Client Address',
                assignedHelper: provider._id, // Manually assign
                helperName: provider.name
            })
        });
        const bookingData = await checkResponse(bookingRes, 'Create Booking');
        const bookingId = bookingData.booking._id;
        console.log('Booking 1 (Pending Admin):', bookingData.booking.status);

        if (bookingData.booking.status !== 'pending_admin') {
            throw new Error('Initial status should be pending_admin');
        }

        // 2. Admin approves booking
        const approveRes = await fetch(`${API_URL}/bookings/${bookingId}/approve-admin`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        const approveData = await checkResponse(approveRes, 'Admin Approve');
        console.log('Booking 2 (Pending Provider):', approveData.booking.status);

        if (approveData.booking.status !== 'pending_provider') {
            throw new Error('Status after admin approval should be pending_provider');
        }

        // 3. Provider accepts booking
        const acceptRes = await fetch(`${API_URL}/bookings/${bookingId}/respond-provider`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${providerToken}`
            },
            body: JSON.stringify({ response: 'accept' })
        });
        const acceptData = await checkResponse(acceptRes, 'Provider Accept');
        console.log('Booking 3 (Confirmed):', acceptData.booking.status);

        if (acceptData.booking.status !== 'confirmed') {
            throw new Error('Status after acceptance should be confirmed');
        }

        // 4. Provider marks completed
        const completeRes = await fetch(`${API_URL}/bookings/${bookingId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${providerToken}`
            },
            body: JSON.stringify({ status: 'completed' })
        });
        const completeData = await checkResponse(completeRes, 'Mark Completed');
        console.log('Booking 4 (Completed):', completeData.booking.status);

        if (completeData.booking.status !== 'completed') {
            throw new Error('Final status should be completed');
        }

        console.log('APPROVAL FLOW VERIFIED SUCCESSFUL');
        process.exit();
    } catch (error) {
        console.error('Verification Error:', error.message);
        process.exit(1);
    }
};

verifyApprovalFlow();
