'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getCarById } from '@/data/cars';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/stores/useCartStore';
import {
  ArrowLeft,
  Heart,
  Share2,
  ShoppingCart,
  Car,
  Zap,
  Settings,
  Shield,
  CheckCircle
} from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const car = getCarById(params.id as string);
  const { addItem } = useCartStore();
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [depositAmount, setDepositAmount] = useState(50000000); // 50M VNĐ mặc định

  if (!car) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Không tìm thấy sản phẩm
          </h1>
          <Link
            href="/products"
            className="text-blue-600 hover:text-blue-800 flex items-center justify-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại danh sách sản phẩm
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedColor) {
      alert('Vui lòng chọn màu xe');
      return;
    }
    addItem(car, selectedColor, depositAmount);
    alert('Đã thêm vào giỏ hàng!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-700">
              Trang chủ
            </Link>
            <span className="text-gray-400">/</span>
            <Link href="/products" className="text-gray-500 hover:text-gray-700">
              Sản phẩm
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">{car.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            <div className="relative bg-white rounded-lg overflow-hidden mb-4">
              <Image
                src="/images/placeholder-car.jpg"
                alt={car.name}
                width={600}
                height={400}
                className="w-full h-96 object-cover"
              />
              
              {/* Image navigation */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {car.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-3 h-3 rounded-full ${
                      selectedImage === index ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>
            
            {/* Thumbnail images */}
            <div className="grid grid-cols-3 gap-2">
              {car.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative bg-white rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-blue-500' : 'border-gray-200'
                  }`}
                >
                  <Image
                    src="/images/placeholder-car.jpg"
                    alt={`${car.name} ${index + 1}`}
                    width={200}
                    height={120}
                    className="w-full h-20 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="bg-white rounded-lg p-6">
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {car.name}
                  </h1>
                  <div className="flex items-center space-x-4">
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      {car.isElectric ? 'Xe điện' : 'Xe xăng'}
                    </span>
                    <span className="text-gray-500">Năm {car.year}</span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Heart className="h-5 w-5" />
                  </button>
                  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="text-3xl font-bold text-blue-900 mb-2">
                  {formatPrice(car.price)}
                </div>
                <p className="text-gray-600">Giá niêm yết (chưa bao gồm phí trước bạ)</p>
              </div>

              {/* Description */}
              <div className="mb-6">
                <p className="text-gray-700 leading-relaxed">
                  {car.description}
                </p>
              </div>

              {/* Key Specs */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center space-x-3">
                  <Zap className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-500">Công suất</p>
                    <p className="font-medium">{car.specifications.power}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Car className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-500">Số chỗ ngồi</p>
                    <p className="font-medium">{car.specifications.seating} chỗ</p>
                  </div>
                </div>
              </div>

              {/* Color Selection */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Chọn màu xe</h3>
                <div className="grid grid-cols-2 gap-2">
                  {car.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`p-3 border rounded-lg text-left transition-colors ${
                        selectedColor === color
                          ? 'border-blue-500 bg-blue-50 text-blue-900'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Deposit Amount */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Số tiền đặt cọc</h3>
                <div className="space-y-2">
                  {[50000000, 100000000, 200000000].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setDepositAmount(amount)}
                      className={`w-full p-3 border rounded-lg text-left transition-colors ${
                        depositAmount === amount
                          ? 'border-blue-500 bg-blue-50 text-blue-900'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span>{formatPrice(amount)}</span>
                        {depositAmount === amount && (
                          <CheckCircle className="h-5 w-5 text-blue-500" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-blue-900 text-white py-3 px-6 rounded-lg hover:bg-blue-800 transition-colors font-semibold flex items-center justify-center"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Đặt cọc ngay
                </button>

                <Link
                  href={`/test-drive?car=${car.id}`}
                  className="w-full border border-blue-900 text-blue-900 py-3 px-6 rounded-lg hover:bg-blue-50 transition-colors font-semibold text-center block"
                >
                  Đăng ký lái thử
                </Link>

                <Link
                  href="/contact"
                  className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-center block"
                >
                  Liên hệ tư vấn
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Specifications */}
        <div className="mt-12 bg-white rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Thông số kỹ thuật</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Settings className="h-5 w-5 mr-2 text-blue-500" />
                Động cơ & Hiệu suất
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Loại động cơ:</span>
                  <span className="font-medium">{car.specifications.engine}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Công suất:</span>
                  <span className="font-medium">{car.specifications.power}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Hộp số:</span>
                  <span className="font-medium">{car.specifications.transmission}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Nhiên liệu:</span>
                  <span className="font-medium">{car.specifications.fuelType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tốc độ tối đa:</span>
                  <span className="font-medium">{car.specifications.topSpeed}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tăng tốc 0-100km/h:</span>
                  <span className="font-medium">{car.specifications.acceleration}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Car className="h-5 w-5 mr-2 text-green-500" />
                Kích thước & Trọng lượng
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Chiều dài:</span>
                  <span className="font-medium">{car.specifications.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Chiều rộng:</span>
                  <span className="font-medium">{car.specifications.width}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Chiều cao:</span>
                  <span className="font-medium">{car.specifications.height}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Chiều dài cơ sở:</span>
                  <span className="font-medium">{car.specifications.wheelbase}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Khoảng sáng gầm:</span>
                  <span className="font-medium">{car.specifications.groundClearance}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Dung tích cốp:</span>
                  <span className="font-medium">{car.specifications.trunkCapacity}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Shield className="h-5 w-5 mr-2 text-purple-500" />
                Tiện nghi & An toàn
              </h3>
              <div className="space-y-2">
                {car.features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
