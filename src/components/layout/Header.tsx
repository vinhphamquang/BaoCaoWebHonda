'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, Phone, Mail, Sparkles, ArrowRight, User, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, loading } = useAuth();

  // Prevent hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const navigation = [
    { name: 'Trang chủ', href: '/' },
    { name: 'Xe Honda', href: '/cars' },
    { name: 'API Docs', href: '/api/docs' },
    { name: 'Giới thiệu', href: '/about' },
    { name: 'Liên hệ', href: '/contact' },
  ];

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100 sticky top-0 z-50">
      {/* Top bar - Honda Plus Style */}
      <div className="gradient-yellow-black text-black py-3 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
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
                <div className="w-12 h-12 gradient-yellow-black rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                  <span className="text-black font-black text-2xl">H</span>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                    <Sparkles className="h-2 w-2 text-yellow-800" />
                  </div>
                </div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-2xl font-black text-gray-900 group-hover:text-amber-600 transition-colors">
                  Honda <span className="text-gradient">Plus</span>
                </h1>
                <p className="text-xs text-gray-700 font-medium tracking-wide">
                  PREMIUM • AUTHENTIC • EXCELLENCE
                </p>
              </div>
            </Link>
          </div>

          {/* Logo spacer */}
          <div className="hidden md:block flex-1 max-w-2xl mx-8"></div>

          {/* Navigation - Honda Plus Desktop */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'px-3 py-2 text-xs font-medium rounded-md transition-colors duration-200',
                  item.isSpecial
                    ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-500'
                    : pathname === item.href
                      ? 'text-white bg-red-600'
                      : 'text-gray-600 hover:text-red-600 hover:bg-gray-100'
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right side buttons - Honda Plus */}
          <div className="flex items-center space-x-3">


            {/* Auth buttons or User menu */}
            {!mounted || loading ? (
              <div className="hidden md:flex items-center space-x-2">
                <div className="border border-gray-200 bg-gray-100 px-4 py-2 text-sm font-medium rounded-md animate-pulse">
                  <div className="w-16 h-4 bg-gray-200 rounded"></div>
                </div>
                <div className="bg-gray-200 px-4 py-2 text-sm font-medium rounded-md animate-pulse">
                  <div className="w-12 h-4 bg-gray-300 rounded"></div>
                </div>
              </div>
            ) : user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white">
                    <span className="text-sm font-bold">{user.name.charAt(0)}</span>
                  </div>
                  <span className="hidden md:block text-sm font-medium">{user.name.split(' ')[0]}</span>
                </button>

                {/* User dropdown menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-200">
                    <Link
                      href="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Tài khoản của tôi
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsUserMenuOpen(false);
                        router.push('/');
                      }}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Link href="/login" className="border border-red-200 hover:border-red-500 bg-transparent text-gray-700 hover:bg-red-50 px-4 py-2 text-sm font-medium rounded-md transition-colors">
                  Đăng nhập
                </Link>
                <Link href="/register" className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 text-sm font-medium rounded-md transition-colors">
                  Đăng ký
                </Link>
              </div>
            )}

            {/* Mobile menu button - Honda Plus */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-3 rounded-xl bg-gray-100 hover:bg-red-50 text-gray-700 hover:text-red-600 transition-all duration-300"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* No mobile search */}
      </div>

      {/* Mobile menu - Honda Plus */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-2xl z-40">
          <div className="max-w-7xl mx-auto px-4 py-6">
            {/* Mobile Navigation Items */}
            <div className="space-y-3 mb-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center px-4 py-4 text-base font-semibold rounded-2xl transition-all duration-300 group',
                    item.isSpecial
                      ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-gray-900 shadow-lg'
                      : pathname === item.href
                        ? 'text-white bg-gradient-to-r from-red-600 to-red-700 shadow-lg'
                        : 'text-gray-700 hover:text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100'
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="font-semibold">{item.name}</span>
                  <ArrowRight className="h-5 w-5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 ml-auto" />
                </Link>
              ))}
            </div>

            {/* Mobile CTA Section */}
            <div className="border-t border-gray-200 pt-6 space-y-4">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white">
                      <span className="text-sm font-bold">{user.name.charAt(0)}</span>
                    </div>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Link href="/profile">
                      <button className="w-full border-2 border-red-200 hover:border-red-500 bg-transparent text-gray-700 hover:bg-red-50 font-semibold py-3 rounded-xl transition-colors flex items-center justify-center">
                        <User className="h-4 w-4 mr-2" />
                        Tài khoản
                      </button>
                    </Link>
                    <button 
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center"
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                        router.push('/');
                      }}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Đăng xuất
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                    <button className="w-full border-2 border-red-200 hover:border-red-500 bg-transparent text-gray-700 hover:bg-red-50 font-semibold py-3 rounded-xl transition-colors">
                      Đăng nhập
                    </button>
                  </Link>
                  <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                    <button className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl transition-colors">
                      Đăng ký
                    </button>
                  </Link>
                </div>
              )}

              {/* Mobile Quick Stats */}
              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-red-600">15+</div>
                  <div className="text-xs text-gray-600">Năm kinh nghiệm</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-red-600">10K+</div>
                  <div className="text-xs text-gray-600">Khách hàng VIP</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-red-600">100%</div>
                  <div className="text-xs text-gray-600">Chính hãng</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
