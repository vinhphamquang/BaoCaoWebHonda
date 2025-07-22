const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

// Car Schema
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

// Sample data
const sampleCars = [
  {
    name: "Honda Civic 2024",
    model: "Civic",
    price: 730000000,
    category: "sedan",
    year: 2024,
    color: "Trắng Ngọc Trai",
    images: ["/images/cars/honda-civic-2024.jpg"],
    specifications: {
      engine: "1.5L VTEC Turbo",
      transmission: "CVT",
      fuelType: "Xăng",
      seating: 5,
      mileage: "6.5L/100km",
      safety: ["Honda SENSING", "6 túi khí", "Phanh ABS", "Cân bằng điện tử"],
      features: ["Màn hình cảm ứng 7 inch", "Apple CarPlay", "Android Auto", "Camera lùi"]
    },
    description: "Honda Civic 2024 - Xe Honda chính hãng với thiết kế hiện đại, động cơ mạnh mẽ và tiết kiệm nhiên liệu",
    isAvailable: true
  },
  {
    name: "Honda CR-V 2024",
    model: "CR-V",
    price: 1050000000,
    category: "suv",
    year: 2024,
    color: "Đen Ánh Kim",
    images: ["/images/cars/honda-crv-2024.jpg"],
    specifications: {
      engine: "1.5L VTEC Turbo",
      transmission: "CVT",
      fuelType: "Xăng",
      seating: 7,
      mileage: "7.2L/100km",
      safety: ["Honda SENSING", "6 túi khí", "Phanh ABS", "Cân bằng điện tử", "Hỗ trợ khởi hành ngang dốc"],
      features: ["Màn hình cảm ứng 8 inch", "Apple CarPlay", "Android Auto", "Camera 360", "Cửa sổ trời", "Ghế da"]
    },
    description: "Honda CR-V 2024 - SUV 7 chỗ cao cấp với không gian rộng rãi và trang bị hiện đại",
    isAvailable: true
  },
  {
    name: "Honda Accord 2024",
    model: "Accord",
    price: 1320000000,
    category: "sedan",
    year: 2024,
    color: "Bạc Ánh Kim",
    images: ["/images/cars/honda-accord-2024.jpg"],
    specifications: {
      engine: "1.5L VTEC Turbo",
      transmission: "CVT",
      fuelType: "Xăng",
      seating: 5,
      mileage: "6.8L/100km",
      safety: ["Honda SENSING", "8 túi khí", "Phanh ABS", "Cân bằng điện tử", "Hỗ trợ khởi hành ngang dốc"],
      features: ["Màn hình cảm ứng 8 inch", "Apple CarPlay", "Android Auto", "Ghế da cao cấp", "Điều hòa tự động 2 vùng"]
    },
    description: "Honda Accord 2024 - Sedan hạng D cao cấp với thiết kế sang trọng và công nghệ tiên tiến",
    isAvailable: true
  },
  {
    name: "Honda City 2024",
    model: "City",
    price: 559000000,
    category: "sedan",
    year: 2024,
    color: "Đỏ Ánh Kim",
    images: ["/images/cars/honda-city-2024.jpg"],
    specifications: {
      engine: "1.5L i-VTEC",
      transmission: "CVT",
      fuelType: "Xăng",
      seating: 5,
      mileage: "5.8L/100km",
      safety: ["Honda SENSING", "6 túi khí", "Phanh ABS", "Cân bằng điện tử"],
      features: ["Màn hình cảm ứng 8 inch", "Apple CarPlay", "Android Auto", "Camera lùi"]
    },
    description: "Honda City 2024 - Sedan hạng B thông minh với công nghệ Honda SENSING",
    isAvailable: true
  },
  {
    name: "Honda HR-V 2024",
    model: "HR-V",
    price: 786000000,
    category: "suv",
    year: 2024,
    color: "Xanh Dương Ánh Kim",
    images: ["/images/cars/honda-hrv-2024.jpg"],
    specifications: {
      engine: "1.5L i-VTEC",
      transmission: "CVT",
      fuelType: "Xăng",
      seating: 5,
      mileage: "6.2L/100km",
      safety: ["Honda SENSING", "6 túi khí", "Phanh ABS", "Cân bằng điện tử"],
      features: ["Màn hình cảm ứng 8 inch", "Apple CarPlay", "Android Auto", "Camera lùi", "Cửa sổ trời"]
    },
    description: "Honda HR-V 2024 - SUV đô thị nhỏ gọn với thiết kế trẻ trung và năng động",
    isAvailable: true
  },
  {
    name: "Honda Brio 2024",
    model: "Brio",
    price: 418000000,
    category: "hatchback",
    year: 2024,
    color: "Trắng Ngọc Trai",
    images: ["/images/cars/honda-brio-2024.jpg"],
    specifications: {
      engine: "1.2L i-VTEC",
      transmission: "CVT",
      fuelType: "Xăng",
      seating: 5,
      mileage: "5.3L/100km",
      safety: ["2 túi khí", "Phanh ABS", "Cân bằng điện tử"],
      features: ["Màn hình cảm ứng 7 inch", "Bluetooth", "USB", "Camera lùi"]
    },
    description: "Honda Brio 2024 - Hatchback nhỏ gọn, tiết kiệm nhiên liệu, phù hợp đô thị",
    isAvailable: true
  },
  {
    name: "Honda Civic Type R 2024",
    model: "Civic",
    price: 2400000000,
    category: "coupe",
    year: 2024,
    color: "Trắng Championship",
    images: ["/images/cars/honda-civic-type-r-2024.jpg"],
    specifications: {
      engine: "2.0L VTEC Turbo",
      transmission: "6MT",
      fuelType: "Xăng",
      seating: 4,
      mileage: "9.2L/100km",
      safety: ["Honda SENSING", "6 túi khí", "Phanh Brembo", "Cân bằng điện tử"],
      features: ["Màn hình cảm ứng 9 inch", "Apple CarPlay", "Android Auto", "Ghế Recaro", "Hệ thống âm thanh Bose"]
    },
    description: "Honda Civic Type R 2024 - Xe thể thao hiệu suất cao với sức mạnh 320 mã lực",
    isAvailable: true
  },
  {
    name: "Honda Pilot 2024",
    model: "Pilot",
    price: 2100000000,
    category: "suv",
    year: 2024,
    color: "Xám Ánh Kim",
    images: ["/images/cars/honda-pilot-2024.jpg"],
    specifications: {
      engine: "3.5L V6",
      transmission: "10AT",
      fuelType: "Xăng",
      seating: 8,
      mileage: "10.5L/100km",
      safety: ["Honda SENSING", "8 túi khí", "Phanh ABS", "Cân bằng điện tử", "Hỗ trợ xuống dốc"],
      features: ["Màn hình cảm ứng 10.2 inch", "Apple CarPlay", "Android Auto", "Camera 360", "Ghế da cao cấp", "3 vùng điều hòa"]
    },
    description: "Honda Pilot 2024 - SUV 8 chỗ cao cấp với động cơ V6 mạnh mẽ",
    isAvailable: true
  }
];

