'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowLeft, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    }
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  const { register, error, loading, clearError } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    if (error) clearError();
  };

  const validateStep1 = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Vui lòng nhập họ tên';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Vui lòng nhập email';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email không hợp lệ';
    }
    
    if (!formData.password) {
      errors.password = 'Vui lòng nhập mật khẩu';
    } else if (formData.password.length < 6) {
      errors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep2 = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.phone.trim()) {
      errors.phone = 'Vui lòng nhập số điện thoại';
    }
    
    if (!formData.address.street.trim()) {
      errors['address.street'] = 'Vui lòng nhập địa chỉ';
    }
    
    if (!formData.address.city.trim()) {
      errors['address.city'] = 'Vui lòng nhập thành phố';
    }
    
    if (!formData.address.state.trim()) {
      errors['address.state'] = 'Vui lòng nhập tỉnh/thành';
    }
    
    if (!formData.address.zipCode.trim()) {
      errors['address.zipCode'] = 'Vui lòng nhập mã bưu điện';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const nextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const prevStep = () => {
    if (step === 2) {
      setStep(1);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateStep2()) {
      return;
    }
    
    try {
      const { confirmPassword, address, ...registerData } = formData;
      
      // Convert address object to string
      const addressString = `${address.street}, ${address.city}, ${address.state} ${address.zipCode}`;
      
      const finalData = {
        ...registerData,
        address: addressString
      };
      
      await register(finalData);
      router.push('/login?message=registration-success');
    } catch (err: any) {
      console.error('Registration error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
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
            Tạo tài khoản mới
          </h2>
          <p className="text-gray-600">
            Đăng ký để trải nghiệm dịch vụ Honda Plus
          </p>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-8">
            <div className="flex items-center">
              <div className={`flex-1 border-t-2 ${step >= 1 ? 'border-red-500' : 'border-gray-300'}`}></div>
              <div className={`w-10 h-10 flex items-center justify-center rounded-full ${step >= 1 ? 'bg-red-600 text-white' : 'bg-gray-300 text-gray-700'} mx-2 font-semibold`}>
                1
              </div>
              <div className={`flex-1 border-t-2 ${step >= 2 ? 'border-red-500' : 'border-gray-300'}`}></div>
              <div className={`w-10 h-10 flex items-center justify-center rounded-full ${step >= 2 ? 'bg-red-600 text-white' : 'bg-gray-300 text-gray-700'} mx-2 font-semibold`}>
                2
              </div>
              <div className="flex-1 border-t-2 border-gray-300"></div>
            </div>
            <div className="flex justify-between mt-3">
              <span className="text-sm font-medium text-gray-700">Thông tin cơ bản</span>
              <span className="text-sm font-medium text-gray-700">Thông tin liên hệ</span>
            </div>
          </div>

          {/* Error Message */}
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

          <form onSubmit={handleSubmit}>
            {/* Step 1: Basic Information */}
            {step === 1 && (
              <div className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Họ và tên *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Nhập họ và tên của bạn"
                      required
                    />
                  </div>
                  {formErrors.name && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Nhập email của bạn"
                      required
                    />
                  </div>
                  {formErrors.email && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mật khẩu *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Nhập mật khẩu (ít nhất 6 ký tự)"
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
                  {formErrors.password && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Xác nhận mật khẩu *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Nhập lại mật khẩu"
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                  {formErrors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.confirmPassword}</p>
                  )}
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="button"
                    onClick={nextStep}
                    className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-lg font-semibold rounded-lg transition-colors"
                  >
                    Tiếp theo
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Contact Information */}
            {step === 2 && (
              <div className="space-y-6">
                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số điện thoại *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Nhập số điện thoại"
                      required
                    />
                  </div>
                  {formErrors.phone && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>
                  )}
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Địa chỉ *
                  </label>
                  <input
                    type="text"
                    name="address.street"
                    value={formData.address.street}
                    onChange={handleChange}
                    className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent mb-3"
                    placeholder="Số nhà, tên đường"
                    required
                  />
                  {formErrors['address.street'] && (
                    <p className="mt-1 text-sm text-red-600">{formErrors['address.street']}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      name="address.city"
                      value={formData.address.city}
                      onChange={handleChange}
                      className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Thành phố"
                      required
                    />
                    {formErrors['address.city'] && (
                      <p className="mt-1 text-sm text-red-600">{formErrors['address.city']}</p>
                    )}
                  </div>
                  <div>
                    <input
                      type="text"
                      name="address.state"
                      value={formData.address.state}
                      onChange={handleChange}
                      className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Tỉnh/Thành phố"
                      required
                    />
                    {formErrors['address.state'] && (
                      <p className="mt-1 text-sm text-red-600">{formErrors['address.state']}</p>
                    )}
                  </div>
                </div>

                <div>
                  <input
                    type="text"
                    name="address.zipCode"
                    value={formData.address.zipCode}
                    onChange={handleChange}
                    className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Mã bưu điện"
                    required
                  />
                  {formErrors['address.zipCode'] && (
                    <p className="mt-1 text-sm text-red-600">{formErrors['address.zipCode']}</p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 px-8 py-3 text-lg font-semibold rounded-lg transition-colors"
                  >
                    Quay lại
                  </button>
                  
                  <button
                    type="submit"
                    className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-lg font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                        Đang xử lý...
                      </div>
                    ) : (
                      'Hoàn tất đăng ký'
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Login Link */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Đã có tài khoản?{' '}
            <Link href="/login" className="text-red-600 hover:text-red-500 font-medium">
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}