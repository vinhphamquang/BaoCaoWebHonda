'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, ShoppingCart, User, Phone } from 'lucide-react';
import { useCartStore } from '@/stores/useCartStore';
import { useAuthStore } from '@/stores/useAuthStore';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { getTotalItems, toggleCart } = useCartStore();
  const { user, isAuthenticated, logout } = useAuthStore();

  const navigation = [
    { name: 'Trang chủ', href: '/' },
    { name: 'Sản phẩm', href: '/products' },
    { name: 'So sánh', href: '/compare' },
    { name: 'Tin tức', href: '/news' },
    { name: 'Lái thử', href: '/test-drive' },
    { name: 'Liên hệ', href: '/contact' },
  ];

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-blue-900 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-1" />
                <span>Hotline: 1900 23 23 89</span>
              </div>
              <span>Email: info@vinfast.vn</span>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Xin chào, {user?.name}</span>
                  <button
                    onClick={logout}
                    className="text-blue-200 hover:text-white"
                  >
                    Đăng xuất
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link href="/auth/login" className="hover:text-blue-200">
                    Đăng nhập
                  </Link>
                  <span>|</span>
                  <Link href="/auth/register" className="hover:text-blue-200">
                    Đăng ký
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="bg-blue-900 text-white px-4 py-2 rounded-lg font-bold text-xl">
                VinFast
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-blue-900 font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Cart and Mobile menu button */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleCart}
              className="relative p-2 text-gray-700 hover:text-blue-900 transition-colors"
            >
              <ShoppingCart className="h-6 w-6" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-blue-900"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-2 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block py-2 text-gray-700 hover:text-blue-900 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Mobile auth links */}
            <div className="border-t pt-2 mt-2">
              {isAuthenticated ? (
                <div className="space-y-2">
                  <div className="flex items-center py-2">
                    <User className="h-4 w-4 mr-2" />
                    <span>{user?.name}</span>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="block py-2 text-red-600 hover:text-red-800"
                  >
                    Đăng xuất
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link
                    href="/auth/login"
                    className="block py-2 text-gray-700 hover:text-blue-900"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    href="/auth/register"
                    className="block py-2 text-gray-700 hover:text-blue-900"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Đăng ký
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
