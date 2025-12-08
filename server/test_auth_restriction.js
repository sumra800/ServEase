async function testAuth() {
    const baseUrl = 'http://localhost:5000/api/auth';

    // 1. Test Admin Login
    console.log('--- Testing Admin Login ---');
    try {
        const response = await fetch(`${baseUrl}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'admin@servease.com',
                password: 'adminpassword123'
            })
        });
        const data = await response.json();

        if (response.ok) {
            console.log('SUCCESS: Admin logged in successfully.');
            console.log('Token received:', !!data.token);
            console.log('User Role:', data.user.role);
        } else {
            console.log('FAILURE: Admin login failed.');
            console.log(data);
        }
    } catch (err) {
        console.error('Error testing admin login:', err.message);
    }

    // 2. Test Admin Registration (Should Fail)
    console.log('\n--- Testing Admin Registration Restriction ---');
    try {
        const response = await fetch(`${baseUrl}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Fake Admin',
                email: 'fakeadmin@test.com',
                password: 'password123',
                phone: '1234567890',
                address: 'Nowhere',
                role: 'admin'
            })
        });
        const data = await response.json();

        if (!response.ok) {
            console.log('SUCCESS: Admin registration was rejected as expected.');
            console.log('Status:', response.status);
            console.log('Errors:', JSON.stringify(data.errors || data.message));
        } else {
            console.log('FAILURE: Admin registration SUCCEEDED (This is bad).');
        }
    } catch (err) {
        console.error('Error testing admin registration:', err.message);
    }
}

testAuth();