async function seedDatabase() {
  try {
    console.log('🔄 Connecting to MongoDB Atlas...');
    
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI not found in environment variables');
    }
    
    console.log('URI:', MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'));
    
    await mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
    
    console.log('✅ Connected to MongoDB Atlas successfully');
    console.log('Database:', mongoose.connection.name);
    console.log('Host:', mongoose.connection.host);
    
    // Check if cars already exist
    const existingCars = await Car.countDocuments();
    console.log(`📊 Existing cars in database: ${existingCars}`);
    
    if (existingCars > 0) {
      console.log('⚠️ Database already has cars. Do you want to:');
      console.log('1. Skip seeding (recommended)');
      console.log('2. Clear and reseed');
      console.log('3. Add more cars');
      
      // For now, we'll add more cars if less than 5
      if (existingCars < 5) {
        console.log('🔄 Adding more sample cars...');
      } else {
        console.log('✅ Database has enough sample data. Skipping seed.');
        await mongoose.disconnect();
        return;
      }
    }
    
    // Clear existing data if needed (uncomment if you want to reset)
    // await Car.deleteMany({});
    // console.log('🗑️ Cleared existing car data');
    
    // Insert sample cars
    console.log('🔄 Inserting sample cars...');
    
    for (const carData of sampleCars) {
      try {
        // Check if car already exists
        const existingCar = await Car.findOne({ 
          name: carData.name, 
          model: carData.model, 
          year: carData.year 
        });
        
        if (!existingCar) {
          const car = new Car(carData);
          await car.save();
          console.log(`✅ Added: ${carData.name}`);
        } else {
          console.log(`⏭️ Skipped: ${carData.name} (already exists)`);
        }
      } catch (error) {
        console.error(`❌ Error adding ${carData.name}:`, error.message);
      }
    }
    
    // Final count
    const finalCount = await Car.countDocuments();
    console.log(`📊 Total cars in database: ${finalCount}`);
    
    // Create indexes
    console.log('🔄 Creating indexes...');
    await Car.createIndexes();
    console.log('✅ Indexes created successfully');
    
    // Test a simple query
    console.log('🔄 Testing query...');
    const testCars = await Car.find({ isAvailable: true }).limit(3);
    console.log(`✅ Query test successful. Found ${testCars.length} available cars`);
    
    console.log('🎉 Database seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    
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

// Run the seeding
seedDatabase();