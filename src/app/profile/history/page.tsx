'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Search, Trash2, Clock } from 'lucide-react';
import { useUserActivity } from '@/hooks/useUserActivity';
import Button from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import { formatPrice, getCarImageUrl } from '@/lib/utils';
import { Car } from '@/types';

interface CarDetail extends Car {
  _id: string;
  viewedAt?: number;
}

const HistoryPage: React.FC = () => {
  const { viewedCars, clearViewedHistory } = useUserActivity();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewedCarDetails, setViewedCarDetails] = useState<CarDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Tải thông tin chi tiết của các xe đã xem
  useEffect(() => {
    const fetchViewedCars = async () => {
      if (viewedCars.length === 0) {
        setViewedCarDetails([]);
        setLoading(false);
        return;
      }

      try {
        // Trong môi trường thực tế, bạn sẽ gọi API để lấy thông tin chi tiết của xe
        // Ví dụ: const response = await fetch(`/api/cars?ids=${viewedCars.join(',')}`); 
        // Nhưng ở đây chúng ta sẽ sử dụng dữ liệu giả lập
        
        // Giả lập dữ liệu xe
        const mockCars: CarDetail[] = viewedCars.map((id, index) => ({
          _id: id,
          name: `Honda ${['Civic', 'CR-V', 'Accord', 'City', 'HR-V'][index % 5]} ${2020 + (index % 5)}`,
          price: 800000000 + (index * 50000000),
          category: ['sedan', 'suv', 'hatchback', 'coupe'][index % 4],
          model: ['Civic', 'CR-V', 'Accord', 'City', 'HR-V'][index % 5],
          year: 2020 + (index % 5),
          color: ['Đỏ', 'Đen', 'Trắng', 'Xanh', 'Bạc'][index % 5],
          images: [`cars/img/img/Honda-${['Civic', 'CR-V', 'Accord', 'City', 'HR-V'][index % 5]}.jpg`],
          description: 'Xe Honda chính hãng với thiết kế hiện đại, tiết kiệm nhiên liệu và công nghệ an toàn tiên tiến.',
          viewedAt: Date.now() - (index * 3600000), // Thời gian xem giảm dần (giờ)
          specifications: {
            engine: '1.5L VTEC TURBO',
            transmission: 'CVT',
            fuelType: 'Xăng',
            mileage: '6.5L/100km',
            seating: 5,
            dimensions: { length: 4.6, width: 1.8, height: 1.4 },
            safety: ['ABS', 'EBD', 'BA', 'VSA', 'HSA'],
            features: ['Màn hình cảm ứng', 'Camera lùi', 'Cảm biến va chạm', 'Kết nối Bluetooth']
          }
        }));

        // Lọc xe theo từ khóa tìm kiếm nếu có
        const filteredCars = searchTerm
          ? mockCars.filter(car => 
              car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
              car.category.toLowerCase().includes(searchTerm.toLowerCase())
            )
          : mockCars;

        // Sắp xếp theo thời gian xem gần nhất
        const sortedCars = filteredCars.sort((a, b) => 
          (b.viewedAt || 0) - (a.viewedAt || 0)
        );

        setViewedCarDetails(sortedCars);
      } catch (error) {
        console.error('Lỗi khi tải thông tin xe đã xem:', error);
        setError('Không thể tải thông tin xe đã xem. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchViewedCars();
  }, [viewedCars, searchTerm]);

  // Định dạng thời gian xem
  const formatViewTime = (timestamp?: number): string => {
    if (!timestamp) return 'Không xác định';
    
    const now = Date.now();
    const diffMs = now - timestamp;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 30) return `${diffDays} ngày trước`;
    
    const date = new Date(timestamp);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <Link href="/profile" className="inline-flex items-center text-gray-600 hover:text-red-600 mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Lịch sử xem</h1>
          </div>

          {/* Search */}
          <div className="w-full md:w-64 mt-4 md:mt-0">
            <div className="relative">
              <Input
                type="text"
                placeholder="Tìm kiếm xe..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Clear all button */}
        {viewedCars.length > 0 && (
          <div className="flex justify-end mb-4">
            <Button
              variant="outline"
              className="text-red-600 border-red-600 hover:bg-red-50"
              onClick={clearViewedHistory}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Xóa lịch sử
            </Button>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-600 mb-4">{error}</div>
            <Button onClick={() => window.location.reload()}>Thử lại</Button>
          </div>
        ) : viewedCars.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-lg border border-gray-200">
            <Clock className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-700 mb-2">Chưa có lịch sử xem</h2>
            <p className="text-gray-500 mb-6">Bạn chưa xem chi tiết xe nào</p>
            <Link href="/cars">
              <Button>
                Khám phá các mẫu xe Honda
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {viewedCarDetails.map((car) => (
              <Card key={car._id} className="group hover:shadow-lg transition-all duration-300">
                <Link href={`/cars/${car._id}`}>
                  <div className="relative h-48 overflow-hidden rounded-t-lg">
                    {car.images && car.images.length > 0 ? (
                      <Image
                        src={getCarImageUrl(car.images[0])}
                        alt={car.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400">Không có hình ảnh</span>
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                      <div className="flex items-center text-white text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{formatViewTime(car.viewedAt)}</span>
                      </div>
                    </div>
                  </div>
                </Link>

                <CardContent className="p-4">
                  <Link href={`/cars/${car._id}`}>
                    <h3 className="text-lg font-bold text-gray-900 hover:text-red-600 transition-colors mb-2">
                      {car.name}
                    </h3>
                  </Link>

                  <div className="text-xl font-bold text-red-600 mb-2">
                    {formatPrice(car.price)}
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                      {car.year}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                      {car.model}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                      {car.category}
                    </span>
                  </div>

                  <Link href={`/cars/${car._id}`}>
                    <Button className="w-full">
                      Xem chi tiết
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;