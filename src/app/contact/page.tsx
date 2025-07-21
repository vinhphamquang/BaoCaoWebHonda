'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle } from 'lucide-react';

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ContactForm>();

  const onSubmit = async (data: ContactForm) => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('Contact form submission:', data);
    setIsSubmitted(true);
    setIsSubmitting(false);
    reset();
    
    // Reset success message after 3 seconds
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  const showrooms = [
    {
      name: 'Showroom Hà Nội',
      address: 'Số 7, Đường Bằng Lăng 1, Khu đô thị Vinhomes Riverside, Long Biên, Hà Nội',
      phone: '024 3974 9999',
      email: 'hanoi@vinfast.vn',
      hours: 'T2-CN: 8:00 - 18:00'
    },
    {
      name: 'Showroom TP.HCM',
      address: '123 Đường Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh',
      phone: '028 3825 9999',
      email: 'hcm@vinfast.vn',
      hours: 'T2-CN: 8:00 - 18:00'
    },
    {
      name: 'Showroom Đà Nẵng',
      address: '456 Đường Trần Phú, Quận Hải Châu, Đà Nẵng',
      phone: '0236 3888 999',
      email: 'danang@vinfast.vn',
      hours: 'T2-CN: 8:00 - 18:00'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Liên hệ với chúng tôi
          </h1>
          <p className="text-lg text-gray-600">
            Chúng tôi luôn sẵn sàng hỗ trợ và tư vấn cho bạn
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <MessageCircle className="h-5 w-5 mr-2 text-blue-500" />
              Gửi tin nhắn cho chúng tôi
            </h2>
            
            {isSubmitted && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 font-medium">
                  Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong vòng 24h.
                </p>
              </div>
            )}
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                  Chủ đề *
                </label>
                <select
                  {...register('subject', { required: 'Vui lòng chọn chủ đề' })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">-- Chọn chủ đề --</option>
                  <option value="product-inquiry">Tư vấn sản phẩm</option>
                  <option value="test-drive">Đăng ký lái thử</option>
                  <option value="purchase">Mua xe</option>
                  <option value="service">Dịch vụ sau bán hàng</option>
                  <option value="warranty">Bảo hành</option>
                  <option value="other">Khác</option>
                </select>
                {errors.subject && (
                  <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nội dung tin nhắn *
                </label>
                <textarea
                  {...register('message', { required: 'Vui lòng nhập nội dung' })}
                  rows={5}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập nội dung tin nhắn của bạn..."
                />
                {errors.message && (
                  <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-900 text-white py-3 px-6 rounded-lg hover:bg-blue-800 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  'Đang gửi...'
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Gửi tin nhắn
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Quick Contact */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Thông tin liên hệ nhanh</h3>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-blue-500 mr-3" />
                  <div>
                    <p className="font-medium">Hotline</p>
                    <p className="text-blue-600">1900 23 23 89</p>
                    <p className="text-sm text-gray-500">24/7 - Miễn phí</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-green-500 mr-3" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-green-600">info@vinfast.vn</p>
                    <p className="text-sm text-gray-500">Phản hồi trong 24h</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-purple-500 mr-3" />
                  <div>
                    <p className="font-medium">Giờ làm việc</p>
                    <p className="text-purple-600">T2-CN: 8:00 - 18:00</p>
                    <p className="text-sm text-gray-500">Tất cả các ngày trong tuần</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Showrooms */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Hệ thống showroom</h3>
              
              <div className="space-y-6">
                {showrooms.map((showroom, index) => (
                  <div key={index} className="border-b border-gray-200 last:border-b-0 pb-4 last:pb-0">
                    <h4 className="font-medium text-gray-900 mb-2">{showroom.name}</h4>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start">
                        <MapPin className="h-4 w-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">{showroom.address}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 text-blue-500 mr-2" />
                        <span className="text-gray-600">{showroom.phone}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 text-green-500 mr-2" />
                        <span className="text-gray-600">{showroom.email}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-purple-500 mr-2" />
                        <span className="text-gray-600">{showroom.hours}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">
                Câu hỏi thường gặp
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-medium text-blue-800">Làm thế nào để đặt lịch lái thử?</p>
                  <p className="text-blue-700">Bạn có thể đăng ký trực tuyến hoặc gọi hotline 1900 23 23 89</p>
                </div>
                <div>
                  <p className="font-medium text-blue-800">Thời gian bảo hành xe là bao lâu?</p>
                  <p className="text-blue-700">VinFast bảo hành 10 năm hoặc 200.000km cho xe điện</p>
                </div>
                <div>
                  <p className="font-medium text-blue-800">Có hỗ trợ trả góp không?</p>
                  <p className="text-blue-700">Có, chúng tôi hỗ trợ vay vốn với lãi suất ưu đãi</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
