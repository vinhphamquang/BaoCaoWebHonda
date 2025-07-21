'use client';

import { useState } from 'react';
import { cars, Car } from '@/data/cars';
import { formatPrice } from '@/lib/utils';
import { Plus, X, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function ComparePage() {
  const [selectedCars, setSelectedCars] = useState<Car[]>([]);
  const [showCarSelector, setShowCarSelector] = useState(false);

  const addCar = (car: Car) => {
    if (selectedCars.length < 3 && !selectedCars.find(c => c.id === car.id)) {
      setSelectedCars([...selectedCars, car]);
      setShowCarSelector(false);
    }
  };

  const removeCar = (carId: string) => {
    setSelectedCars(selectedCars.filter(car => car.id !== carId));
  };

  const availableCars = cars.filter(car => !selectedCars.find(c => c.id === car.id));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center">
            <Link
              href="/products"
              className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Quay lại
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">
              So sánh xe VinFast
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {selectedCars.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Chọn xe để so sánh
            </h2>
            <p className="text-gray-600 mb-8">
              Bạn có thể so sánh tối đa 3 mẫu xe cùng lúc
            </p>
            <button
              onClick={() => setShowCarSelector(true)}
              className="bg-blue-900 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition-colors"
            >
              Chọn xe đầu tiên
            </button>
          </div>
        ) : (
          <div>
            {/* Car Selection */}
            <div className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedCars.map((car) => (
                  <div key={car.id} className="bg-white rounded-lg shadow-sm p-4 relative">
                    <button
                      onClick={() => removeCar(car.id)}
                      className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <div className="text-center">
                      <Image
                        src="/images/placeholder-car.jpg"
                        alt={car.name}
                        width={200}
                        height={120}
                        className="w-full h-24 object-cover rounded mb-2"
                      />
                      <h3 className="font-semibold text-gray-900">{car.name}</h3>
                      <p className="text-blue-900 font-medium">{formatPrice(car.price)}</p>
                    </div>
                  </div>
                ))}
                
                {selectedCars.length < 3 && (
                  <button
                    onClick={() => setShowCarSelector(true)}
                    className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 hover:bg-blue-50 transition-colors"
                  >
                    <Plus className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">Thêm xe để so sánh</p>
                  </button>
                )}
              </div>
            </div>

            {/* Comparison Table */}
            {selectedCars.length > 1 && (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Thông số
                        </th>
                        {selectedCars.map((car) => (
                          <th key={car.id} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {car.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Giá bán
                        </td>
                        {selectedCars.map((car) => (
                          <td key={car.id} className="px-6 py-4 whitespace-nowrap text-sm text-center font-semibold text-blue-900">
                            {formatPrice(car.price)}
                          </td>
                        ))}
                      </tr>
                      
                      <tr className="bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Loại xe
                        </td>
                        {selectedCars.map((car) => (
                          <td key={car.id} className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                            {car.type === 'sedan' ? 'Sedan' : car.type === 'suv' ? 'SUV' : 'Xe điện'}
                          </td>
                        ))}
                      </tr>
                      
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Công suất
                        </td>
                        {selectedCars.map((car) => (
                          <td key={car.id} className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                            {car.specifications.power}
                          </td>
                        ))}
                      </tr>
                      
                      <tr className="bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Số chỗ ngồi
                        </td>
                        {selectedCars.map((car) => (
                          <td key={car.id} className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                            {car.specifications.seating} chỗ
                          </td>
                        ))}
                      </tr>
                      
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Tốc độ tối đa
                        </td>
                        {selectedCars.map((car) => (
                          <td key={car.id} className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                            {car.specifications.topSpeed}
                          </td>
                        ))}
                      </tr>
                      
                      <tr className="bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Tăng tốc 0-100km/h
                        </td>
                        {selectedCars.map((car) => (
                          <td key={car.id} className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                            {car.specifications.acceleration}
                          </td>
                        ))}
                      </tr>
                      
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Chiều dài
                        </td>
                        {selectedCars.map((car) => (
                          <td key={car.id} className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                            {car.specifications.length}
                          </td>
                        ))}
                      </tr>
                      
                      <tr className="bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Dung tích cốp
                        </td>
                        {selectedCars.map((car) => (
                          <td key={car.id} className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                            {car.specifications.trunkCapacity}
                          </td>
                        ))}
                      </tr>
                      
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Nhiên liệu
                        </td>
                        {selectedCars.map((car) => (
                          <td key={car.id} className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                            {car.specifications.fuelType}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Car Selector Modal */}
        {showCarSelector && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => setShowCarSelector(false)} />
              
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-full max-w-4xl">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-medium text-gray-900">
                      Chọn xe để so sánh
                    </h3>
                    <button
                      onClick={() => setShowCarSelector(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {availableCars.map((car) => (
                      <button
                        key={car.id}
                        onClick={() => addCar(car)}
                        className="bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:shadow-md transition-all text-left"
                      >
                        <Image
                          src="/images/placeholder-car.jpg"
                          alt={car.name}
                          width={200}
                          height={120}
                          className="w-full h-24 object-cover rounded mb-2"
                        />
                        <h4 className="font-semibold text-gray-900">{car.name}</h4>
                        <p className="text-blue-900 font-medium">{formatPrice(car.price)}</p>
                        <p className="text-sm text-gray-500 mt-1">{car.specifications.power}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
