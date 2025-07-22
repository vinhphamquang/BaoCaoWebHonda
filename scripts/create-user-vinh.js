require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const User = require('../src/models/User.ts');

async function createUserVinh() {
  try {
    console.log('🔄 Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas successfully');

    // Check if user already exists
    const existingUser = await User.findOne({ email: 'vphamquang539@gmail.com' });
    
    if (existingUser) {
      console.log('⚠️ User already exists');
      console.log('Email:', existingUser.email);
      console.log('Name:', existingUser.name);
      
      // Test password
      const isPasswordValid = await existingUser.comparePassword('123456');
      console.log('Password validation test:', isPasswordValid ? '✅ PASS' : '❌ FAIL');
      
      return;
    }

    // Create new user
    const userData = {
      name: 'Vinh Pham',
      email: 'vphamquang539@gmail.com',
      password: '123456',
      phone: '0901039355',
      address: {
        street: 'dddd',
        city: 'Ho Chi Minh City',
        state: 'Ho Chi Minh',
        zipCode: '70000',
        country: 'Vietnam'
      },
      role: 'user',
      isActive: true
    };

    const user = new User(userData);
    await user.save();

    console.log('✅ User created successfully');
    console.log('Email:', user.email);
    console.log('Name:', user.name);
    console.log('Phone:', user.phone);
    
    // Test password
    const isPasswordValid = await user.comparePassword('123456');
    console.log('Password validation test:', isPasswordValid ? '✅ PASS' : '❌ FAIL');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB Atlas');
  }
}

createUserVinh();