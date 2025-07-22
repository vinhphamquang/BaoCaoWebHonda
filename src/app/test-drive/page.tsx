'use client';

import React, { useState } from 'react';
import { Calendar, Clock, Car, User, Phone, Mail, MapPin, Send, CalendarCheck } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { validateEmail, validatePhone } from '@/lib/utils';

const TestDrivePage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    carModel: '',
    preferredDate: '',
    preferredTime: '',
    location: '',
    message: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const carModels = [
    'Honda Civic',
    'Honda CR-V',
    'Honda Accord',
    'Honda City',
    'Honda HR-V',
    'Honda Brio',
  ];

  const timeSlots = [
    '09:00 - 10:00',
    '10:00 - 11:00',
    '11:00 - 12:00',
    '14:00 - 15:00',
    '15:00 - 16:00',
    '16:00 - 17:00',
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Xóa lỗi khi người dùng bắt đầu nhập lại
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Vui lòng nhập họ và tên';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }
    
    if (!formData.carModel) {
      newErrors.carModel = 'Vui lòng chọn mẫu xe';
    }
    
    if (!formData.preferredDate) {
      newErrors.preferredDate = 'Vui lòng chọn ngày lái thử';
    }
    
    if (!formData.preferredTime) {
      newErrors.preferredTime = 'Vui lòng chọn thời gian lái thử';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Vui lòng nhập địa điểm lái thử';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Gửi dữ liệu đến API endpoint
      const response = await fetch('/api/test-drive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Có lỗi xảy ra khi gửi thông tin');
      }
      
      setIsSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        carModel: '',
        preferredDate: '',
        preferredTime: '',
        location: '',
        message: '',
      });
    } catch (error) {
      console.error('Lỗi khi gửi form:', error);
      alert('Có lỗi xảy ra khi gửi thông tin. Vui lòng thử lại sau.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-800 text-white">
        <div className="container-honda page-padding">
          <div className="text-center">
            <h1 className="text-3xl lg:text-5xl font-bold mb-4">
              Đặt Lịch Lái Thử
            </h1>
            <p className="text-xl text-red-50 max-w-3xl mx-auto">
              Trải nghiệm cảm giác lái đẳng cấp với các mẫu xe Honda mới nhất
            </p>
          </div>
        </div>
      </div>

      <div className="container-honda page-padding">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Form đặt lịch */}
          <div className="lg:col-span-2">
            {isSuccess ? (
              <Card className="bg-white shadow-lg border-green-100 border-2">
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CalendarCheck className="h-10 w-10 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Đặt Lịch Thành Công!
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Cảm ơn bạn đã đặt lịch lái thử xe Honda. Chúng tôi đã nhận được thông tin và sẽ liên hệ với bạn trong thời gian sớm nhất để xác nhận lịch hẹn.
                  </p>
                  <Button
                    onClick={() => setIsSuccess(false)}
                    className="gradient-primary"
                    size="lg"
                  >
                    Đặt Lịch Lái Thử Khác
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-6 w-6 mr-2 text-red-600" />
                    Thông tin đặt lịch lái thử
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            onChange={handleInputChange}
                            className={`w-full pl-10 p-3 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent`}
                            placeholder="Nguyễn Văn A"
                          />
                        </div>
                        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                      </div>
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
                            onChange={handleInputChange}
                            className={`w-full pl-10 p-3 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent`}
                            placeholder="0901234567"
                          />
                        </div>
                        {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                      </div>
                    </div>

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
                          onChange={handleInputChange}
                          className={`w-full pl-10 p-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent`}
                          placeholder="example@gmail.com"
                        />
                      </div>
                      {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mẫu xe muốn lái thử *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Car className="h-5 w-5 text-gray-400" />
                        </div>
                        <select
                          name="carModel"
                          value={formData.carModel}
                          onChange={handleInputChange}
                          className={`w-full pl-10 p-3 border ${errors.carModel ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent appearance-none bg-white`}
                        >
                          <option value="">Chọn mẫu xe</option>
                          {carModels.map((model) => (
                            <option key={model} value={model}>
                              {model}
                            </option>
                          ))}
                        </select>
                      </div>
                      {errors.carModel && <p className="mt-1 text-sm text-red-600">{errors.carModel}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Ngày lái thử *
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Calendar className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="date"
                            name="preferredDate"
                            value={formData.preferredDate}
                            onChange={handleInputChange}
                            min={new Date().toISOString().split('T')[0]}
                            className={`w-full pl-10 p-3 border ${errors.preferredDate ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent`}
                          />
                        </div>
                        {errors.preferredDate && <p className="mt-1 text-sm text-red-600">{errors.preferredDate}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Thời gian *
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Clock className="h-5 w-5 text-gray-400" />
                          </div>
                          <select
                            name="preferredTime"
                            value={formData.preferredTime}
                            onChange={handleInputChange}
                            className={`w-full pl-10 p-3 border ${errors.preferredTime ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent appearance-none bg-white`}
                          >
                            <option value="">Chọn thời gian</option>
                            {timeSlots.map((slot) => (
                              <option key={slot} value={slot}>
                                {slot}
                              </option>
                            ))}
                          </select>
                        </div>
                        {errors.preferredTime && <p className="mt-1 text-sm text-red-600">{errors.preferredTime}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Địa điểm lái thử *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <MapPin className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          className={`w-full pl-10 p-3 border ${errors.location ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent`}
                          placeholder="Showroom Honda Quận 7"
                        />
                      </div>
                      {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ghi chú thêm
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="Thông tin thêm về nhu cầu lái thử của bạn..."
                      />
                    </div>

                    <div className="mt-8">
                      <Button
                        type="submit"
                        size="lg"
                        className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-opacity-50"
                        loading={isSubmitting}
                      >
                        <Send className="h-5 w-5 mr-2" />
                        {isSubmitting ? 'Đang gửi...' : 'Đặt lịch ngay'}
                      </Button>
                      <p className="text-center text-gray-500 text-sm mt-3">
                        Chúng tôi sẽ liên hệ xác nhận trong vòng 24 giờ
                      </p>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Thông tin bên phải */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin lái thử</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Calendar className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Thời gian lái thử</h3>
                    <p className="text-gray-600 text-sm">Thứ 2 - Chủ nhật: 8:00 - 17:00</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Car className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Các mẫu xe có sẵn</h3>
                    <p className="text-gray-600 text-sm">Honda Civic, CR-V, Accord, City, HR-V, Brio</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Địa điểm</h3>
                    <p className="text-gray-600 text-sm">Showroom Honda Quận 7: 123 Nguyễn Văn Linh, Q7, TP.HCM</p>
                    <p className="text-gray-600 text-sm mt-1">Showroom Honda Quận 2: 456 Mai Chí Thọ, Q2, TP.HCM</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quy trình lái thử</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-4">
                  <li className="flex items-start">
                    <span className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center mr-3 flex-shrink-0">1</span>
                    <p className="text-gray-700">Đặt lịch trực tuyến hoặc gọi điện</p>
                  </li>
                  <li className="flex items-start">
                    <span className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center mr-3 flex-shrink-0">2</span>
                    <p className="text-gray-700">Nhận xác nhận từ nhân viên tư vấn</p>
                  </li>
                  <li className="flex items-start">
                    <span className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center mr-3 flex-shrink-0">3</span>
                    <p className="text-gray-700">Đến showroom theo lịch hẹn</p>
                  </li>
                  <li className="flex items-start">
                    <span className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center mr-3 flex-shrink-0">4</span>
                    <p className="text-gray-700">Trải nghiệm lái thử xe cùng chuyên viên</p>
                  </li>
                  <li className="flex items-start">
                    <span className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center mr-3 flex-shrink-0">5</span>
                    <p className="text-gray-700">Nhận tư vấn chi tiết về sản phẩm</p>
                  </li>
                </ol>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestDrivePage;