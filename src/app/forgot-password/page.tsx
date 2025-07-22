'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, CheckCircle, AlertCircle } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // TODO: Implement forgot password API call
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
      } else {
        setError(data.error || 'Có lỗi xảy ra. Vui lòng thử lại.');
      }
    } catch (err) {
      setError('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Back to Login */}
          <div className="flex items-center">
            <Link 
              href="/login" 
              className="flex items-center text-gray-600 hover:text-red-600 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại đăng nhập
            </Link>
          </div>

          {/* Success Message */}
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Email đã được gửi!
            </h2>
            
            <p className="text-gray-600 mb-6">
              Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến email{' '}
              <span className="font-medium text-gray-900">{email}</span>
            </p>
            
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                Không nhận được email? Kiểm tra thư mục spam hoặc thử lại sau 5 phút.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSuccess(false);
                    setEmail('');
                  }}
                  className="flex-1"
                >
                  Gửi lại email
                </Button>
                <Link href="/login" className="flex-1">
                  <Button className="w-full gradient-primary">
                    Quay lại đăng nhập
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Back to Login */}
        <div className="flex items-center">
          <Link 
            href="/login" 
            className="flex items-center text-gray-600 hover:text-red-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại đăng nhập
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
            Quên mật khẩu?
          </h2>
          <p className="text-gray-600">
            Nhập email của bạn và chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu
          </p>
        </div>

        {/* Forgot Password Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
              <button 
                onClick={() => setError('')}
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
                  placeholder="Nhập email đã đăng ký"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            
            {/* Submit Button */}
            <div>
              <Button
                type="submit"
                className="w-full gradient-primary py-3 text-lg font-semibold"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                    Đang gửi...
                  </div>
                ) : (
                  'Gửi hướng dẫn đặt lại mật khẩu'
                )}
              </Button>
            </div>
          </form>
          
          {/* Help Text */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Nhớ lại mật khẩu?{' '}
              <Link href="/login" className="text-red-600 hover:text-red-500 font-medium">
                Đăng nhập ngay
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500">
          <p>
            Cần hỗ trợ? Liên hệ{' '}
            <Link href="/contact" className="text-red-600 hover:underline">
              Bộ phận chăm sóc khách hàng
            </Link>{' '}
            của Honda Plus
          </p>
        </div>
      </div>
    </div>
  );
}