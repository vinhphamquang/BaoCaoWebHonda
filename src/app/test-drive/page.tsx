'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import { cars, getCarById } from '@/data/cars';
import { Calendar, Clock, MapPin, User, Phone, Mail, Car } from 'lucide-react';

interface TestDriveForm {
  carId: string;
  fullName: string;
  email: string;
  phone: string;
  preferredDate: string;
  preferredTime: string;
  location: string;
  message?: string;
}

export default function TestDrivePage() {
  const searchParams = useSearchParams();
  const preSelectedCarId = searchParams.get('car');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<TestDriveForm>();

  const selectedCarId = watch('carId');
  const selectedCar = selectedCarId ? getCarById(selectedCarId) : null;

  useEffect(() => {
    if (preSelectedCarId) {
      setValue('carId', preSelectedCarId);
    }
  }, [preSelectedCarId, setValue]);

  const onSubmit = async (data: TestDriveForm) => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('Test drive registration:', data);
    setIsSubmitted(true);
    setIsSubmitting(false);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Car className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Đăng ký thành công!
          </h2>
          <p className="text-gray-600 mb-6">
            Cảm ơn bạn đã đăng ký lái thử. Chúng tôi sẽ liên hệ với bạn trong vòng 24h để xác nhận lịch hẹn.
          </p>
          <button
            onClick={() => setIsSubmitted(false)}
            className="bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition-colors"
          >
            Đăng ký thêm
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Đăng ký lái thử
          </h1>
          <p className="text-lg text-gray-600">
            Trải nghiệm cảm giác lái xe điện VinFast hoàn toàn miễn phí
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6">Thông tin đăng ký</h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Car Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Car className="inline h-4 w-4 mr-1" />
                  Chọn xe muốn lái thử *
                </label>
                <select
                  {...register('carId', { required: 'Vui lòng chọn xe' })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">-- Chọn mẫu xe --</option>
                  {cars.map((car) => (
                    <option key={car.id} value={car.id}>
                      {car.name}
                    </option>
                  ))}
                </select>
                {errors.carId && (
                  <p className="mt-1 text-sm text-red-600">{errors.carId.message}</p>
                )}
              </div>

              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="inline h-4 w-4 mr-1" />
                    Họ và tên *
                  </label>
                  <input
                    type="text"
                    {...register('fullName', { required: 'Vui lòng nhập họ tên' })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nguyễn Văn A"
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="inline h-4 w-4 mr-1" />
                    Số điện thoại *
                  </label>
                  <input
                    type="tel"
                    {...register('phone', { 
                      required: 'Vui lòng nhập số điện thoại',
                      pattern: {
                        value: /^[0-9]{10,11}$/,
                        message: 'Số điện thoại không hợp lệ'
                      }
                    })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0123456789"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="inline h-4 w-4 mr-1" />
                  Email *
                </label>
                <input
                  type="email"
                  {...register('email', { 
                    required: 'Vui lòng nhập email',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Email không hợp lệ'
                    }
                  })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="example@email.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              {/* Schedule */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="inline h-4 w-4 mr-1" />
                    Ngày mong muốn *
                  </label>
                  <input
                    type="date"
                    {...register('preferredDate', { required: 'Vui lòng chọn ngày' })}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.preferredDate && (
                    <p className="mt-1 text-sm text-red-600">{errors.preferredDate.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="inline h-4 w-4 mr-1" />
                    Giờ mong muốn *
                  </label>
                  <select
                    {...register('preferredTime', { required: 'Vui lòng chọn giờ' })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">-- Chọn giờ --</option>
                    <option value="08:00">08:00</option>
                    <option value="09:00">09:00</option>
                    <option value="10:00">10:00</option>
                    <option value="11:00">11:00</option>
                    <option value="14:00">14:00</option>
                    <option value="15:00">15:00</option>
                    <option value="16:00">16:00</option>
                    <option value="17:00">17:00</option>
                  </select>
                  {errors.preferredTime && (
                    <p className="mt-1 text-sm text-red-600">{errors.preferredTime.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="inline h-4 w-4 mr-1" />
                  Địa điểm lái thử *
                </label>
                <select
                  {...register('location', { required: 'Vui lòng chọn địa điểm' })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">-- Chọn showroom --</option>
                  <option value="hanoi">Showroom Hà Nội - Long Biên</option>
                  <option value="hcm">Showroom TP.HCM - Quận 1</option>
                  <option value="danang">Showroom Đà Nẵng - Hải Châu</option>
                  <option value="haiphong">Showroom Hải Phòng - Lê Chân</option>
                </select>
                {errors.location && (
                  <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ghi chú thêm
                </label>
                <textarea
                  {...register('message')}
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Có điều gì đặc biệt bạn muốn chúng tôi biết..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-900 text-white py-3 px-6 rounded-lg hover:bg-blue-800 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Đang gửi...' : 'Đăng ký lái thử'}
              </button>
            </form>
          </div>

          {/* Selected Car Info */}
          <div className="space-y-6">
            {selectedCar && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">Xe bạn chọn</h3>
                <div className="space-y-4">
                  <Image
                    src="/images/placeholder-car.jpg"
                    alt={selectedCar.name}
                    width={400}
                    height={200}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <div>
                    <h4 className="font-semibold text-lg">{selectedCar.name}</h4>
                    <p className="text-gray-600 text-sm mt-1">{selectedCar.description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Công suất:</span>
                      <span className="font-medium ml-2">{selectedCar.specifications.power}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Số chỗ:</span>
                      <span className="font-medium ml-2">{selectedCar.specifications.seating}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Info */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">
                Thông tin quan trọng
              </h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>• Lái thử hoàn toàn miễn phí</li>
                <li>• Thời gian lái thử: 30-45 phút</li>
                <li>• Cần mang theo GPLX hạng B1 trở lên</li>
                <li>• Nhân viên tư vấn sẽ đồng hành</li>
                <li>• Có thể thay đổi lịch hẹn trước 24h</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
