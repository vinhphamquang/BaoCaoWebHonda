const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

// Car Schema (same as in the app)
const CarSchema = new mongoose.Schema({
  name: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  price: { type: Number, required: true },
  color: { type: String, required: true },
  images: [{ type: String, required: true }],
  specifications: {
    engine: { type: String, required: true },
    transmission: { type: String, required: true },
    fuelType: { type: String, required: true },
    seating: { type: Number, required: true },
    mileage: { type: String, required: true },
    safety: [{ type: String }],
    features: [{ type: String }],
  },
  description: { type: String, required: true },
  category: { type: String, required: true, enum: ['sedan', 'suv', 'hatchback', 'coupe'] },
  isAvailable: { type: Boolean, default: true },
}, { timestamps: true });

const Car = mongoose.model('Car', CarSchema);

async function testAPI() {
  try {
    console.log('🔄 Testing MongoDB Atlas API functionality...');
    
    await mongoose.connect(process.env.MONGODB_URI, {
      bufferCommands: false,
    });
    
    console.log('✅ Connected to MongoDB Atlas');
    
    // Test 1: Get all cars with pagination
    console.log('\n📋 Test 1: Get all cars with pagination');
    const page = 1;
    const limit = 5;
    const skip = (page - 1) * limit;
    
    const [cars, total] = await Promise.all([
      Car.find({ isAvailable: true })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Car.countDocuments({ isAvailable: true })
    ]);
    
    console.log(`✅ Found ${cars.length} cars out of ${total} total`);
    console.log('Sample cars:', cars.map(c => `${c.name} - ${c.price.toLocaleString('vi-VN')} VND`));
    
    // Test 2: Search functionality
    console.log('\n🔍 Test 2: Search functionality');
    const searchTerm = 'civic';
    const searchResults = await Car.find({
      isAvailable: true,
      $or: [
        { name: { $regex: searchTerm, $options: 'i' } },
        { model: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } }
      ]
    }).lean();
    
    console.log(`✅ Search for "${searchTerm}" found ${searchResults.length} results`);
    searchResults.forEach(car => {
      console.log(`  - ${car.name} (${car.model})`);
    });
    
    // Test 3: Filter by category
    console.log('\n🏷️ Test 3: Filter by category');
    const categories = await Car.aggregate([
      { $match: { isAvailable: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    console.log('✅ Categories:');
    categories.forEach(cat => {
      console.log(`  - ${cat._id}: ${cat.count} cars`);
    });
    
    // Test 4: Price range filter
    console.log('\n💰 Test 4: Price range filter');
    const priceRanges = [
      { min: 0, max: 600000000, label: 'Under 600M' },
      { min: 600000000, max: 1000000000, label: '600M - 1B' },
      { min: 1000000000, max: 2000000000, label: '1B - 2B' },
      { min: 2000000000, max: 999999999999, label: 'Over 2B' }
    ];
    
    for (const range of priceRanges) {
      const count = await Car.countDocuments({
        isAvailable: true,
        price: { $gte: range.min, $lte: range.max }
      });
      console.log(`  - ${range.label}: ${count} cars`);
    }
    
    // Test 5: Aggregation pipeline (like the API)
    console.log('\n📊 Test 5: Aggregation pipeline');
    const pipeline = [
      { $match: { isAvailable: true } },
      {
        $facet: {
          data: [
            { $sort: { createdAt: -1 } },
            { $limit: 3 },
            { $project: { name: 1, model: 1, price: 1, category: 1 } }
          ],
          totalCount: [
            { $count: "count" }
          ],
          stats: [
            {
              $group: {
                _id: null,
                avgPrice: { $avg: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' }
              }
            }
          ]
        }
      }
    ];
    
    const [result] = await Car.aggregate(pipeline);
    console.log('✅ Aggregation results:');
    console.log(`  - Total cars: ${result.totalCount[0]?.count || 0}`);
    console.log(`  - Average price: ${result.stats[0]?.avgPrice?.toLocaleString('vi-VN') || 0} VND`);
    console.log(`  - Price range: ${result.stats[0]?.minPrice?.toLocaleString('vi-VN')} - ${result.stats[0]?.maxPrice?.toLocaleString('vi-VN')} VND`);
    console.log('  - Latest cars:', result.data.map(c => c.name));
    
    console.log('\n🎉 All API functionality tests passed!');
    
  } catch (error) {
    console.error('❌ API test failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB Atlas');
  }
}

testAPI();