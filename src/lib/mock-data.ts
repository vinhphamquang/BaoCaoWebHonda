// Mock data cho testing khi MongoDB Atlas không khả dụng
export const mockCars = [
  // Honda Civic Series
  {
    _id: "507f1f77bcf86cd799439011",
    name: "Honda Civic RS 2024",
    model: "Civic",
    price: 730000000,
    category: "sedan",
    year: 2024,
    color: "Đỏ Ánh Kim",
    images: [
      "/images/cars/img/img/civic-honda.webp",
      "/images/cars/img/img/Civic-Type-R-lead.avif",
      "public/images/cars/img/img/Honda_BR-V.jpg"
    ],
    specifications: {
      engine: "1.5L VTEC Turbo",
      transmission: "CVT",
      fuelType: "Xăng",
      seating: 5,
      mileage: "6.5L/100km",
      safety: ["Honda SENSING", "6 túi khí"],
      features: ["Màn hình cảm ứng 9 inch", "Apple CarPlay", "Android Auto", "Cảm biến lùi"]
    },
    description: "Honda Civic RS 2024 - Sedan thể thao với thiết kế năng động và công nghệ hiện đại",
    isAvailable: true,
    createdAt: new Date("2024-01-01T00:00:00.000Z"),
    updatedAt: new Date("2024-01-01T00:00:00.000Z")
  },
  {
    _id: "507f1f77bcf86cd799439012",
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
      safety: ["Honda SENSING", "6 túi khí", "Phanh Brembo"],
      features: ["Màn hình 10.2 inch", "Bose Audio", "Ghế Recaro", "Hệ thống ống xả kép"]
    },
    description: "Honda Civic Type R 2024 - Hatchback hiệu suất cao với sức mạnh 320 mã lực",
    isAvailable: true,
    createdAt: new Date("2024-01-02T00:00:00.000Z"),
    updatedAt: new Date("2024-01-02T00:00:00.000Z")
  },
  {
    _id: "507f1f77bcf86cd799439013",
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
      safety: ["Honda SENSING", "6 túi khí"],
      features: ["Màn hình 8 inch", "Apple CarPlay", "Cảm biến lùi", "Cruise Control"]
    },
    description: "Honda City RS 2024 - Sedan hạng B thể thao với trang bị cao cấp",
    isAvailable: true,
    createdAt: new Date("2024-01-03T00:00:00.000Z"),
    updatedAt: new Date("2024-01-03T00:00:00.000Z")
  },
  {
    _id: "507f1f77bcf86cd799439014",
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
      safety: ["Honda SENSING", "6 túi khí"],
      features: ["Màn hình 8 inch", "Honda CONNECT", "Cửa sau rộng rãi", "Khoang hành lý linh hoạt"]
    },
    description: "Honda City Hatchback 2024 - Hatchback đa năng với thiết kế trẻ trung",
    isAvailable: true,
    createdAt: new Date("2024-01-04T00:00:00.000Z"),
    updatedAt: new Date("2024-01-04T00:00:00.000Z")
  },
  {
    _id: "507f1f77bcf86cd799439015",
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
      safety: ["Honda SENSING", "6 túi khí", "VSA"],
      features: ["Màn hình 9 inch", "Cửa sổ trời", "Ghế da", "Honda CONNECT"]
    },
    description: "Honda CR-V Hybrid 2024 - SUV 7 chỗ hybrid với khả năng vận hành mạnh mẽ",
    isAvailable: true,
    createdAt: new Date("2024-01-05T00:00:00.000Z"),
    updatedAt: new Date("2024-01-05T00:00:00.000Z")
  },
  {
    _id: "507f1f77bcf86cd799439016",
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
      safety: ["Honda SENSING", "6 túi khí"],
      features: ["Màn hình 8 inch", "Apple CarPlay", "Cửa sổ trời", "Ghế da"]
    },
    description: "Honda HR-V 2024 - SUV compact với thiết kế thể thao và tiện nghi",
    isAvailable: true,
    createdAt: new Date("2024-01-06T00:00:00.000Z"),
    updatedAt: new Date("2024-01-06T00:00:00.000Z")
  },
  {
    _id: "507f1f77bcf86cd799439017",
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
      safety: ["Honda SENSING", "6 túi khí"],
      features: ["Màn hình 8 inch", "Apple CarPlay", "3 hàng ghế", "Khoang hành lý rộng"]
    },
    description: "Honda BR-V 2024 - SUV 7 chỗ giá tốt với không gian rộng rãi",
    isAvailable: true,
    createdAt: new Date("2024-01-07T00:00:00.000Z"),
    updatedAt: new Date("2024-01-07T00:00:00.000Z")
  },
  {
    _id: "507f1f77bcf86cd799439018",
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
      safety: ["Honda SENSING", "8 túi khí", "Collision Mitigation"],
      features: ["Màn hình 12.3 inch", "Bose Audio", "Ghế da cao cấp", "Wireless Charging"]
    },
    description: "Honda Accord Hybrid 2024 - Sedan hạng D cao cấp với công nghệ hybrid tiên tiến",
    isAvailable: true,
    createdAt: new Date("2024-01-08T00:00:00.000Z"),
    updatedAt: new Date("2024-01-08T00:00:00.000Z")
  },
  {
    _id: "507f1f77bcf86cd799439019",
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
      safety: ["Honda SENSING", "6 túi khí", "Blind Spot Monitoring"],
      features: ["Màn hình 9 inch", "Premium Audio", "Ghế da", "Cửa sổ trời toàn cảnh"]
    },
    description: "Honda ZR-V 2024 - SUV coupe với thiết kế thể thao và công nghệ hiện đại",
    isAvailable: true,
    createdAt: new Date("2024-01-09T00:00:00.000Z"),
    updatedAt: new Date("2024-01-09T00:00:00.000Z")
  },
  {
    _id: "507f1f77bcf86cd799439020",
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
      safety: ["Honda SENSING", "8 túi khí", "Rear Cross Traffic Alert"],
      features: ["Màn hình 12.3 inch", "Premium Audio", "Ghế da cao cấp", "Cửa trượt điện"]
    },
    description: "Honda Odyssey 2024 - MPV cao cấp 8 chỗ với không gian rộng rãi và tiện nghi",
    isAvailable: true,
    createdAt: new Date("2024-01-10T00:00:00.000Z"),
    updatedAt: new Date("2024-01-10T00:00:00.000Z")
  }
];

