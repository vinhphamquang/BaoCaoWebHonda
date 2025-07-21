'use client';

import { useCartStore } from '@/stores/useCartStore';
import { formatPrice } from '@/lib/utils';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Cart() {
  const { 
    items, 
    isOpen, 
    closeCart, 
    removeItem, 
    updateQuantity, 
    getTotalAmount,
    clearCart 
  } = useCartStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={closeCart}
      />
      
      {/* Cart panel */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Giỏ hàng ({items.length})</h2>
            <button
              onClick={closeCart}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Cart items */}
          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <ShoppingBag className="h-16 w-16 mb-4" />
                <p className="text-lg font-medium mb-2">Giỏ hàng trống</p>
                <p className="text-sm text-center">
                  Thêm sản phẩm vào giỏ hàng để bắt đầu mua sắm
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.car.id} className="border rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      {/* Car image */}
                      <div className="relative w-16 h-12 bg-gray-200 rounded">
                        <Image
                          src="/images/placeholder-car.jpg"
                          alt={item.car.name}
                          fill
                          className="object-cover rounded"
                        />
                      </div>

                      {/* Car info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">
                          {item.car.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Màu: {item.selectedColor}
                        </p>
                        <p className="text-sm font-medium text-blue-900">
                          {formatPrice(item.depositAmount)}
                        </p>
                        <p className="text-xs text-gray-400">
                          Tiền đặt cọc
                        </p>
                      </div>

                      {/* Remove button */}
                      <button
                        onClick={() => removeItem(item.car.id)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <X className="h-4 w-4 text-gray-400" />
                      </button>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.car.id, item.quantity - 1)}
                          className="p-1 hover:bg-gray-100 rounded"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.car.id, item.quantity + 1)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-medium">
                          {formatPrice(item.depositAmount * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t p-4 space-y-4">
              {/* Total */}
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Tổng cộng:</span>
                <span className="text-xl font-bold text-blue-900">
                  {formatPrice(getTotalAmount())}
                </span>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="w-full bg-blue-900 text-white py-3 px-4 rounded-lg hover:bg-blue-800 transition-colors font-medium text-center block"
                >
                  Thanh toán
                </Link>
                <button
                  onClick={clearCart}
                  className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Xóa tất cả
                </button>
              </div>

              <p className="text-xs text-gray-500 text-center">
                * Đây là tiền đặt cọc, không phải giá trị toàn bộ xe
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
