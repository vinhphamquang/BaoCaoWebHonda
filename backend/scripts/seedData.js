const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Car = require('../models/Car');
const News = require('../models/News');

// Connect to database
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/vinfast_db');

// Sample data
const users = [
  {
    name: 'Admin VinFast',
    email: 'admin@vinfast.com',
    password: 'admin123',
    phone: '0123456789',
    address: 'Hà Nội',
    role: 'admin'
  },
  {
    name: 'Nguyễn Văn A',
    email: 'user@example.com',
    password: 'user123',
    phone: '0987654321',
    address: 'TP. Hồ Chí Minh',
    role: 'user'
  }
];

const cars = [
  {
    name: 'VinFast VF 3',
    type: 'electric',
    price: 240000000,
    year: 2024,
    description: 'VinFast VF 3 là mẫu xe điện mini được thiết kế dành riêng cho thị trường đô thị Việt Nam với kích thước nhỏ gọn và giá cả phải chăng.',
    images: [
      {
        url: '/images/vf3.jpg',
        alt: 'VinFast VF 3',
        isPrimary: true
      }
    ],
    specifications: {
      engine: 'Động cơ điện',
      power: '43 HP',
      transmission: 'Hộp số tự động',
      fuelType: 'Điện',
      seating: 4,
      dimensions: {
        length: '3.190 mm',
        width: '1.679 mm',
        height: '1.622 mm',
        wheelbase: '2.075 mm',
        groundClearance: '160 mm'
      },
      capacity: {
        trunk: '285 L',
        fuelTank: 'Pin 18.64 kWh'
      },
      performance: {
        topSpeed: '100 km/h',
        acceleration: '9.0s (0-50 km/h)'
      }
    },
    features: [
      'Màn hình cảm ứng 10 inch',
      'Hệ thống kết nối thông minh',
      'Camera lùi',
      'Cảnh báo điểm mù',
      'Phanh ABS',
      'Túi khí an toàn',
      'Điều hòa tự động',
      'Cửa sổ điện'
    ],
    colors: [
      { name: 'Trắng', code: '#FFFFFF' },
      { name: 'Đen', code: '#000000' },
      { name: 'Xanh Navy', code: '#1e3a8a' },
      { name: 'Đỏ', code: '#dc2626' }
    ],
    isElectric: true,
    isFeatured: true,
    stock: 50
  },
  {
    name: 'VinFast VF 5',
    type: 'electric',
    price: 458000000,
    year: 2024,
    description: 'VinFast VF 5 là mẫu SUV điện cỡ nhỏ với thiết kế hiện đại, trang bị công nghệ tiên tiến và khả năng vận hành linh hoạt.',
    images: [
      {
        url: '/images/vf5.jpg',
        alt: 'VinFast VF 5',
        isPrimary: true
      }
    ],
    specifications: {
      engine: 'Động cơ điện',
      power: '134 HP',
      transmission: 'Hộp số tự động',
      fuelType: 'Điện',
      seating: 5,
      dimensions: {
        length: '4.238 mm',
        width: '1.820 mm',
        height: '1.622 mm',
        wheelbase: '2.611 mm',
        groundClearance: '175 mm'
      },
      capacity: {
        trunk: '420 L',
        fuelTank: 'Pin 37.23 kWh'
      },
      performance: {
        topSpeed: '140 km/h',
        acceleration: '9.9s (0-100 km/h)'
      }
    },
    features: [
      'Màn hình cảm ứng 12.9 inch',
      'Hệ thống VinFast Connect',
      'Camera 360 độ',
      'Hệ thống ADAS',
      'Sạc không dây',
      'Ghế da cao cấp',
      'Điều hòa tự động',
      'Hệ thống âm thanh 6 loa'
    ],
    colors: [
      { name: 'Trắng', code: '#FFFFFF' },
      { name: 'Đen', code: '#000000' },
      { name: 'Xanh Navy', code: '#1e3a8a' },
      { name: 'Đỏ', code: '#dc2626' },
      { name: 'Xám', code: '#6b7280' }
    ],
    isElectric: true,
    isFeatured: true,
    stock: 30
  },
  {
    name: 'VinFast VF 8',
    type: 'electric',
    price: 1200000000,
    year: 2024,
    description: 'VinFast VF 8 là mẫu SUV điện cỡ trung với thiết kế sang trọng, công nghệ thông minh và hiệu suất vận hành ấn tượng.',
    images: [
      {
        url: '/images/vf8.jpg',
        alt: 'VinFast VF 8',
        isPrimary: true
      }
    ],
    specifications: {
      engine: 'Động cơ điện',
      power: '402 HP',
      transmission: 'Hộp số tự động',
      fuelType: 'Điện',
      seating: 5,
      dimensions: {
        length: '4.750 mm',
        width: '1.934 mm',
        height: '1.667 mm',
        wheelbase: '2.950 mm',
        groundClearance: '175 mm'
      },
      capacity: {
        trunk: '376 L',
        fuelTank: 'Pin 87.7 kWh'
      },
      performance: {
        topSpeed: '200 km/h',
        acceleration: '5.3s (0-100 km/h)'
      }
    },
    features: [
      'Màn hình cảm ứng 15.6 inch',
      'Hệ thống VinFast Connect Pro',
      'Camera 360 độ',
      'Hệ thống ADAS Level 2+',
      'Sạc không dây',
      'Ghế massage',
      'Điều hòa 3 vùng độc lập',
      'Hệ thống âm thanh Harman Kardon',
      'Cửa sổ trời toàn cảnh'
    ],
    colors: [
      { name: 'Trắng', code: '#FFFFFF' },
      { name: 'Đen', code: '#000000' },
      { name: 'Xanh Navy', code: '#1e3a8a' },
      { name: 'Đỏ', code: '#dc2626' },
      { name: 'Xám', code: '#6b7280' },
      { name: 'Bạc', code: '#9ca3af' }
    ],
    isElectric: true,
    isFeatured: true,
    stock: 20
  }
];

