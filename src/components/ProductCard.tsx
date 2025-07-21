import Link from 'next/link';
import Image from 'next/image';
import { Car } from '@/data/cars';
import { formatPrice } from '@/lib/utils';
import { Battery, Zap, Users, Eye } from 'lucide-react';

interface ProductCardProps {
  car: Car;
  className?: string;
}

export default function ProductCard({ car, className = '' }: ProductCardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 ${className}`}>
      {/* Image */}
      <div className="relative h-48 bg-gray-200">
        <Image
          src="/images/placeholder-car.jpg"
          alt={car.name}
          fill
          className="object-cover"
        />
        
        {/* Electric badge */}
        {car.isElectric && (
          <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
            <Zap className="h-3 w-3 mr-1" />
            Điện
          </div>
        )}
        
        {/* Featured badge */}
        {car.isFeatured && (
          <div className="absolute top-3 right-3 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            Nổi bật
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title and Type */}
        <div className="mb-3">
          <h3 className="text-xl font-bold text-gray-900 mb-1">{car.name}</h3>
          <p className="text-sm text-gray-500 capitalize">
            {car.type === 'sedan' ? 'Sedan' : car.type === 'suv' ? 'SUV' : 'Xe điện'}
          </p>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {car.description}
        </p>

        {/* Key specs */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Battery className="h-4 w-4 mr-2 text-green-500" />
            <span>{car.specifications.power}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Users className="h-4 w-4 mr-2 text-blue-500" />
            <span>{car.specifications.seating} chỗ</span>
          </div>
        </div>

        {/* Price */}
        <div className="mb-4">
          <div className="text-2xl font-bold text-blue-900">
            {formatPrice(car.price)}
          </div>
          <p className="text-sm text-gray-500">Giá niêm yết</p>
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <Link
            href={`/products/${car.id}`}
            className="flex-1 bg-blue-900 text-white py-2 px-4 rounded-lg hover:bg-blue-800 transition-colors text-center font-medium flex items-center justify-center"
          >
            <Eye className="h-4 w-4 mr-2" />
            Xem chi tiết
          </Link>
          <Link
            href={`/test-drive?car=${car.id}`}
            className="flex-1 border border-blue-900 text-blue-900 py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors text-center font-medium"
          >
            Lái thử
          </Link>
        </div>
      </div>
    </div>
  );
}
