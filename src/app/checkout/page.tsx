'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useCartStore } from '@/stores/useCartStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { formatPrice } from '@/lib/utils';
import { CreditCard, MapPin, User, CheckCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface CheckoutForm {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  paymentMethod: 'bank_transfer' | 'credit_card' | 'cash';
  notes?: string;
}

export default function CheckoutPage() {
  const { items, getTotalAmount, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<CheckoutForm>({
    defaultValues: {
      fullName: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || ''
    }
  });

  if (items.length === 0 && !isCompleted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Giỏ hàng trống
          </h1>
          <p className="text-gray-600 mb-6">
            Bạn chưa có sản phẩm nào trong giỏ hàng
          </p>
          <Link
            href="/products"
            className="bg-blue-900 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition-colors"
          >
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    );
  }

  const onSubmit = async (data: CheckoutForm) => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('Order submission:', { ...data, items, total: getTotalAmount() });
    
    clearCart();
    setIsCompleted(true);
    setIsSubmitting(false);
  };

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Đặt cọc thành công!
          </h2>
          <p className="text-gray-600 mb-6">
            Cảm ơn bạn đã đặt cọc. Chúng tôi sẽ liên hệ với bạn trong vòng 24h để xác nhận đơn hàng.
          </p>
          <div className="space-y-3">
            <Link
              href="/products"
              className="w-full bg-blue-900 text-white py-3 px-4 rounded-lg hover:bg-blue-800 transition-colors font-medium block"
            >
              Tiếp tục mua sắm
            </Link>
            <Link
              href="/"
              className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium block"
            >
              Về trang chủ
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
              Thanh toán đặt cọc
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-6">Đơn hàng của bạn</h2>
            
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.car.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <div className="relative w-16 h-12 bg-gray-200 rounded">
                    <Image
                      src="/images/placeholder-car.jpg"
                      alt={item.car.name}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.car.name}</h3>
                    <p className="text-sm text-gray-500">Màu: {item.selectedColor}</p>
                    <p className="text-sm text-gray-500">Số lượng: {item.quantity}</p>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-medium">{formatPrice(item.depositAmount * item.quantity)}</p>
                    <p className="text-xs text-gray-500">Tiền đặt cọc</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Tổng tiền đặt cọc:</span>
                <span className="text-blue-900">{formatPrice(getTotalAmount())}</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                * Đây là tiền đặt cọc, không phải giá trị toàn bộ xe
              </p>
            </div>
          </div>

          {/* Checkout Form */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-6">Thông tin thanh toán</h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-md font-medium mb-4 flex items-center">
                  <User className="h-4 w-4 mr-2 text-blue-500" />
                  Thông tin cá nhân
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Họ và tên *
                    </label>
                    <input
                      type="text"
                      {...register('fullName', { required: 'Vui lòng nhập họ tên' })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors.fullName && (
                      <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số điện thoại *
                    </label>
                    <input
                      type="tel"
                      {...register('phone', { required: 'Vui lòng nhập số điện thoại' })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    {...register('email', { required: 'Vui lòng nhập email' })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>
              </div>

              {/* Address */}
              <div>
                <h3 className="text-md font-medium mb-4 flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-green-500" />
                  Địa chỉ
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Địa chỉ *
                    </label>
                    <input
                      type="text"
                      {...register('address', { required: 'Vui lòng nhập địa chỉ' })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors.address && (
                      <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Thành phố *
                    </label>
                    <select
                      {...register('city', { required: 'Vui lòng chọn thành phố' })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">-- Chọn thành phố --</option>
                      <option value="hanoi">Hà Nội</option>
                      <option value="hcm">TP. Hồ Chí Minh</option>
                      <option value="danang">Đà Nẵng</option>
                      <option value="haiphong">Hải Phòng</option>
                      <option value="cantho">Cần Thơ</option>
                    </select>
                    {errors.city && (
                      <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <h3 className="text-md font-medium mb-4 flex items-center">
                  <CreditCard className="h-4 w-4 mr-2 text-purple-500" />
                  Phương thức thanh toán
                </h3>
                
                <div className="space-y-3">
                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      {...register('paymentMethod', { required: 'Vui lòng chọn phương thức thanh toán' })}
                      value="bank_transfer"
                      className="mr-3"
                    />
                    <div>
                      <p className="font-medium">Chuyển khoản ngân hàng</p>
                      <p className="text-sm text-gray-500">Chuyển khoản qua ngân hàng</p>
                    </div>
                  </label>

                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      {...register('paymentMethod')}
                      value="credit_card"
                      className="mr-3"
                    />
                    <div>
                      <p className="font-medium">Thẻ tín dụng</p>
                      <p className="text-sm text-gray-500">Thanh toán bằng thẻ tín dụng</p>
                    </div>
                  </label>

                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      {...register('paymentMethod')}
                      value="cash"
                      className="mr-3"
                    />
                    <div>
                      <p className="font-medium">Tiền mặt tại showroom</p>
                      <p className="text-sm text-gray-500">Thanh toán trực tiếp tại showroom</p>
                    </div>
                  </label>
                </div>
                {errors.paymentMethod && (
                  <p className="mt-1 text-sm text-red-600">{errors.paymentMethod.message}</p>
                )}
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ghi chú
                </label>
                <textarea
                  {...register('notes')}
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ghi chú thêm cho đơn hàng..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-900 text-white py-3 px-6 rounded-lg hover:bg-blue-800 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Đang xử lý...' : `Xác nhận đặt cọc ${formatPrice(getTotalAmount())}`}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
