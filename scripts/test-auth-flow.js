const BASE_URL = 'http://localhost:3001';

async function testAuthFlow() {
  console.log('🧪 Testing Complete Auth Flow...\n');

  try {
    // Step 1: Login and get cookie
    console.log('1. Testing login...');
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

    if (!loginResponse.ok) {
      console.log('❌ Login failed, stopping test');
      return;
    }

    // Extract cookie from response
    const setCookieHeader = loginResponse.headers.get('set-cookie');
    console.log('Set-Cookie Header:', setCookieHeader);

    if (!setCookieHeader) {
      console.log('❌ No cookie set in login response');
      return;
    }

    // Extract token from cookie
    const tokenMatch = setCookieHeader.match(/token=([^;]+)/);
    const token = tokenMatch ? tokenMatch[1] : null;
    
    if (!token) {
      console.log('❌ No token found in cookie');
      return;
    }

    console.log('✅ Login successful, token extracted');
    console.log('Token (first 50 chars):', token.substring(0, 50) + '...');

    console.log('\n' + '='.repeat(50) + '\n');

    // Step 2: Test /api/auth/me with cookie
    console.log('2. Testing /api/auth/me with cookie...');
    const meResponse = await fetch(`${BASE_URL}/api/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `token=${token}`
      },
    });

    const meData = await meResponse.json();
    console.log('Me Response Status:', meResponse.status);
    console.log('Me Response:', JSON.stringify(meData, null, 2));

    if (meResponse.ok) {
      console.log('✅ Cookie authentication successful');
      console.log('User:', meData.user.name, '(' + meData.user.email + ')');
    } else {
      console.log('❌ Cookie authentication failed');
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // Step 3: Test browser-like request (without explicit cookie)
    console.log('3. Testing browser-like request...');
    const browserResponse = await fetch(`${BASE_URL}/api/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // No explicit cookie - simulating browser behavior
    });

    const browserData = await browserResponse.json();
    console.log('Browser Response Status:', browserResponse.status);
    console.log('Browser Response:', JSON.stringify(browserData, null, 2));

    if (browserResponse.ok) {
      console.log('✅ Browser-like request successful');
    } else {
      console.log('❌ Browser-like request failed (expected - no cookie persistence in Node.js)');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testAuthFlow();