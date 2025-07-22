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
  
  const { login, error, loading, clearError } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      return;
    }

    try {
      await login(email, password);
      router.push(decodeURIComponent(callbackUrl));
    } catch (err: any) {
      console.error('Login error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4">
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

            {/* Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link href="/forgot-password" className="text-red-600 hover:text-red-500">
                  Quên mật khẩu?
                </Link>
              </div>
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

        {/* Test Credentials */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-medium text-yellow-800 mb-2">Test Credentials:</h3>
          <div className="text-sm text-yellow-700 space-y-1">
            <p><strong>Email:</strong> vphamquang539@gmail.com</p>
            <p><strong>Password:</strong> 123456</p>
          </div>
        </div>
      </div>
    </div>
  );
}