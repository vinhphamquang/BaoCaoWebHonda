require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

// Car Schema (same as in the app)
const CarSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  model: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
    required: true,
    enum: ['sedan', 'suv', 'hatchback', 'coupe', 'mpv'],
  },
  year: {
    type: Number,
    required: true,
    min: 2020,
    max: 2030,
  },
  color: {
    type: String,
    required: true,
    trim: true,
  },
  images: [{
    type: String,
    required: true,
  }],
  specifications: {
    engine: String,
    transmission: String,
    fuelType: {
      type: String,
      enum: ['Xăng', 'Hybrid', 'Điện'],
      default: 'Xăng',
    },
    seating: {
      type: Number,
      min: 2,
      max: 8,
    },
    mileage: String,
    safety: [String],
    features: [String],
  },
  description: {
    type: String,
    trim: true,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

const Car = mongoose.models.Car || mongoose.model('Car', CarSchema);

// Honda cars data with real images from public/images/cars/img/img/
const carsData = [
  {
    name: "Honda Civic RS 2024",
    model: "Civic",
    price: 730000000,
    category: "sedan",
    year: 2024,
    color: "Đỏ Ánh Kim",
    images: [
      "/images/cars/img/img/Honda civic-RS.jpg",
      "/images/cars/img/img/honda-civic-G.jpg",
      "/images/cars/img/img/civic-honda.webp"
    ],
    specifications: {
      engine: "1.5L VTEC Turbo",
      transmission: "CVT",
      fuelType: "Xăng",
      seating: 5,
      mileage: "6.5L/100km",
      safety: ["Honda SENSING", "6 túi khí", "VSA", "ABS"],
      features: ["Màn hình cảm ứng 9 inch", "Apple CarPlay", "Android Auto", "Cảm biến lùi", "Cruise Control"]
    },
    description: "Honda Civic RS 2024 - Sedan thể thao với thiết kế năng động và công nghệ hiện đại, mang đến trải nghiệm lái xe đầy cảm xúc.",
    isAvailable: true
  },
  {
    name: "Honda Civic Type R 2024",
    model: "Civic",
    price: 2100000000,
    category: "hatchback",
    year: 2024,
    color: "Đỏ Championship",
    images: [
      "/images/cars/img/img/Civic-Type-R-lead.avif",
      "/images/cars/img/img/honda_type-s.jpg",
      "/images/cars/img/img/honda-civic.webp"
    ],
    specifications: {
      engine: "2.0L VTEC Turbo",
      transmission: "6MT",
      fuelType: "Xăng",
      seating: 5,
      mileage: "9.8L/100km",
      safety: ["Honda SENSING", "6 túi khí", "Phanh Brembo", "LSD"],
      features: ["Màn hình 10.2 inch", "Bose Audio", "Ghế Recaro", "Hệ thống ống xả kép", "Track Mode"]
    },
    description: "Honda Civic Type R 2024 - Hatchback hiệu suất cao với sức mạnh 320 mã lực, được thiết kế cho những người đam mê tốc độ.",
    isAvailable: true
  },
  {
    name: "Honda City RS 2024",
    model: "City",
    price: 599000000,
    category: "sedan",
    year: 2024,
    color: "Trắng Ngọc Trai",
    images: [
      "/images/cars/img/img/honda-city-G.webp",
      "/images/cars/img/img/honda-city.webp",
      "/images/cars/img/img/honda_city_hatchback.jpg"
    ],
    specifications: {
      engine: "1.5L i-VTEC",
      transmission: "CVT",
      fuelType: "Xăng",
      seating: 5,
      mileage: "5.8L/100km",
      safety: ["Honda SENSING", "6 túi khí", "VSA", "ABS"],
      features: ["Màn hình 8 inch", "Apple CarPlay", "Cảm biến lùi", "Cruise Control", "Keyless Entry"]
    },
    description: "Honda City RS 2024 - Sedan hạng B thể thao với trang bị cao cấp, phù hợp cho gia đình trẻ năng động.",
    isAvailable: true
  },
  {
    name: "Honda City Hatchback 2024",
    model: "City",
    price: 650000000,
    category: "hatchback",
    year: 2024,
    color: "Xanh Dương Ánh Kim",
    images: [
      "/images/cars/img/img/hondacity-hatchback.jpg",
      "/images/cars/img/img/honda_city_hatchback.jpg",
      "/images/cars/img/img/honda-city.webp"
    ],
    specifications: {
      engine: "1.5L i-VTEC",
      transmission: "CVT",
      fuelType: "Xăng",
      seating: 5,
      mileage: "5.5L/100km",
      safety: ["Honda SENSING", "6 túi khí", "VSA", "ABS"],
      features: ["Màn hình 8 inch", "Honda CONNECT", "Cửa sau rộng rãi", "Khoang hành lý linh hoạt"]
    },
    description: "Honda City Hatchback 2024 - Hatchback đa năng với thiết kế trẻ trung, không gian linh hoạt cho cuộc sống hiện đại.",
    isAvailable: true
  },
  {
    name: "Honda CR-V Hybrid 2024",
    model: "CR-V",
    price: 1250000000,
    category: "suv",
    year: 2024,
    color: "Bạc Ánh Kim",
    images: [
      "/images/cars/img/img/Honda-CR-V-Hybrid.avif",
      "/images/cars/img/img/honda-crv.jpg",
      "/images/cars/img/img/Honda_CR-v7cho.jpg"
    ],
    specifications: {
      engine: "2.0L i-MMD Hybrid",
      transmission: "e-CVT",
      fuelType: "Hybrid",
      seating: 7,
      mileage: "5.3L/100km",
      safety: ["Honda SENSING", "6 túi khí", "VSA", "Hill Start Assist"],
      features: ["Màn hình 9 inch", "Cửa sổ trời", "Ghế da", "Honda CONNECT", "Wireless Charging"]
    },
    description: "Honda CR-V Hybrid 2024 - SUV 7 chỗ hybrid với khả năng vận hành mạnh mẽ và tiết kiệm nhiên liệu vượt trội.",
    isAvailable: true
  },
  {
    name: "Honda HR-V 2024",
    model: "HR-V",
    price: 850000000,
    category: "suv",
    year: 2024,
    color: "Đen Ánh Kim",
    images: [
      "/images/cars/img/img/honda-hrv.avif",
      "/images/cars/img/img/Honda_BR-V.jpg",
      "/images/cars/img/img/HONDA-BRV-G.webp"
    ],
    specifications: {
      engine: "1.5L i-VTEC",
      transmission: "CVT",
      fuelType: "Xăng",
      seating: 5,
      mileage: "6.8L/100km",
      safety: ["Honda SENSING", "6 túi khí", "VSA", "ABS"],
      features: ["Màn hình 8 inch", "Apple CarPlay", "Cửa sổ trời", "Ghế da", "Keyless Entry"]
    },
    description: "Honda HR-V 2024 - SUV compact với thiết kế thể thao và tiện nghi, lý tưởng cho cuộc sống đô thị.",
    isAvailable: true
  },
  {
    name: "Honda BR-V 2024",
    model: "BR-V",
    price: 750000000,
    category: "suv",
    year: 2024,
    color: "Trắng Ngọc Trai",
    images: [
      "/images/cars/img/img/HONDA-BRV-G.webp",
      "/images/cars/img/img/Honda_BR-V.jpg",
      "/images/cars/img/img/honda-hrv.avif"
    ],
    specifications: {
      engine: "1.5L i-VTEC",
      transmission: "CVT",
      fuelType: "Xăng",
      seating: 7,
      mileage: "7.0L/100km",
      safety: ["Honda SENSING", "6 túi khí", "VSA", "ABS"],
      features: ["Màn hình 8 inch", "Apple CarPlay", "3 hàng ghế", "Khoang hành lý rộng", "USB Charging"]
    },
    description: "Honda BR-V 2024 - SUV 7 chỗ giá tốt với không gian rộng rãi, phù hợp cho gia đình đông thành viên.",
    isAvailable: true
  },
  {
    name: "Honda Accord Hybrid 2024",
    model: "Accord",
    price: 1320000000,
    category: "sedan",
    year: 2024,
    color: "Xanh Lá Ánh Kim",
    images: [
      "/images/cars/img/img/honda-accord.jpg",
      "/images/cars/img/img/Honda civic-RS.jpg",
      "/images/cars/img/img/honda-civic-G.jpg"
    ],
    specifications: {
      engine: "2.0L i-MMD Hybrid",
      transmission: "e-CVT",
      fuelType: "Hybrid",
      seating: 5,
      mileage: "4.8L/100km",
      safety: ["Honda SENSING", "8 túi khí", "Collision Mitigation", "Blind Spot Monitoring"],
      features: ["Màn hình 12.3 inch", "Bose Audio", "Ghế da cao cấp", "Wireless Charging", "Head-Up Display"]
    },
    description: "Honda Accord Hybrid 2024 - Sedan hạng D cao cấp với công nghệ hybrid tiên tiến và trang bị đẳng cấp.",
    isAvailable: true
  },
  {
    name: "Honda ZR-V 2024",
    model: "ZR-V",
    price: 950000000,
    category: "suv",
    year: 2024,
    color: "Đỏ Ánh Kim",
    images: [
      "/images/cars/img/img/Honda-ZR-V.jpg",
      "/images/cars/img/img/honda-hrv.avif",
      "/images/cars/img/img/Honda-CR-V-Hybrid.avif"
    ],
    specifications: {
      engine: "1.5L VTEC Turbo",
      transmission: "CVT",
      fuelType: "Xăng",
      seating: 5,
      mileage: "6.9L/100km",
      safety: ["Honda SENSING", "6 túi khí", "Blind Spot Monitoring", "Cross Traffic Alert"],
      features: ["Màn hình 9 inch", "Premium Audio", "Ghế da", "Cửa sổ trời toàn cảnh", "Ambient Lighting"]
    },
    description: "Honda ZR-V 2024 - SUV coupe với thiết kế thể thao và công nghệ hiện đại, dành cho những người yêu thích sự khác biệt.",
    isAvailable: true
  },
  {
    name: "Honda Odyssey 2024",
    model: "Odyssey",
    price: 1850000000,
    category: "mpv",
    year: 2024,
    color: "Bạc Ánh Kim",
    images: [
      "/images/cars/img/img/Honda-Odyssey.png",
      "/images/cars/img/img/Honda_CR-v7cho.jpg",
      "/images/cars/img/img/HONDA-BRV-G.webp"
    ],
    specifications: {
      engine: "3.5L V6 i-VTEC",
      transmission: "10AT",
      fuelType: "Xăng",
      seating: 8,
      mileage: "9.5L/100km",
      safety: ["Honda SENSING", "8 túi khí", "Rear Cross Traffic Alert", "Collision Mitigation"],
      features: ["Màn hình 12.3 inch", "Premium Audio", "Ghế da cao cấp", "Cửa trượt điện", "Vacuum Cleaner"]
    },
    description: "Honda Odyssey 2024 - MPV cao cấp 8 chỗ với không gian rộng rãi và tiện nghi đẳng cấp, hoàn hảo cho gia đình lớn.",
    isAvailable: true
  }
];

async function seedCarsWithImages() {
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
    
    // Clear existing cars
    console.log('🗑️ Clearing existing cars...');
    await Car.deleteMany({});
    console.log('✅ Existing cars cleared');
    
    // Insert new cars with images
    console.log('🚗 Inserting cars with real images...');
    const insertedCars = await Car.insertMany(carsData);
    
    console.log(`✅ Successfully inserted ${insertedCars.length} cars!`);
    
    // Display summary
    console.log('\n📊 Cars Summary:');
    console.log('================');
    
    for (const car of insertedCars) {
      console.log(`🚗 ${car.name}`);
      console.log(`   💰 Price: ${car.price.toLocaleString('vi-VN')} VND`);
      console.log(`   🎨 Color: ${car.color}`);
      console.log(`   🖼️ Images: ${car.images.length} photos`);
      console.log(`   📝 Category: ${car.category}`);
      console.log('');
    }
    
    // Statistics
    const stats = {
      total: insertedCars.length,
      categories: {},
      models: {},
      fuelTypes: {},
      avgPrice: 0
    };
    
    let totalPrice = 0;
    
    for (const car of insertedCars) {
      // Categories
      stats.categories[car.category] = (stats.categories[car.category] || 0) + 1;
      
      // Models
      stats.models[car.model] = (stats.models[car.model] || 0) + 1;
      
      // Fuel Types
      stats.fuelTypes[car.specifications.fuelType] = (stats.fuelTypes[car.specifications.fuelType] || 0) + 1;
      
      // Price
      totalPrice += car.price;
    }
    
    stats.avgPrice = Math.round(totalPrice / insertedCars.length);
    
    console.log('📈 Statistics:');
    console.log('==============');
    console.log(`Total Cars: ${stats.total}`);
    console.log(`Average Price: ${stats.avgPrice.toLocaleString('vi-VN')} VND`);
    console.log(`Categories:`, stats.categories);
    console.log(`Models:`, stats.models);
    console.log(`Fuel Types:`, stats.fuelTypes);
    
    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n🌐 You can now visit:');
    console.log('   - Homepage: http://localhost:3001/');
    console.log('   - Cars page: http://localhost:3001/cars');
    console.log('   - Test drive: http://localhost:3001/test-drive');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    
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
seedCarsWithImages();