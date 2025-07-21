'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '@/stores/useAuthStore';
import { Eye, EyeOff, Mail, Lock, User, Phone, MapPin, UserPlus } from 'lucide-react';

interface RegisterForm {
  name: string;
  email: string;
  phone: string;
  address: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
}

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [registerError, setRegisterError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<RegisterForm>();

  const password = watch('password');

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    setRegisterError('');

    try {
      const { confirmPassword, agreeTerms, ...userData } = data;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const _unused = { confirmPassword, agreeTerms };
      
      const success = await registerUser(userData);
      
      if (success) {
        router.push('/');
      } else {
        setRegisterError('Email đã được sử dụng');
      }
    } catch {
      setRegisterError('Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="bg-blue-900 text-white px-6 py-3 rounded-lg font-bold text-2xl inline-block mb-4">
            VinFast
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            Tạo tài khoản mới
          </h2>
          <p className="mt-2 text-gray-600">
            Tham gia cộng đồng VinFast ngay hôm nay
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          {registerError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{registerError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="inline h-4 w-4 mr-1" />
                Họ và tên *
              </label>
              <input
                type="text"
                {...register('name', { required: 'Vui lòng nhập họ tên' })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nguyễn Văn A"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="inline h-4 w-4 mr-1" />
                Địa chỉ
              </label>
              <input
                type="text"
                {...register('address')}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nhập địa chỉ của bạn"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Lock className="inline h-4 w-4 mr-1" />
                Mật khẩu *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', { 
                    required: 'Vui lòng nhập mật khẩu',
                    minLength: {
                      value: 6,
                      message: 'Mật khẩu phải có ít nhất 6 ký tự'
                    }
                  })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                  placeholder="Nhập mật khẩu"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Lock className="inline h-4 w-4 mr-1" />
                Xác nhận mật khẩu *
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  {...register('confirmPassword', { 
                    required: 'Vui lòng xác nhận mật khẩu',
                    validate: value => value === password || 'Mật khẩu không khớp'
                  })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                  placeholder="Nhập lại mật khẩu"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>

            <div className="flex items-start">
              <input
                id="agree-terms"
                type="checkbox"
                {...register('agreeTerms', { required: 'Vui lòng đồng ý với điều khoản' })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
              />
              <label htmlFor="agree-terms" className="ml-2 block text-sm text-gray-700">
                Tôi đồng ý với{' '}
                <Link href="/terms" className="text-blue-600 hover:text-blue-800">
                  Điều khoản sử dụng
                </Link>{' '}
                và{' '}
                <Link href="/privacy" className="text-blue-600 hover:text-blue-800">
                  Chính sách bảo mật
                </Link>
              </label>
            </div>
            {errors.agreeTerms && (
              <p className="text-sm text-red-600">{errors.agreeTerms.message}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-900 text-white py-3 px-6 rounded-lg hover:bg-blue-800 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                'Đang tạo tài khoản...'
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Tạo tài khoản
                </>
              )}
            </button>
          </form>

          {/* Sign in link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Đã có tài khoản?{' '}
              <Link href="/auth/login" className="text-blue-600 hover:text-blue-800 font-medium">
                Đăng nhập ngay
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
