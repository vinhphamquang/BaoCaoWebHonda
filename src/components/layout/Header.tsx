'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Menu, X, ShoppingCart, Phone, Mail, Sparkles } from 'lucide-react';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { useCart } from '@/contexts/CartContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();
  const { totalItems } = useCart();

  const navigation = [
    {
      name: 'Trang chủ',
      href: '/',
      icon: '🏠',
      description: 'Khám phá Honda Plus'
    },
    {
      name: 'Bộ sưu tập',
      href: '/cars',
      icon: '🚗',
      description: 'Xe Honda cao cấp'
    },
    {
      name: 'Honda Plus',
      href: '/premium',
      icon: '👑',
      description: 'Dịch vụ VIP',
      isSpecial: true
    },
    {
      name: 'Về chúng tôi',
      href: '/about',
      icon: '🏢',
      description: 'Câu chuyện thương hiệu'
    },
    {
      name: 'Liên hệ',
      href: '/contact',
      icon: '📞',
      description: 'Tư vấn 24/7'
    },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/cars?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100 sticky top-0 z-50">
      {/* Top bar - Honda Plus Style */}
      <div className="gradient-primary text-white py-3 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex justify-between items-center text-sm font-medium">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>Hotline: 1900-1234</span>
              </div>
              <div className="hidden sm:flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>info@hondashop.vn</span>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
              <span className="font-semibold">Honda Plus - Showroom chính hãng</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main header - Honda Plus */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo - Honda Plus */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                  <span className="text-white font-black text-2xl">H</span>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                    <Sparkles className="h-2 w-2 text-yellow-800" />
                  </div>
                </div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-2xl font-black text-gray-900 group-hover:text-red-600 transition-colors">
                  Honda <span className="text-gradient">Plus</span>
                </h1>
                <p className="text-xs text-gray-600 font-medium tracking-wide">
                  PREMIUM • AUTHENTIC • EXCELLENCE
                </p>
              </div>
            </Link>
          </div>

          {/* Search bar - Honda Plus Desktop */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Tìm kiếm xe Honda Plus..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-24 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-red-500/20 focus:border-red-500 focus:bg-white transition-all duration-300 text-gray-900 placeholder-gray-500 font-medium shadow-inner"
                />
                <Search className="absolute left-4 top-4 h-6 w-6 text-gray-400 group-focus-within:text-red-500 transition-colors" />
                <Button
                  type="submit"
                  size="sm"
                  className="absolute right-2 top-2 h-10 px-6 rounded-xl gradient-primary hover:shadow-lg transition-all duration-300 font-semibold"
                >
                  Tìm kiếm
                </Button>
              </div>
            </form>
          </div>

          {/* Navigation - Honda Plus Desktop */}
          <nav className="hidden lg:flex space-x-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-300 relative overflow-hidden group',
                  pathname === item.href
                    ? 'text-white bg-red-600 shadow-lg'
                    : 'text-gray-700 hover:text-red-600 hover:bg-red-50'
                )}
              >
                <span className="relative z-10">{item.name}</span>
                {pathname === item.href && (
                  <div className="absolute inset-0 gradient-primary"></div>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            ))}
          </nav>

          {/* Right side buttons - Honda Plus */}
          <div className="flex items-center space-x-3">
            {/* Cart - Honda Plus */}
            <Link href="/cart" className="relative group">
              <div className="p-3 rounded-xl bg-gray-100 group-hover:bg-red-50 transition-all duration-300 group-hover:scale-110">
                <ShoppingCart className="h-6 w-6 text-gray-700 group-hover:text-red-600 transition-colors" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 gradient-primary text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center shadow-lg animate-pulse">
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </div>
            </Link>

            {/* Contact button - Honda Plus */}
            <Button size="sm" className="hidden lg:flex gradient-primary hover:shadow-lg btn-hover-lift font-semibold px-6 py-3 rounded-xl">
              <Phone className="h-4 w-4 mr-2" />
              Liên hệ ngay
            </Button>

            {/* Mobile menu button - Honda Plus */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-3 rounded-xl bg-gray-100 hover:bg-red-50 text-gray-700 hover:text-red-600 transition-all duration-300"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile search */}
        <div className="md:hidden pb-4">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm xe Honda..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-20 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <Button
                type="submit"
                size="sm"
                className="absolute right-1 top-1 h-8"
              >
                Tìm
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-2 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'block px-3 py-2 text-base font-medium rounded-md transition-colors',
                  pathname === item.href
                    ? 'text-red-600 bg-red-50'
                    : 'text-gray-700 hover:text-red-600 hover:bg-gray-50'
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-2 border-t border-gray-200">
              <Button className="w-full justify-center">
                <Phone className="h-4 w-4 mr-2" />
                Liên hệ ngay
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
