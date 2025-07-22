'use client';

import React from 'react';
import Link from 'next/link';
import { Phone } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Car } from '@/types';
import { formatPrice } from '@/lib/utils';
import { useToast } from '@/components/ui/Toast';

interface CarCardProps {
  car: Car;
  viewMode?: 'grid' | 'list';
  className?: string;
}

const CarCard: React.FC<CarCardProps> = ({ car, viewMode = 'grid', className }) => {
  const { success } = useToast();

  // Không còn sử dụng các hàm xử lý sự kiện cho nút yêu thích và xem nhanh

  if (viewMode === 'list') {
    return (
      <Card className={`group hover:shadow-lg transition-all duration-300 card-hover ${className}`}>
        <Link href={`/cars/${car._id}`}>
          <div className="flex gap-6 p-6">
            {/* Car Image */}
            <div className="w-48 h-32 bg-gray-300 rounded-lg flex items-center justify-center flex-shrink-0 relative overflow-hidden">
              <span className="text-gray-600 text-sm">{car.name}</span>
              <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-medium">
                {car.category.toUpperCase()}
              </div>
              <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                {car.year}
              </div>
            </div>

            {/* Car Info */}
            <div className="flex-1 space-y-3">
              <div>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-red-600 transition-colors">
                  {car.name}
                </h3>
                <p className="text-gray-600">{car.color} • {car.year}</p>
              </div>
              
              <p className="text-gray-700 text-sm line-clamp-2">
                {car.description}
              </p>

              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>🚗 {car.specifications.engine}</span>
                <span>⛽ {car.specifications.fuelType}</span>
                <span>👥 {car.specifications.seating} chỗ</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-red-600">
                  {formatPrice(car.price)}
                </div>
                <div className="flex items-center space-x-2">
                  <Button size="sm">
                    Xem chi tiết
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </Card>
    );
  }

  return (
    <Card className={`group hover:shadow-2xl transition-all duration-500 card-hover bg-white/80 backdrop-blur-sm border-0 shadow-lg ${className}`}>
      <Link href={`/cars/${car._id}`}>
        <div className="relative overflow-hidden rounded-t-2xl">
          <div className="w-full h-56 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center relative">
            <div className="text-center">
              <div className="text-4xl mb-2">🚗</div>
              <span className="text-gray-700 font-semibold">{car.name}</span>
            </div>

            {/* Đã xóa overlay với các nút thao tác nhanh */}
          </div>

          <div className="absolute top-4 left-4 gradient-primary text-white px-4 py-2 rounded-2xl text-sm font-bold shadow-lg">
            {car.category.toUpperCase()}
          </div>
          <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-xl text-sm font-semibold border border-white/20">
            {car.year}
          </div>

          {/* Premium Availability badge */}
          {car.isAvailable && (
            <div className="absolute bottom-4 left-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-xl text-xs font-bold shadow-lg animate-pulse">
              ✨ CÓ SẴN
            </div>
          )}
        </div>

        <CardContent className="p-8">
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 group-hover:text-red-600 transition-colors leading-tight">
                {car.name}
              </h3>
              <p className="text-gray-600 font-medium mt-1">{car.color}</p>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <span>🚗</span>
                <span className="font-medium">{car.specifications.engine}</span>
              </div>
              <div className="flex items-center gap-1">
                <span>⛽</span>
                <span className="font-medium">{car.specifications.fuelType}</span>
              </div>
            </div>

            <div className="text-3xl font-black text-gradient bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
              {formatPrice(car.price)}
            </div>

            <div className="flex">
              <Button className="flex-1 gradient-primary hover:shadow-lg btn-hover-lift font-semibold py-3 rounded-xl" size="sm">
                Xem chi tiết
              </Button>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

export default CarCard;
