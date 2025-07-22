const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

// User Schema (same as in the app)
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  phone: {
    type: String,
    trim: true,
  },
  address: {
    type: String,
    trim: true,
  },
  avatar: {
    type: String,
    default: null
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  resetPasswordToken: {
    type: String,
    default: null
  },
  resetPasswordExpiry: {
    type: Date,
    default: null
  },
  lastLogin: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
UserSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Lỗi khi so sánh mật khẩu');
  }
};

const User = mongoose.model('User', UserSchema);

async function createTestUser() {
  try {
    console.log('🔄 Connecting to MongoDB Atlas...');
    
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI not found in environment variables');
    }
    
    await mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
    
    console.log('✅ Connected to MongoDB Atlas successfully');
    
    // Check if Vinh user already exists
    const existingVinh = await User.findOne({ email: 'vphamquang539@gmail.com' });
    
    if (!existingVinh) {
      console.log('🔄 Creating Vinh user...');
      
      const vinhUser = new User({
        name: 'Vinh Pham',
        email: 'vphamquang539@gmail.com',
        password: '123456',
        phone: '0901039355',
        address: 'dddd',
        role: 'user',
        isActive: true,
        emailVerified: true
      });
      
      await vinhUser.save();
      console.log('✅ Vinh user created successfully!');
    } else {
      console.log('⚠️ Vinh user already exists');
    }

    // Check if test user already exists
    const existingUser = await User.findOne({ email: 'test@honda.com' });
    
    if (existingUser) {
      console.log('⚠️ Test user already exists');
      console.log('Email: test@honda.com');
      console.log('Password: 123456');
      
      // Test password comparison
      const isPasswordValid = await existingUser.comparePassword('123456');
      console.log('Password validation test:', isPasswordValid ? '✅ PASS' : '❌ FAIL');
    } else {
      // Create test user
      console.log('🔄 Creating test user...');
      
      const testUser = new User({
        name: 'Test User',
        email: 'test@honda.com',
        password: '123456',
        phone: '0901234567',
        address: '123 Test Street, Ho Chi Minh City',
        role: 'user',
        isActive: true,
        emailVerified: true
      });
      
      await testUser.save();
    }
    
    console.log('✅ Test user created successfully!');
    console.log('📧 Email: test@honda.com');
    console.log('🔑 Password: 123456');
    console.log('👤 Name: Test User');
    console.log('📱 Phone: 0901234567');
    
    // Test password comparison
    const savedUser = await User.findOne({ email: 'test@honda.com' }).select('+password');
    const isPasswordValid = await savedUser.comparePassword('123456');
    console.log('🧪 Password validation test:', isPasswordValid ? '✅ PASS' : '❌ FAIL');
    
    // Create admin user too
    const existingAdmin = await User.findOne({ email: 'admin@honda.com' });
    
    if (!existingAdmin) {
      console.log('🔄 Creating admin user...');
      
      const adminUser = new User({
        name: 'Admin User',
        email: 'admin@honda.com',
        password: 'admin123',
        phone: '0901234568',
        address: '456 Admin Street, Ho Chi Minh City',
        role: 'admin',
        isActive: true,
        emailVerified: true
      });
      
      await adminUser.save();
      
      console.log('✅ Admin user created successfully!');
      console.log('📧 Email: admin@honda.com');
      console.log('🔑 Password: admin123');
      console.log('👤 Role: admin');
    }
    
    console.log('\n🎉 Test users ready for login testing!');
    console.log('\n📝 Test Credentials:');
    console.log('User Account:');
    console.log('  Email: test@honda.com');
    console.log('  Password: 123456');
    console.log('\nAdmin Account:');
    console.log('  Email: admin@honda.com');
    console.log('  Password: admin123');
    
  } catch (error) {
    console.error('❌ Error creating test user:', error);
    
    if (error.message.includes('authentication failed')) {
      console.log('\n🔧 Authentication Error Solutions:');
      console.log('1. Check username/password in MongoDB Atlas');
      console.log('2. Ensure database user has read/write permissions');
      console.log('3. Check IP whitelist in Network Access');
      console.log('4. Verify connection string format');
    }
    
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB Atlas');
  }
}

createTestUser();