require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

// Car Schema
const CarSchema = new mongoose.Schema({
  name: String,
  model: String,
  price: Number,
  category: String,
  year: Number,
  color: String,
  images: [String],
  specifications: {
    engine: String,
    transmission: String,
    fuelType: String,
    seating: Number,
    mileage: String,
    safety: [String],
    features: [String],
  },
  description: String,
  isAvailable: Boolean,
}, {
  timestamps: true,
});

const Car = mongoose.models.Car || mongoose.model('Car', CarSchema);

async function verifyCarsData() {
  try {
    console.log('🔄 Connecting to MongoDB Atlas...');
    
    await mongoose.connect(process.env.MONGODB_URI, {
      bufferCommands: false,
    });
    
    console.log('✅ Connected to MongoDB Atlas successfully');
    
    // Get all cars
    const cars = await Car.find({}).sort({ price: 1 });
    
    console.log(`\n📊 Found ${cars.length} cars in database:`);
    console.log('=' .repeat(60));
    
    cars.forEach((car, index) => {
      console.log(`\n${index + 1}. ${car.name}`);
      console.log(`   💰 Price: ${car.price.toLocaleString('vi-VN')} VND`);
      console.log(`   🏷️ Model: ${car.model} | Category: ${car.category}`);
      console.log(`   🎨 Color: ${car.color}`);
      console.log(`   🖼️ Images (${car.images.length}):`);
      car.images.forEach((img, i) => {
        console.log(`      ${i + 1}. ${img}`);
      });
      console.log(`   ⚙️ Engine: ${car.specifications.engine}`);
      console.log(`   ⛽ Fuel: ${car.specifications.fuelType}`);
      console.log(`   👥 Seating: ${car.specifications.seating} chỗ`);
      console.log(`   📏 Mileage: ${car.specifications.mileage}`);
    });
    
    // Statistics
    console.log('\n📈 Database Statistics:');
    console.log('=' .repeat(30));
    
    const stats = await Car.aggregate([
      {
        $group: {
          _id: null,
          totalCars: { $sum: 1 },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        }
      }
    ]);
    
    const categoryStats = await Car.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgPrice: { $avg: '$price' }
        }
      },
      { $sort: { count: -1 } }
    ]);
    
    const modelStats = await Car.aggregate([
      {
        $group: {
          _id: '$model',
          count: { $sum: 1 },
          avgPrice: { $avg: '$price' }
        }
      },
      { $sort: { count: -1 } }
    ]);
    
    if (stats.length > 0) {
      const stat = stats[0];
      console.log(`Total Cars: ${stat.totalCars}`);
      console.log(`Average Price: ${Math.round(stat.avgPrice).toLocaleString('vi-VN')} VND`);
      console.log(`Price Range: ${stat.minPrice.toLocaleString('vi-VN')} - ${stat.maxPrice.toLocaleString('vi-VN')} VND`);
    }
    
    console.log('\n📊 By Category:');
    categoryStats.forEach(cat => {
      console.log(`   ${cat._id}: ${cat.count} cars (avg: ${Math.round(cat.avgPrice).toLocaleString('vi-VN')} VND)`);
    });
    
    console.log('\n🚗 By Model:');
    modelStats.forEach(model => {
      console.log(`   ${model._id}: ${model.count} cars (avg: ${Math.round(model.avgPrice).toLocaleString('vi-VN')} VND)`);
    });
    
    // Test API endpoints
    console.log('\n🌐 Testing API endpoints...');
    
    try {
      const testResponse = await fetch('http://localhost:3001/api/cars?limit=3');
      if (testResponse.ok) {
        const testData = await testResponse.json();
        console.log(`✅ API /api/cars working - returned ${testData.data?.length || 0} cars`);
      } else {
        console.log('⚠️ API /api/cars not responding (server might not be running)');
      }
    } catch (error) {
      console.log('⚠️ API test failed (server might not be running)');
    }
    
    console.log('\n✅ Database verification completed!');
    console.log('\n🚀 Next steps:');
    console.log('   1. Start development server: npm run dev');
    console.log('   2. Visit homepage: http://localhost:3001/');
    console.log('   3. Check cars page: http://localhost:3001/cars');
    console.log('   4. Test car details and images');
    
  } catch (error) {
    console.error('❌ Error verifying database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB Atlas');
  }
}

verifyCarsData();