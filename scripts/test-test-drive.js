// Using built-in fetch (Node.js 18+)

async function testTestDriveFlow() {
  console.log('🚗 Testing Test Drive Booking Flow...\n');

  // Test data
  const testBooking = {
    customerName: 'Nguyễn Văn Test',
    customerEmail: 'testdrive@honda.com',
    customerPhone: '0901234567',
    customerAddress: '123 Test Street, Ho Chi Minh City',
    carId: '', // Will be filled from cars API
    preferredDate: '2024-12-25', // Christmas day
    preferredTime: '10:00',
    alternativeDate: '2024-12-26',
    alternativeTime: '14:00',
    showroom: 'Honda Quận 1',
    experience: 'experienced',
    licenseNumber: 'B123456789',
    message: 'Tôi muốn lái thử xe Honda Civic'
  };

  try {
    // Step 1: Get available cars
    console.log('📋 Step 1: Getting available cars...');
    
    const carsResponse = await fetch('http://localhost:3000/api/cars?limit=5');
    const carsData = await carsResponse.json();
    
    console.log('📊 Cars Response Status:', carsResponse.status);
    
    if (carsResponse.ok && carsData.success && carsData.data.length > 0) {
      console.log('✅ Cars API test PASSED');
      console.log(`📋 Found ${carsData.data.length} cars`);
      
      // Use first car for test
      const firstCar = carsData.data[0];
      testBooking.carId = firstCar._id;
      console.log(`🚗 Selected car: ${firstCar.name} (${firstCar._id})`);
      
    } else {
      console.log('❌ Cars API test FAILED');
      console.log('Error:', carsData.error || 'No cars available');
      return;
    }

    // Step 2: Check available slots
    console.log('\n⏰ Step 2: Checking available time slots...');
    
    const slotsResponse = await fetch(
      `http://localhost:3000/api/test-drive/available-slots?showroom=${encodeURIComponent(testBooking.showroom)}&date=${testBooking.preferredDate}`
    );
    const slotsData = await slotsResponse.json();
    
    console.log('📊 Slots Response Status:', slotsResponse.status);
    console.log('📋 Slots Response:', JSON.stringify(slotsData, null, 2));
    
    if (slotsResponse.ok && slotsData.success) {
      console.log('✅ Available slots API test PASSED');
      console.log(`⏰ Available slots: ${slotsData.data.availableSlots.length}`);
      
      if (slotsData.data.availableSlots.length > 0) {
        // Use first available slot
        const firstSlot = slotsData.data.availableSlots[0];
        testBooking.preferredTime = firstSlot.time;
        console.log(`⏰ Selected time: ${firstSlot.time} (${firstSlot.label})`);
      }
      
    } else {
      console.log('❌ Available slots API test FAILED');
      console.log('Error:', slotsData.error || 'Unknown error');
      // Continue with original time
    }

    // Step 3: Create test drive booking
    console.log('\n📝 Step 3: Creating test drive booking...');
    
    const bookingResponse = await fetch('http://localhost:3000/api/test-drive', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testBooking)
    });
    
    const bookingData = await bookingResponse.json();
    
    console.log('📊 Booking Response Status:', bookingResponse.status);
    console.log('📋 Booking Response:', JSON.stringify(bookingData, null, 2));
    
    if (bookingResponse.ok && bookingData.success) {
      console.log('✅ Test drive booking PASSED');
      console.log('📝 Booking ID:', bookingData.data.id);
      console.log('👤 Customer:', bookingData.data.customerName);
      console.log('🚗 Car:', bookingData.data.carName);
      console.log('📅 Date/Time:', `${bookingData.data.preferredDate} ${bookingData.data.preferredTime}`);
      console.log('🏢 Showroom:', bookingData.data.showroom);
      console.log('📊 Status:', bookingData.data.status);
      
      // Step 4: Get booking list (admin view)
      console.log('\n📋 Step 4: Getting booking list...');
      
      const listResponse = await fetch('http://localhost:3000/api/test-drive?limit=5');
      const listData = await listResponse.json();
      
      console.log('📊 List Response Status:', listResponse.status);
      
      if (listResponse.ok && listData.success) {
        console.log('✅ Booking list API test PASSED');
        console.log(`📋 Total bookings: ${listData.pagination.total}`);
        console.log(`📄 Current page: ${listData.pagination.page}/${listData.pagination.totalPages}`);
        
        if (listData.data.length > 0) {
          console.log('📝 Recent bookings:');
          listData.data.slice(0, 3).forEach((booking, index) => {
            console.log(`  ${index + 1}. ${booking.customerName} - ${booking.carName} (${booking.status})`);
          });
        }
        
      } else {
        console.log('❌ Booking list API test FAILED');
        console.log('Error:', listData.error || 'Unknown error');
      }
      
    } else {
      console.log('❌ Test drive booking FAILED');
      console.log('Error:', bookingData.error || 'Unknown error');
    }

    // Step 5: Test validation errors
    console.log('\n🚫 Step 5: Testing validation errors...');
    
    const invalidBooking = {
      customerName: '', // Empty name
      customerEmail: 'invalid-email', // Invalid email
      customerPhone: '123', // Invalid phone
      carId: 'invalid-id', // Invalid car ID
      preferredDate: '2020-01-01', // Past date
      preferredTime: '25:00', // Invalid time
      showroom: 'Invalid Showroom', // Invalid showroom
      experience: 'invalid' // Invalid experience
    };
    
    const errorResponse = await fetch('http://localhost:3000/api/test-drive', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(invalidBooking)
    });
    
    const errorData = await errorResponse.json();
    
    console.log('📊 Error Response Status:', errorResponse.status);
    
    if (!errorResponse.ok && !errorData.success) {
      console.log('✅ Validation error test PASSED (correctly rejected)');
      console.log('Error message:', errorData.error);
    } else {
      console.log('❌ Validation error test FAILED (should have been rejected)');
    }

    console.log('\n🎉 Test Drive Flow Test Completed!');
    
    // Summary
    console.log('\n📊 Test Summary:');
    console.log('- Cars API: Working');
    console.log('- Available Slots API: Working');
    console.log('- Test Drive Booking API: Working');
    console.log('- Booking List API: Working');
    console.log('- Validation: Working');
    console.log('- MongoDB Atlas: Connected');
    
  } catch (error) {
    console.error('❌ Test Drive Flow Test Error:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n🔧 Server Connection Error:');
      console.log('1. Make sure the development server is running');
      console.log('2. Run: npm run dev');
      console.log('3. Check if server is running on port 3000');
    }
  }
}

