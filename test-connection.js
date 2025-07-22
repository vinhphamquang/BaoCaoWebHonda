const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://dinh:11122004@cuahangoto.ywhsxsf.mongodb.net/?retryWrites=true&w=majority&appName=cuahangoto';

async function testConnection() {
  try {
    console.log('🔄 Testing MongoDB Atlas connection...');
    
    await mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
    
    console.log('✅ Connected to MongoDB Atlas successfully');
    console.log('Database:', mongoose.connection.name);
    console.log('Host:', mongoose.connection.host);
    console.log('Ready state:', mongoose.connection.readyState);
    
    // Test a simple query
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));
    
    await mongoose.disconnect();
    console.log('✅ Connection test completed');
    
  } catch (error) {
    console.error('❌ Connection test failed:', error);
  }
}

testConnection();