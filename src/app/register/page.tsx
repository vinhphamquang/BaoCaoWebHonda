'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
    },
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  
  const { register, error, loading, clearError } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      
      // Thêm log để debug
      console.log('Updating nested field:', { parent, child, value });
      console.log('Current formData:', formData);
      
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent as keyof typeof formData] as Record<string, string>,
          [child]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
    
    // Log sau khi cập nhật
    setTimeout(() => console.log('Updated formData:', formData), 0);
  };

  const validateStep1 = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      return false;
    }
    if (formData.password.length < 6) {
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    // Thêm log để debug
    console.log('Validating step 2 with formData:', formData);
    
    if (!formData.phone) {
      console.log('Validation failed: Missing phone');
      return false;
    }
    
    if (!formData.address.street) {
      console.log('Validation failed: Missing street');
      return false;
    }
    
    if (!formData.address.city) {
      console.log('Validation failed: Missing city');
      return false;
    }
    
    if (!formData.address.state) {
      console.log('Validation failed: Missing state');
      return false;
    }
    
    if (!formData.address.zipCode) {
      console.log('Validation failed: Missing zipCode');
      return false;
    }
    
    console.log('Validation passed for step 2');
    return true;
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
      console.log('Form validation failed');
      return;
    }
    
    // Loại bỏ confirmPassword khỏi dữ liệu gửi đi
    const { confirmPassword, ...registerData } = formData;
    
    // Ghi log dữ liệu form để debug
    console.log('Form data being submitted:', registerData);
    
    try {
      console.log('Calling register function...');
      await register(registerData);
      console.log('Registration successful, redirecting...');
      // Chuyển hướng về trang chủ sau khi đăng ký thành công
      router.push('/');
    } catch (err) {
      // Ghi log lỗi để debug
      console.error('Registration error caught in handleSubmit:', err);
      // Lỗi sẽ được xử lý trong hàm register và hiển thị qua state error
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-8">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Đăng ký tài khoản</h2>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
              <span className="block sm:inline">{error}</span>
              <button 
                className="float-right font-bold"
                onClick={clearError}
              >
                &times;
              </button>
            </div>
          )}
          
          <div className="mb-8">
            <div className="flex items-center">
              <div className={`flex-1 border-t-2 ${step >= 1 ? 'border-blue-500' : 'border-gray-300'}`}></div>
              <div className={`w-10 h-10 flex items-center justify-center rounded-full ${step >= 1 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'} mx-2`}>
                1
              </div>
              <div className={`flex-1 border-t-2 ${step >= 2 ? 'border-blue-500' : 'border-gray-300'}`}></div>
              <div className={`w-10 h-10 flex items-center justify-center rounded-full ${step >= 2 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'} mx-2`}>
                2
              </div>
              <div className="flex-1 border-t-2 border-gray-300"></div>
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-sm font-medium text-gray-700">Thông tin tài khoản</span>
              <span className="text-sm font-medium text-gray-700">Thông tin cá nhân</span>
            </div>
          </div>
          
          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-gray-700 text-sm font-medium mb-2">Họ và tên</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập họ và tên của bạn"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập email của bạn"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-2">Mật khẩu</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nhập mật khẩu (ít nhất 6 ký tự)"
                      value={formData.password}
                      onChange={handleChange}
                      minLength={6}
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-medium mb-2">Xác nhận mật khẩu</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập lại mật khẩu"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">Mật khẩu không khớp</p>
                  )}
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200"
                    onClick={nextStep}
                    disabled={!validateStep1()}
                  >
                    Tiếp theo
                  </button>
                </div>
              </div>
            )}
            
            {step === 2 && (
              <div>
                <div className="mb-4">
                  <label htmlFor="phone" className="block text-gray-700 text-sm font-medium mb-2">Số điện thoại</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập số điện thoại của bạn"
                    value={formData.phone}
                    onChange={handleChange}
                    pattern="[0-9]{10,11}"
                    title="Số điện thoại phải có 10-11 chữ số"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="street" className="block text-gray-700 text-sm font-medium mb-2">Địa chỉ đường</label>
                  <input
                    type="text"
                    id="street"
                    name="address.street"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập địa chỉ đường"
                    value={formData.address.street}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="mb-4">
                    <label htmlFor="city" className="block text-gray-700 text-sm font-medium mb-2">Thành phố</label>
                    <input
                      type="text"
                      id="city"
                      name="address.city"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nhập thành phố"
                      value={formData.address.city}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="state" className="block text-gray-700 text-sm font-medium mb-2">Tỉnh/Thành phố</label>
                    <input
                      type="text"
                      id="state"
                      name="address.state"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nhập tỉnh/thành phố"
                      value={formData.address.state}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="zipCode" className="block text-gray-700 text-sm font-medium mb-2">Mã bưu điện</label>
                  <input
                    type="text"
                    id="zipCode"
                    name="address.zipCode"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập mã bưu điện"
                    value={formData.address.zipCode}
                    onChange={handleChange}
                    pattern="[0-9]{5,6}"
                    title="Mã bưu điện phải có 5-6 chữ số"
                    required
                  />
                </div>
                
                <div className="flex justify-between">
                  <button
                    type="button"
                    className="bg-gray-300 text-gray-700 py-2 px-6 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition duration-200"
                    onClick={prevStep}
                  >
                    Quay lại
                  </button>
                  
                  <button
                    type="submit"
                    className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200"
                    disabled={loading || !validateStep2()}
                  >
                    {loading ? 'Đang xử lý...' : 'Đăng ký'}
                  </button>
                </div>
              </div>
            )}
          </form>
          
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Đã có tài khoản?{' '}
              <Link href="/login" className="text-blue-600 hover:underline">
                Đăng nhập
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}