export const mockStats = {
  overview: {
    totalCars: 10,
    avgPrice: 1094500000,
    minPrice: 599000000,
    maxPrice: 2100000000,
    avgYear: 2024,
    minYear: 2024,
    maxYear: 2024
  },
  categories: [
    { _id: "sedan", count: 3, avgPrice: 883000000, minPrice: 599000000, maxPrice: 1320000000 },
    { _id: "suv", count: 5, avgPrice: 960000000, minPrice: 750000000, maxPrice: 1250000000 },
    { _id: "hatchback", count: 2, avgPrice: 1375000000, minPrice: 650000000, maxPrice: 2100000000 },
    { _id: "mpv", count: 1, avgPrice: 1850000000, minPrice: 1850000000, maxPrice: 1850000000 }
  ],
  models: [
    { _id: "Civic", count: 2, avgPrice: 1415000000, years: [2024] },
    { _id: "City", count: 2, avgPrice: 624500000, years: [2024] },
    { _id: "CR-V", count: 1, avgPrice: 1250000000, years: [2024] },
    { _id: "HR-V", count: 1, avgPrice: 850000000, years: [2024] },
    { _id: "BR-V", count: 1, avgPrice: 750000000, years: [2024] },
    { _id: "Accord", count: 1, avgPrice: 1320000000, years: [2024] },
    { _id: "ZR-V", count: 1, avgPrice: 950000000, years: [2024] },
    { _id: "Odyssey", count: 1, avgPrice: 1850000000, years: [2024] }
  ],
  years: [
    { _id: 2024, count: 10, avgPrice: 1094500000, models: ["Civic", "City", "CR-V", "HR-V", "BR-V", "Accord", "ZR-V", "Odyssey"] }
  ],
  seating: [
    { _id: 5, count: 6, avgPrice: 1016500000 },
    { _id: 7, count: 2, avgPrice: 1000000000 },
    { _id: 8, count: 1, avgPrice: 1850000000 }
  ],
  fuelTypes: [
    { _id: "Xăng", count: 8, avgPrice: 1028750000 },
    { _id: "Hybrid", count: 2, avgPrice: 1285000000 }
  ],
  colors: [
    { _id: "Đỏ Ánh Kim", count: 2 },
    { _id: "Trắng Ngọc Trai", count: 2 },
    { _id: "Xanh Dương Ánh Kim", count: 1 },
    { _id: "Bạc Ánh Kim", count: 2 },
    { _id: "Đen Ánh Kim", count: 1 },
    { _id: "Xanh Lá Ánh Kim", count: 1 },
    { _id: "Đỏ Championship", count: 1 }
  ],
  generatedAt: new Date().toISOString()
};