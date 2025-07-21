export interface Car {
  id: string;
  name: string;
  type: 'sedan' | 'suv' | 'electric';
  price: number;
  year: number;
  image: string;
  images: string[];
  description: string;
  specifications: {
    engine: string;
    power: string;
    transmission: string;
    fuelType: string;
    seating: number;
    length: string;
    width: string;
    height: string;
    wheelbase: string;
    groundClearance: string;
    trunkCapacity: string;
    fuelTank: string;
    topSpeed: string;
    acceleration: string;
  };
  features: string[];
  colors: string[];
  isElectric: boolean;
  isFeatured: boolean;
}

export const cars: Car[] = [
  {
    id: 'vf3',
    name: 'VinFast VF 3',
    type: 'electric',
    price: 240000000,
    year: 2024,
    image: '/images/vf3.jpg',
    images: ['/images/vf3.jpg', '/images/vf3-interior.jpg', '/images/vf3-side.jpg'],
    description: 'VinFast VF 3 là mẫu xe điện mini đô thị thông minh, phù hợp cho việc di chuyển trong thành phố với thiết kế nhỏ gọn và tiết kiệm năng lượng.',
    specifications: {
      engine: 'Động cơ điện',
      power: '43 HP',
      transmission: 'Hộp số tự động',
      fuelType: 'Điện',
      seating: 4,
      length: '3.190 mm',
      width: '1.679 mm',
      height: '1.622 mm',
      wheelbase: '2.075 mm',
      groundClearance: '160 mm',
      trunkCapacity: '285 L',
      fuelTank: 'Pin 18.64 kWh',
      topSpeed: '100 km/h',
      acceleration: '5.3s (0-50 km/h)'
    },
    features: [
      'Hệ thống thông tin giải trí 10 inch',
      'Kết nối smartphone',
      'Camera lùi',
      'Cảm biến đỗ xe',
      'Điều hòa tự động',
      'Sạc không dây',
      'Hệ thống âm thanh 6 loa'
    ],
    colors: ['Trắng', 'Đen', 'Xanh', 'Đỏ'],
    isElectric: true,
    isFeatured: true
  },
  {
    id: 'vf5',
    name: 'VinFast VF 5',
    type: 'electric',
    price: 458000000,
    year: 2024,
    image: '/images/vf5.jpg',
    images: ['/images/vf5.jpg', '/images/vf5-interior.jpg', '/images/vf5-side.jpg'],
    description: 'VinFast VF 5 là SUV điện cỡ nhỏ với thiết kế hiện đại, trang bị công nghệ thông minh và khả năng vận hành linh hoạt trong đô thị.',
    specifications: {
      engine: 'Động cơ điện',
      power: '134 HP',
      transmission: 'Hộp số tự động',
      fuelType: 'Điện',
      seating: 5,
      length: '4.140 mm',
      width: '1.782 mm',
      height: '1.636 mm',
      wheelbase: '2.611 mm',
      groundClearance: '175 mm',
      trunkCapacity: '420 L',
      fuelTank: 'Pin 37.23 kWh',
      topSpeed: '140 km/h',
      acceleration: '9.9s (0-100 km/h)'
    },
    features: [
      'Màn hình cảm ứng 12.9 inch',
      'Hệ thống VinFast Connect',
      'Camera 360 độ',
      'Cảnh báo điểm mù',
      'Phanh tự động khẩn cấp',
      'Cruise control thích ứng',
      'Sạc không dây',
      'Hệ thống âm thanh cao cấp'
    ],
    colors: ['Trắng', 'Đen', 'Xanh Navy', 'Đỏ', 'Xám'],
    isElectric: true,
    isFeatured: true
  },
  {
    id: 'vf6',
    name: 'VinFast VF 6',
    type: 'electric',
    price: 765000000,
    year: 2024,
    image: '/images/vf6.jpg',
    images: ['/images/vf6.jpg', '/images/vf6-interior.jpg', '/images/vf6-side.jpg'],
    description: 'VinFast VF 6 là SUV điện cỡ trung với thiết kế sang trọng, công nghệ tiên tiến và khả năng vận hành mạnh mẽ.',
    specifications: {
      engine: 'Động cơ điện',
      power: '174 HP',
      transmission: 'Hộp số tự động',
      fuelType: 'Điện',
      seating: 5,
      length: '4.238 mm',
      width: '1.820 mm',
      height: '1.594 mm',
      wheelbase: '2.730 mm',
      groundClearance: '175 mm',
      trunkCapacity: '594 L',
      fuelTank: 'Pin 59.6 kWh',
      topSpeed: '160 km/h',
      acceleration: '8.5s (0-100 km/h)'
    },
    features: [
      'Màn hình cảm ứng 15.6 inch',
      'Hệ thống VinFast Connect Pro',
      'Camera 360 độ',
      'Hệ thống ADAS Level 2',
      'Sạc không dây',
      'Ghế chỉnh điện',
      'Điều hòa 2 vùng độc lập',
      'Hệ thống âm thanh premium'
    ],
    colors: ['Trắng', 'Đen', 'Xanh Navy', 'Đỏ', 'Xám', 'Bạc'],
    isElectric: true,
    isFeatured: true
  },
  {
    id: 'vf7',
    name: 'VinFast VF 7',
    type: 'electric',
    price: 999000000,
    year: 2024,
    image: '/images/vf7.jpg',
    images: ['/images/vf7.jpg', '/images/vf7-interior.jpg', '/images/vf7-side.jpg'],
    description: 'VinFast VF 7 là SUV điện cỡ trung cao cấp với thiết kế thể thao, công nghệ thông minh và hiệu suất vượt trội.',
    specifications: {
      engine: 'Động cơ điện',
      power: '349 HP',
      transmission: 'Hộp số tự động',
      fuelType: 'Điện',
      seating: 7,
      length: '4.545 mm',
      width: '1.890 mm',
      height: '1.635 mm',
      wheelbase: '2.840 mm',
      groundClearance: '175 mm',
      trunkCapacity: '506 L',
      fuelTank: 'Pin 75.3 kWh',
      topSpeed: '180 km/h',
      acceleration: '6.5s (0-100 km/h)'
    },
    features: [
      'Màn hình cảm ứng 15.6 inch',
      'Hệ thống VinFast Connect Pro',
      'Camera 360 độ',
      'Hệ thống ADAS Level 2+',
      'Sạc không dây',
      'Ghế massage',
      'Điều hòa 3 vùng độc lập',
      'Hệ thống âm thanh Harman Kardon'
    ],
    colors: ['Trắng', 'Đen', 'Xanh Navy', 'Đỏ', 'Xám', 'Bạc'],
    isElectric: true,
    isFeatured: true
  },
  {
    id: 'vf8',
    name: 'VinFast VF 8',
    type: 'electric',
    price: 1200000000,
    year: 2024,
    image: '/images/vf8.jpg',
    images: ['/images/vf8.jpg', '/images/vf8-interior.jpg', '/images/vf8-side.jpg'],
    description: 'VinFast VF 8 là SUV điện cao cấp với thiết kế sang trọng, công nghệ tiên tiến và khả năng vận hành mạnh mẽ.',
    specifications: {
      engine: 'Động cơ điện',
      power: '402 HP',
      transmission: 'Hộp số tự động',
      fuelType: 'Điện',
      seating: 7,
      length: '4.750 mm',
      width: '1.934 mm',
      height: '1.667 mm',
      wheelbase: '2.950 mm',
      groundClearance: '175 mm',
      trunkCapacity: '551 L',
      fuelTank: 'Pin 87.7 kWh',
      topSpeed: '200 km/h',
      acceleration: '5.9s (0-100 km/h)'
    },
    features: [
      'Màn hình cảm ứng 15.6 inch',
      'Hệ thống VinFast Connect Pro',
      'Camera 360 độ',
      'Hệ thống ADAS Level 2+',
      'Sạc không dây',
      'Ghế massage cao cấp',
      'Điều hòa 4 vùng độc lập',
      'Hệ thống âm thanh Harman Kardon Premium'
    ],
    colors: ['Trắng', 'Đen', 'Xanh Navy', 'Đỏ', 'Xám', 'Bạc'],
    isElectric: true,
    isFeatured: false
  },
  {
    id: 'vf9',
    name: 'VinFast VF 9',
    type: 'electric',
    price: 1500000000,
    year: 2024,
    image: '/images/vf9.jpg',
    images: ['/images/vf9.jpg', '/images/vf9-interior.jpg', '/images/vf9-side.jpg'],
    description: 'VinFast VF 9 là SUV điện cao cấp nhất với 3 hàng ghế, thiết kế sang trọng và công nghệ tiên tiến nhất.',
    specifications: {
      engine: 'Động cơ điện',
      power: '402 HP',
      transmission: 'Hộp số tự động',
      fuelType: 'Điện',
      seating: 7,
      length: '5.123 mm',
      width: '1.976 mm',
      height: '1.725 mm',
      wheelbase: '3.075 mm',
      groundClearance: '175 mm',
      trunkCapacity: '423 L',
      fuelTank: 'Pin 123 kWh',
      topSpeed: '200 km/h',
      acceleration: '6.5s (0-100 km/h)'
    },
    features: [
      'Màn hình cảm ứng 15.6 inch',
      'Hệ thống VinFast Connect Pro',
      'Camera 360 độ',
      'Hệ thống ADAS Level 2+',
      'Sạc không dây',
      'Ghế massage cao cấp',
      'Điều hòa 4 vùng độc lập',
      'Hệ thống âm thanh Harman Kardon Premium',
      'Cửa sổ trời toàn cảnh',
      'Ghế captain chair hàng 2'
    ],
    colors: ['Trắng', 'Đen', 'Xanh Navy', 'Đỏ', 'Xám', 'Bạc'],
    isElectric: true,
    isFeatured: false
  },
  {
    id: 'lux-a20',
    name: 'VinFast Lux A2.0',
    type: 'sedan',
    price: 880000000,
    year: 2023,
    image: '/images/lux-a20.jpg',
    images: ['/images/lux-a20.jpg', '/images/lux-a20-interior.jpg', '/images/lux-a20-side.jpg'],
    description: 'VinFast Lux A2.0 là sedan hạng sang với động cơ xăng mạnh mẽ, thiết kế thanh lịch và trang bị cao cấp.',
    specifications: {
      engine: 'Động cơ xăng Turbo',
      power: '228 HP',
      transmission: 'Hộp số tự động 8 cấp',
      fuelType: 'Xăng',
      seating: 5,
      length: '5.018 mm',
      width: '1.900 mm',
      height: '1.500 mm',
      wheelbase: '3.000 mm',
      groundClearance: '150 mm',
      trunkCapacity: '500 L',
      fuelTank: '70 L',
      topSpeed: '220 km/h',
      acceleration: '8.9s (0-100 km/h)'
    },
    features: [
      'Màn hình cảm ứng 12 inch',
      'Hệ thống thông tin giải trí',
      'Camera 360 độ',
      'Cảnh báo điểm mù',
      'Phanh tự động khẩn cấp',
      'Cruise control thích ứng',
      'Ghế da cao cấp',
      'Điều hòa tự động 2 vùng',
      'Hệ thống âm thanh premium'
    ],
    colors: ['Trắng', 'Đen', 'Xanh Navy', 'Đỏ', 'Xám', 'Bạc'],
    isElectric: false,
    isFeatured: false
  },
  {
    id: 'lux-sa20',
    name: 'VinFast Lux SA2.0',
    type: 'suv',
    price: 1080000000,
    year: 2023,
    image: '/images/lux-sa20.jpg',
    images: ['/images/lux-sa20.jpg', '/images/lux-sa20-interior.jpg', '/images/lux-sa20-side.jpg'],
    description: 'VinFast Lux SA2.0 là SUV hạng sang với động cơ xăng mạnh mẽ, khả năng vận hành linh hoạt và không gian rộng rãi.',
    specifications: {
      engine: 'Động cơ xăng Turbo',
      power: '228 HP',
      transmission: 'Hộp số tự động 8 cấp',
      fuelType: 'Xăng',
      seating: 7,
      length: '4.940 mm',
      width: '1.900 mm',
      height: '1.750 mm',
      wheelbase: '2.933 mm',
      groundClearance: '185 mm',
      trunkCapacity: '1.610 L',
      fuelTank: '70 L',
      topSpeed: '210 km/h',
      acceleration: '9.1s (0-100 km/h)'
    },
    features: [
      'Màn hình cảm ứng 12 inch',
      'Hệ thống thông tin giải trí',
      'Camera 360 độ',
      'Cảnh báo điểm mù',
      'Phanh tự động khẩn cấp',
      'Cruise control thích ứng',
      'Ghế da cao cấp',
      'Điều hòa tự động 3 vùng',
      'Hệ thống âm thanh premium',
      'Cửa sổ trời toàn cảnh'
    ],
    colors: ['Trắng', 'Đen', 'Xanh Navy', 'Đỏ', 'Xám', 'Bạc'],
    isElectric: false,
    isFeatured: false
  }
];

export const getCarById = (id: string): Car | undefined => {
  return cars.find(car => car.id === id);
};

export const getCarsByType = (type: string): Car[] => {
  if (type === 'all') return cars;
  return cars.filter(car => car.type === type);
};

export const getFeaturedCars = (): Car[] => {
  return cars.filter(car => car.isFeatured);
};

export const getCarsByPriceRange = (min: number, max: number): Car[] => {
  return cars.filter(car => car.price >= min && car.price <= max);
};
