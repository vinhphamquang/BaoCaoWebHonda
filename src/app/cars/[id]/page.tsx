'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Heart, Share2, Phone, MessageCircle, Car, Fuel, Users, Calendar, Palette, Settings } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Loading from '@/components/ui/Loading';
import { Car as CarType } from '@/types';
import { formatPrice } from '@/lib/utils';
import { useToast } from '@/components/ui/Toast';

const CarDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const [car, setCar] = useState<CarType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);
  const { success } = useToast();

  useEffect(() => {
    if (params.id) {
      fetchCarDetail(params.id as string);
    }
  }, [params.id]);

  const fetchCarDetail = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/cars/${id}`);
      const data = await response.json();

      if (data.success) {
        setCar(data.data);
        setError(null);
      } else {
        setError(data.error || 'Không tìm thấy xe');
      }
    } catch (err) {
      setError('Lỗi kết nối. Vui lòng thử lại.');
      console.error('Error fetching car detail:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleContactRequest = () => {
    if (!car) return;
    
    setShowContactForm(true);
    success('Yêu cầu tư vấn!', `Yêu cầu tư vấn về ${car.name} đã được gửi.`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Loading size="lg" text="Đang tải thông tin xe..." />
        </div>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {error || 'Không tìm thấy xe'}
          </h2>
          <div className="space-x-4">
            <Button onClick={() => router.back()}>
              Quay lại
            </Button>
            <Link href="/cars">
              <Button variant="outline">
                Xem tất cả xe
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-red-600">Trang chủ</Link>
            <span>/</span>
            <Link href="/cars" className="hover:text-red-600">Xe Honda</Link>
            <span>/</span>
            <span className="text-gray-900">{car.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative">
              <div className="w-full h-96 bg-gray-300 rounded-lg flex items-center justify-center">
                <span className="text-gray-600 text-lg">{car.name}</span>
              </div>
              <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                {car.category.toUpperCase()}
              </div>
              <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
                {car.year}
              </div>
            </div>
            
            {/* Thumbnail images */}
            <div className="grid grid-cols-4 gap-2">
              {car.images.map((_, index) => (
                <div
                  key={index}
                  className={`w-full h-20 bg-gray-200 rounded cursor-pointer border-2 ${
                    selectedImageIndex === index ? 'border-red-600' : 'border-transparent'
                  }`}
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <div className="w-full h-full flex items-center justify-center text-xs text-gray-600">
                    Ảnh {index + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Car Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                {car.name}
              </h1>
              <div className="flex items-center space-x-4 text-gray-600">
                <span className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {car.year}
                </span>
                <span className="flex items-center">
                  <Palette className="h-4 w-4 mr-1" />
                  {car.color}
                </span>
                <span className="flex items-center">
                  <Car className="h-4 w-4 mr-1" />
                  {car.category}
                </span>
              </div>
            </div>

            <div className="text-4xl font-bold text-red-600">
              {formatPrice(car.price)}
            </div>

            <p className="text-gray-700 leading-relaxed">
              {car.description}
            </p>

            {/* Quick Specs */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Settings className="h-5 w-5 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-600">Động cơ</div>
                  <div className="font-medium">{car.specifications.engine}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Fuel className="h-5 w-5 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-600">Nhiên liệu</div>
                  <div className="font-medium">{car.specifications.fuelType}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-600">Số chỗ ngồi</div>
                  <div className="font-medium">{car.specifications.seating} chỗ</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Car className="h-5 w-5 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-600">Hộp số</div>
                  <div className="font-medium">{car.specifications.transmission}</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="flex space-x-4">
                <Button 
                  size="lg" 
                  className="flex-1"
                  onClick={handleContactRequest}
                >
                  Đặt lịch lái thử
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => setShowContactForm(true)}
                >
                  <Phone className="h-5 w-5 mr-2" />
                  Liên hệ
                </Button>
              </div>
              

            </div>

            {/* Contact Info */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900">Liên hệ tư vấn</h4>
                    <p className="text-sm text-gray-600">Hotline: 1900-1234</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Detailed Specifications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Technical Specs */}
          <Card>
            <CardHeader>
              <CardTitle>Thông số kỹ thuật</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-600">Động cơ</div>
                  <div className="font-medium">{car.specifications.engine}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Hộp số</div>
                  <div className="font-medium">{car.specifications.transmission}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Nhiên liệu</div>
                  <div className="font-medium">{car.specifications.fuelType}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Mức tiêu thụ</div>
                  <div className="font-medium">{car.specifications.mileage}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Số chỗ ngồi</div>
                  <div className="font-medium">{car.specifications.seating} chỗ</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Màu sắc</div>
                  <div className="font-medium">{car.color}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Safety Features */}
          <Card>
            <CardHeader>
              <CardTitle>Tính năng an toàn</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {car.specifications.safety.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-red-600 rounded-full mr-3"></div>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Features */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Tính năng tiện nghi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {car.specifications.features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Back to Cars */}
        <div className="mt-12 text-center">
          <Link href="/cars">
            <Button variant="outline" size="lg">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Quay lại danh sách xe
            </Button>
          </Link>
        </div>
      </div>

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Liên hệ tư vấn - {car.name}
            </h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Họ và tên
                </label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Nhập họ và tên"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Nhập số điện thoại"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Nhập email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ghi chú
                </label>
                <textarea
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Nhập ghi chú (tùy chọn)"
                />
              </div>
              <div className="flex space-x-4">
                <Button type="submit" className="flex-1">
                  Gửi yêu cầu
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowContactForm(false)}
                >
                  Hủy
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarDetailPage;
