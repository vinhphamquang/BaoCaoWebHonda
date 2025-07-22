'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

import { Eye, EyeOff, Mail, Lock, ArrowLeft, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  const { login, error, loading, clearError } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  // Clear error when component mounts or when user starts typing
  useEffect(() => {
    clearError();
  }, [clearError]);

  useEffect(() => {
    if (email || password) {
      clearError();
    }
  }, [email, password, clearError]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    console.log('🔄 Form submitted');
    console.log('Email:', email);
    console.log('Password length:', password.length);
    
    // Validation cơ bản
    if (!email.trim() || !password.trim()) {
      console.log('❌ Validation failed - empty fields');
      return;
    }

    try {
      console.log('🔄 Attempting login with:', { email, password: '***' });
      await login(email, password);
      console.log('✅ Login successful, redirecting to:', decodeURIComponent(callbackUrl));
      // Đăng nhập thành công - chuyển hướng ngay lập tức
      router.push(decodeURIComponent(callbackUrl));
    } catch (err: any) {
      // Lỗi sẽ được xử lý trong hàm login và hiển thị qua state error
      console.error('❌ Login error:', err);
      console.error('❌ Error message:', err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Back to Home */}
        <div className="flex items-center">
          <Link 
            href="/" 
            className="flex items-center text-gray-600 hover:text-red-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Về trang chủ
          </Link>
        </div>

        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-block">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-xl">
                HONDA
              </div>
              <span className="ml-2 text-2xl font-bold text-gray-900">Plus</span>
            </div>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Chào mừng trở lại
          </h2>
          <p className="text-gray-600">
            Đăng nhập để truy cập tài khoản Honda Plus của bạn
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
              <button 
                onClick={clearError}
                className="text-red-500 hover:text-red-700 ml-2"
              >
                <span className="sr-only">Đóng</span>
                ×
              </button>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Địa chỉ email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                  placeholder="Nhập email của bạn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            
            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                  placeholder="Nhập mật khẩu của bạn"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Ghi nhớ đăng nhập
              </label>
            </div>
            
            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 text-lg font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                    Đang xử lý...
                  </div>
                ) : (
                  'Đăng nhập'
                )}
              </button>
            </div>
          </form>
          

          
          {/* Sign Up Link */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Chưa có tài khoản?{' '}
              <Link href="/register" className="text-red-600 hover:text-red-500 font-medium">
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500">
          <p>
            Bằng việc đăng nhập, bạn đồng ý với{' '}
            <Link href="/terms" className="text-red-600 hover:underline">
              Điều khoản sử dụng
            </Link>{' '}
            và{' '}
            <Link href="/privacy" className="text-red-600 hover:underline">
              Chính sách bảo mật
            </Link>{' '}
            của Honda Plus
          </p>
        </div>
      </div>
    </div>
  );
}