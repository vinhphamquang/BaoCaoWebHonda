const BASE_URL = 'http://localhost:3001';

async function testLoginFlow() {
  console.log('🧪 Testing Login Flow...\n');

  try {
    // Test 1: Login with valid credentials
    console.log('1. Testing login with valid credentials...');
    const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'vphamquang539@gmail.com',
        password: '123456'
      }),
    });

    const loginData = await loginResponse.json();
    console.log('Login Response Status:', loginResponse.status);
    console.log('Login Response:', JSON.stringify(loginData, null, 2));

    if (loginResponse.ok) {
      console.log('✅ Login successful');
      
      // Extract cookie from response
      const cookies = loginResponse.headers.get('set-cookie');
      console.log('Cookies:', cookies);
    } else {
      console.log('❌ Login failed');
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // Test 2: Login with invalid credentials
    console.log('2. Testing login with invalid credentials...');
    const invalidLoginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'invalid@email.com',
        password: 'wrongpassword'
      }),
    });

    const invalidLoginData = await invalidLoginResponse.json();
    console.log('Invalid Login Response Status:', invalidLoginResponse.status);
    console.log('Invalid Login Response:', JSON.stringify(invalidLoginData, null, 2));

    if (!invalidLoginResponse.ok) {
      console.log('✅ Invalid login correctly rejected');
    } else {
      console.log('❌ Invalid login should have been rejected');
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // Test 3: Check if user exists
    console.log('3. Checking if test user exists...');
    const userCheckResponse = await fetch(`${BASE_URL}/api/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const userCheckData = await userCheckResponse.json();
    console.log('User Check Response Status:', userCheckResponse.status);
    console.log('User Check Response:', JSON.stringify(userCheckData, null, 2));

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testLoginFlow();