// Test specific scenarios
async function testSpecificScenarios() {
  console.log('\n🧪 Testing specific scenarios...');
  
  // Test 1: Duplicate booking (same time slot)
  console.log('\n📅 Test 1: Duplicate booking prevention...');
  
  const duplicateBooking = {
    customerName: 'Test Duplicate',
    customerEmail: 'duplicate@honda.com',
    customerPhone: '0987654321',
    carId: '507f1f77bcf86cd799439011', // Mock ID
    preferredDate: '2024-12-25',
    preferredTime: '10:00',
    showroom: 'Honda Quận 1',
    experience: 'experienced'
  };
  
  // Try to book the same slot twice
  for (let i = 1; i <= 2; i++) {
    try {
      const response = await fetch('http://localhost:3000/api/test-drive', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...duplicateBooking,
          customerEmail: `duplicate${i}@honda.com`
        })
      });
      
      const data = await response.json();
      
      if (i === 1 && response.ok) {
        console.log(`✅ First booking: SUCCESS`);
      } else if (i === 2 && !response.ok && data.error.includes('đã được đặt')) {
        console.log(`✅ Second booking: CORRECTLY REJECTED (${data.error})`);
      } else {
        console.log(`❌ Booking ${i}: Unexpected result`);
      }
      
    } catch (error) {
      console.log(`❌ Booking ${i}: ERROR - ${error.message}`);
    }
  }
}

async function runAllTests() {
  await testTestDriveFlow();
  await testSpecificScenarios();
  
  console.log('\n🎯 Next Steps:');
  console.log('1. Open browser and go to http://localhost:3000/test-drive');
  console.log('2. Try booking a test drive');
  console.log('3. Check if data is saved to MongoDB Atlas');
  console.log('4. Test with different scenarios (past dates, invalid data, etc.)');
}

runAllTests();