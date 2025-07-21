const mongoose = require('mongoose');
const Car = require('./models/Car');
require('dotenv').config();

// Sample car data
const sampleCars = [
  {
    name: 'VinFast VF 8',
    description: 'SUV điện cao cấp với thiết kế hiện đại và công nghệ tiên tiến',
    price: 1200000000,
    originalPrice: 1300000000,
    type: 'electric',
    brand: 'VinFast',
    model: 'VF 8',
    year: 2024,
    images: [{ url: '/images/placeholder-car.jpg', alt: 'VinFast VF 8', isPrimary: true }],
    specifications: {
      engine: 'Động cơ điện',
      power: '300kW',
      torque: '500Nm',
      transmission: 'Tự động',
      fuelType: 'Điện',
      acceleration: '5.5s',
      topSpeed: '200km/h',
      range: '420km',
      batteryCapacity: '87.7kWh',
      chargingTime: '31 phút (10-80%)',
      seating: 7,
      dimensions: {
        length: 4750,
        width: 1934,
        height: 1667,
        wheelbase: 2950
      },
      weight: 2200,
      trunkCapacity: 376
    },
    features: [
      'Hệ thống ADAS tiên tiến',
      'Màn hình cảm ứng 15.6 inch',
      'Sạc không dây',
      'Hệ thống âm thanh cao cấp',
      'Điều hòa tự động 3 vùng'
    ],
    colors: [
      { name: 'Trắng Ngọc Trai', code: '#FFFFFF' },
      { name: 'Đen Huyền Bí', code: '#000000' },
      { name: 'Xanh Đại Dương', code: '#1E40AF' },
      { name: 'Đỏ Quyến Rũ', code: '#DC2626' }
    ],
    stock: 50,
    isActive: true,
    isFeatured: true,
    tags: ['SUV', 'Điện', 'Cao cấp', '7 chỗ']
  },
  {
    name: 'VinFast VF 9',
    description: 'SUV điện hạng sang với không gian rộng rãi và trang bị đầy đủ',
    price: 1500000000,
    originalPrice: 1600000000,
    type: 'electric',
    brand: 'VinFast',
    model: 'VF 9',
    year: 2024,
    images: [{ url: '/images/placeholder-car.jpg', alt: 'VinFast VF 9', isPrimary: true }],
    specifications: {
      engine: 'Động cơ điện',
      power: '350kW',
      torque: '640Nm',
      transmission: 'Tự động',
      fuelType: 'Điện',
      acceleration: '6.5s',
      topSpeed: '200km/h',
      range: '438km',
      batteryCapacity: '92kWh',
      chargingTime: '35 phút (10-80%)',
      seating: 7,
      dimensions: {
        length: 5123,
        width: 1960,
        height: 1691,
        wheelbase: 3075
      },
      weight: 2400,
      trunkCapacity: 423
    },
    features: [
      'Hệ thống ADAS cấp độ 2+',
      'Màn hình cảm ứng 15.6 inch',
      'Ghế massage',
      'Cửa sổ trời toàn cảnh',
      'Hệ thống âm thanh 14 loa'
    ],
    colors: [
      { name: 'Trắng Ngọc Trai', code: '#FFFFFF' },
      { name: 'Đen Huyền Bí', code: '#000000' },
      { name: 'Xám Titan', code: '#6B7280' },
      { name: 'Xanh Đại Dương', code: '#1E40AF' }
    ],
    stock: 30,
    isActive: true,
    isFeatured: true,
    tags: ['SUV', 'Điện', 'Hạng sang', '7 chỗ']
  },
  {
    name: 'VinFast VF 6',
    description: 'SUV điện compact thông minh, phù hợp cho gia đình trẻ',
    price: 800000000,
    originalPrice: 850000000,
    type: 'electric',
    brand: 'VinFast',
    model: 'VF 6',
    year: 2024,
    images: [{ url: '/images/placeholder-car.jpg', alt: 'VinFast VF 6', isPrimary: true }],
    specifications: {
      engine: 'Động cơ điện',
      power: '150kW',
      torque: '310Nm',
      transmission: 'Tự động',
      fuelType: 'Điện',
      acceleration: '8.0s',
      topSpeed: '160km/h',
      range: '380km',
      batteryCapacity: '59.6kWh',
      chargingTime: '25 phút (10-80%)',
      seating: 5,
      dimensions: {
        length: 4238,
        width: 1820,
        height: 1594,
        wheelbase: 2730
      },
      weight: 1750,
      trunkCapacity: 285
    },
    features: [
      'Hệ thống ADAS cơ bản',
      'Màn hình cảm ứng 12.9 inch',
      'Kết nối smartphone',
      'Camera 360 độ',
      'Điều hòa tự động'
    ],
    colors: [
      { name: 'Trắng Ngọc Trai', code: '#FFFFFF' },
      { name: 'Đen Huyền Bí', code: '#000000' },
      { name: 'Xanh Lá', code: '#059669' },
      { name: 'Cam Năng Động', code: '#EA580C' }
    ],
    stock: 80,
    isActive: true,
    isFeatured: true,
    tags: ['SUV', 'Điện', 'Compact', '5 chỗ']
  },
  {
    name: 'VinFast VF 7',
    description: 'SUV điện cỡ trung với thiết kế thể thao và hiệu suất ấn tượng',
    price: 1000000000,
    originalPrice: 1100000000,
    type: 'electric',
    brand: 'VinFast',
    model: 'VF 7',
    year: 2024,
    images: [{ url: '/images/placeholder-car.jpg', alt: 'VinFast VF 7', isPrimary: true }],
    specifications: {
      engine: 'Động cơ điện',
      power: '250kW',
      torque: '450Nm',
      transmission: 'Tự động',
      fuelType: 'Điện',
      acceleration: '6.5s',
      topSpeed: '180km/h',
      range: '450km',
      batteryCapacity: '75.3kWh',
      chargingTime: '28 phút (10-80%)',
      seating: 5,
      dimensions: {
        length: 4545,
        width: 1890,
        height: 1635,
        wheelbase: 2840
      },
      weight: 1950,
      trunkCapacity: 376
    },
    features: [
      'Hệ thống ADAS cấp độ 2',
      'Màn hình cảm ứng 15.6 inch',
      'Sạc không dây',
      'Ghế chỉnh điện',
      'Hệ thống âm thanh 8 loa'
    ],
    colors: [
      { name: 'Trắng Ngọc Trai', code: '#FFFFFF' },
      { name: 'Đen Huyền Bí', code: '#000000' },
      { name: 'Xanh Đại Dương', code: '#1E40AF' },
      { name: 'Bạc Sang Trọng', code: '#9CA3AF' }
    ],
    stock: 60,
    isActive: true,
    isFeatured: false,
    tags: ['SUV', 'Điện', 'Thể thao', '5 chỗ']
  },
  {
    name: 'VinFast VF 5',
    description: 'SUV điện nhỏ gọn, tiết kiệm và thân thiện với môi trường',
    price: 600000000,
    originalPrice: 650000000,
    type: 'electric',
    brand: 'VinFast',
    model: 'VF 5',
    year: 2024,
    images: [{ url: '/images/placeholder-car.jpg', alt: 'VinFast VF 5', isPrimary: true }],
    specifications: {
      engine: 'Động cơ điện',
      power: '100kW',
      torque: '242Nm',
      transmission: 'Tự động',
      fuelType: 'Điện',
      acceleration: '9.0s',
      topSpeed: '140km/h',
      range: '300km',
      batteryCapacity: '42.3kWh',
      chargingTime: '20 phút (10-80%)',
      seating: 5,
      dimensions: {
        length: 4090,
        width: 1770,
        height: 1570,
        wheelbase: 2611
      },
      weight: 1500,
      trunkCapacity: 285
    },
    features: [
      'Hệ thống an toàn cơ bản',
      'Màn hình cảm ứng 10 inch',
      'Kết nối Bluetooth',
      'Camera lùi',
      'Điều hòa thường'
    ],
    colors: [
      { name: 'Trắng Ngọc Trai', code: '#FFFFFF' },
      { name: 'Đen Huyền Bí', code: '#000000' },
      { name: 'Xanh Lá', code: '#059669' },
      { name: 'Vàng Nắng', code: '#F59E0B' }
    ],
    stock: 100,
    isActive: true,
    isFeatured: false,
    tags: ['SUV', 'Điện', 'Tiết kiệm', '5 chỗ']
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing cars
    await Car.deleteMany({});
    console.log('Cleared existing cars');

    // Insert sample cars one by one to trigger pre-save hooks
    const cars = [];
    for (const carData of sampleCars) {
      const car = new Car(carData);
      const savedCar = await car.save();
      cars.push(savedCar);
    }
    console.log(`Inserted ${cars.length} cars`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