const news = [
  {
    title: 'VinFast VF 3 chính thức ra mắt với giá 240 triệu đồng',
    excerpt: 'Mẫu xe điện mini VinFast VF 3 đã chính thức được công bố giá bán và mở đặt hàng tại thị trường Việt Nam.',
    content: `
      <p>VinFast VF 3 là mẫu xe điện mini được thiết kế dành riêng cho thị trường đô thị Việt Nam. Với mức giá 240 triệu đồng, VF 3 hứa hẹn sẽ là lựa chọn hấp dẫn cho những khách hàng muốn sở hữu xe điện với chi phí hợp lý.</p>
      
      <h3>Thiết kế nhỏ gọn, phù hợp đô thị</h3>
      <p>VF 3 có kích thước nhỏ gọn với chiều dài chỉ 3.190mm, rất phù hợp cho việc di chuyển trong thành phố. Thiết kế hiện đại với đèn LED toàn bộ tạo điểm nhấn ấn tượng.</p>
      
      <h3>Công nghệ hiện đại</h3>
      <p>Xe được trang bị màn hình cảm ứng 10 inch, hệ thống kết nối thông minh và nhiều tính năng an toàn tiên tiến.</p>
    `,
    featuredImage: {
      url: '/images/news/vf3-launch.jpg',
      alt: 'VinFast VF 3 ra mắt'
    },
    category: 'product',
    tags: ['vf3', 'xe điện', 'ra mắt'],
    status: 'published',
    featured: true,
    publishedAt: new Date('2024-01-15')
  }
];

// Seed function
const seedData = async () => {
  try {
    console.log('🌱 Bắt đầu seed dữ liệu...');

    // Clear existing data
    await User.deleteMany();
    await Car.deleteMany();
    await News.deleteMany();
    console.log('✅ Đã xóa dữ liệu cũ');

    // Create admin user
    const adminUser = await User.create(users[0]);
    console.log('✅ Đã tạo admin user');

    // Create regular user
    await User.create(users[1]);
    console.log('✅ Đã tạo user thường');

    // Create cars one by one to trigger pre-save hooks
    for (const carData of cars) {
      await Car.create(carData);
    }
    console.log('✅ Đã tạo dữ liệu xe');

    // Create news with author
    const newsWithAuthor = news.map(article => ({
      ...article,
      author: adminUser._id
    }));
    await News.insertMany(newsWithAuthor);
    console.log('✅ Đã tạo dữ liệu tin tức');

    console.log('🎉 Seed dữ liệu thành công!');
    console.log('📧 Admin: admin@vinfast.com / admin123');
    console.log('📧 User: user@example.com / user123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi seed dữ liệu:', error);
    process.exit(1);
  }
};

// Run seed
seedData();
