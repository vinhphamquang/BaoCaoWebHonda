const BASE_URL = 'http://localhost:3001';

async function testContactAPI() {
  console.log('🧪 Testing Contact API...\n');

  try {
    // Test 1: Submit contact form
    console.log('1. Testing contact form submission...');
    const contactData = {
      name: 'Nguyễn Văn Test',
      email: 'test@example.com',
      phone: '0901234567',
      subject: 'Tư vấn mua xe',
      message: 'Tôi muốn tư vấn về dòng xe Honda Civic 2024. Vui lòng liên hệ lại với tôi.'
    };

    const submitResponse = await fetch(`${BASE_URL}/api/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contactData),
    });

    const submitResult = await submitResponse.json();
    console.log('Submit Response Status:', submitResponse.status);
    console.log('Submit Response:', JSON.stringify(submitResult, null, 2));

    if (submitResponse.ok) {
      console.log('✅ Contact form submission successful');
    } else {
      console.log('❌ Contact form submission failed');
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // Test 2: Get contacts list
    console.log('2. Testing get contacts list...');
    const getResponse = await fetch(`${BASE_URL}/api/contact?page=1&limit=5`);
    const getResult = await getResponse.json();
    
    console.log('Get Response Status:', getResponse.status);
    console.log('Get Response:', JSON.stringify(getResult, null, 2));

    if (getResponse.ok) {
      console.log('✅ Get contacts list successful');
      console.log(`📊 Total contacts: ${getResult.pagination?.totalItems || 0}`);
    } else {
      console.log('❌ Get contacts list failed');
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // Test 3: Submit invalid data
    console.log('3. Testing validation with invalid data...');
    const invalidData = {
      name: '',
      email: 'invalid-email',
      phone: '123',
      subject: '',
      message: ''
    };

    const invalidResponse = await fetch(`${BASE_URL}/api/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(invalidData),
    });

    const invalidResult = await invalidResponse.json();
    console.log('Invalid Response Status:', invalidResponse.status);
    console.log('Invalid Response:', JSON.stringify(invalidResult, null, 2));

    if (!invalidResponse.ok) {
      console.log('✅ Validation working correctly');
    } else {
      console.log('❌ Validation should have failed');
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // Test 4: Submit multiple contacts
    console.log('4. Testing multiple contact submissions...');
    const contacts = [
      {
        name: 'Trần Thị B',
        email: 'tranthib@example.com',
        phone: '0987654321',
        subject: 'Đặt lịch lái thử',
        message: 'Tôi muốn đặt lịch lái thử xe Honda Accord vào cuối tuần này.'
      },
      {
        name: 'Lê Văn C',
        email: 'levanc@example.com',
        phone: '0912345678',
        subject: 'Bảo hành và bảo dưỡng',
        message: 'Xe của tôi cần bảo dưỡng định kỳ. Vui lòng tư vấn lịch hẹn.'
      }
    ];

    for (let i = 0; i < contacts.length; i++) {
      const response = await fetch(`${BASE_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contacts[i]),
      });

      const result = await response.json();
      console.log(`Contact ${i + 1} - Status: ${response.status}, Success: ${result.success}`);
    }

    console.log('✅ Multiple contacts submitted');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testContactAPI();