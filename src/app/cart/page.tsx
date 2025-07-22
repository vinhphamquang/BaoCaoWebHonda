'use client';

import React from 'react';
import Link from 'next/link';
import { Trash2, Plus, Minus, ShoppingCart, ArrowLeft } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/contexts/CartContext';

const CartPage: React.FC = () => {
  const {
    items: cartItems,
    totalItems,
    totalPrice,
    isLoading: loading,
    updateQuantity,
    removeItem,
    clearCart
  } = useCart();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Đang tải giỏ hàng...</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <ShoppingCart className="h-24 w-24 text-gray-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Giỏ hàng của bạn đang trống
            </h2>
            <p className="text-gray-600 mb-8">
              Hãy khám phá bộ sưu tập xe Honda của chúng tôi
            </p>
            <Link href="/cars">
              <Button size="lg">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Tiếp tục mua sắm
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Giỏ hàng</h1>
              <p className="text-gray-600 mt-2">
                {totalItems} sản phẩm trong giỏ hàng
              </p>
            </div>
            <Link href="/cars">
              <Button variant="outline">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Tiếp tục mua sắm
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">
                Sản phẩm đã chọn
              </h2>
              <Button variant="ghost" size="sm" onClick={clearCart}>
                <Trash2 className="h-4 w-4 mr-2" />
                Xóa tất cả
              </Button>
            </div>

            {cartItems.map((item) => (
              <Card key={item.car._id}>
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    {/* Car Image */}
                    <div className="w-32 h-24 bg-gray-300 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-gray-600 text-sm">{item.car.name}</span>
                    </div>

                    {/* Car Info */}
                    <div className="flex-1 space-y-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {item.car.name}
                        </h3>
                        <p className="text-gray-600">
                          {item.car.color} • {item.car.year}
                        </p>
                      </div>
                      
                      <div className="text-xl font-bold text-red-600">
                        {formatPrice(item.car.price)}
                      </div>

                      <div className="flex items-center justify-between">
                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-3">
                          <span className="text-sm text-gray-600">Số lượng:</span>
                          <div className="flex items-center border border-gray-300 rounded-lg">
                            <button
                              onClick={() => updateQuantity(item.car._id!, item.quantity - 1)}
                              className="p-2 hover:bg-gray-50 rounded-l-lg"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="px-4 py-2 border-x border-gray-300 min-w-[3rem] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.car._id!, item.quantity + 1)}
                              className="p-2 hover:bg-gray-50 rounded-r-lg"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        {/* Remove Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.car._id!)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Xóa
                        </Button>
                      </div>

                      {/* Subtotal */}
                      <div className="text-right">
                        <span className="text-sm text-gray-600">Thành tiền: </span>
                        <span className="text-lg font-semibold text-gray-900">
                          {formatPrice(item.car.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Tóm tắt đơn hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tạm tính:</span>
                    <span className="font-medium">{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phí vận chuyển:</span>
                    <span className="font-medium text-green-600">Miễn phí</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold">Tổng cộng:</span>
                      <span className="text-xl font-bold text-red-600">
                        {formatPrice(totalPrice)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button size="lg" className="w-full">
                    Đặt hàng ngay
                  </Button>
                  <Button variant="outline" size="lg" className="w-full">
                    Liên hệ tư vấn
                  </Button>
                </div>

                <div className="text-center text-sm text-gray-600">
                  <p>🚚 Miễn phí vận chuyển toàn quốc</p>
                  <p>🔒 Thanh toán an toàn</p>
                  <p>📞 Hỗ trợ 24/7: 1900-1234</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
