// Using built-in fetch (Node.js 18+)

async function testLoginAPI() {
  try {
    console.log('🔄 Testing Login API...');
    
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@honda.com',
        password: '123456'
      })
    });
    
    const data = await response.json();
    
    console.log('📊 Response Status:', response.status);
    console.log('📋 Response Data:', JSON.stringify(data, null, 2));
    
    if (response.ok && data.success) {
      console.log('✅ Login API test PASSED');
      console.log('👤 User:', data.user.name);
      console.log('📧 Email:', data.user.email);
      console.log('🔑 Role:', data.user.role);
    } else {
      console.log('❌ Login API test FAILED');
      console.log('Error:', data.message || 'Unknown error');
    }
    
  } catch (error) {
    console.error('❌ API Test Error:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n🔧 Server Connection Error:');
      console.log('1. Make sure the development server is running');
      console.log('2. Run: npm run dev');
      console.log('3. Check if server is running on port 3000');
    }
  }
}

// Test with wrong credentials too
async function testWrongCredentials() {
  try {
    console.log('\n🔄 Testing with wrong credentials...');
    
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@honda.com',
        password: 'wrongpassword'
      })
    });
    
    const data = await response.json();
    
    console.log('📊 Response Status:', response.status);
    console.log('📋 Response Data:', JSON.stringify(data, null, 2));
    
    if (!response.ok && !data.success) {
      console.log('✅ Wrong credentials test PASSED (correctly rejected)');
    } else {
      console.log('❌ Wrong credentials test FAILED (should have been rejected)');
    }
    
  } catch (error) {
    console.error('❌ Wrong credentials test error:', error.message);
  }
}

async function runTests() {
  await testLoginAPI();
  await testWrongCredentials();
}

runTests();