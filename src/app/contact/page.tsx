'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || 
        !formData.subject.trim() || !formData.message.trim()) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
      } else {
        setError(data.message || 'Có lỗi xảy ra khi gửi tin nhắn');
      }
    } catch (error) {
      setError('Lỗi kết nối. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // Success screen
  if (success) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <div className="text-green-600 text-2xl">✓</div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Gửi tin nhắn thành công!
          </h2>
          
          <p className="text-gray-600 mb-6">
            Cảm ơn bạn đã liên hệ với Honda Plus. Chúng tôi sẽ phản hồi sớm nhất.
          </p>
          
          <div className="space-y-3">
            <button 
              onClick={() => setSuccess(false)}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
            >
              Gửi tin nhắn khác
            </button>
            <Link 
              href="/"
              className="block w-full border border-gray-300 text-gray-700 hover:bg-gray-50 py-3 px-4 rounded-lg font-medium transition-colors text-center"
            >
              Về trang chủ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <div className="mb-8">
          <Link 
            href="/" 
            className="text-gray-600 hover:text-red-600 transition-colors"
          >
            ← Về trang chủ
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-xl">
              HONDA
            </div>
            <span className="ml-2 text-2xl font-bold text-gray-900">Plus</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Liên hệ với chúng tôi
          </h1>
          <p className="text-gray-600">
            Chúng tôi luôn sẵn sàng hỗ trợ và tư vấn cho bạn
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Gửi tin nhắn cho chúng tôi</h2>

            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 text-sm">⚠️ {error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Họ và tên *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Nhập họ và tên"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số điện thoại *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Nhập số điện thoại"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Nhập địa chỉ email"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chủ đề *
                </label>
                <select 
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                >
                  <option value="">Chọn chủ đề</option>
                  <option value="Tư vấn mua xe">Tư vấn mua xe</option>
                  <option value="Đặt lịch lái thử">Đặt lịch lái thử</option>
                  <option value="Bảo hành và bảo dưỡng">Bảo hành và bảo dưỡng</option>
                  <option value="Phụ tùng và phụ kiện">Phụ tùng và phụ kiện</option>
                  <option value="Khiếu nại">Khiếu nại</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nội dung tin nhắn *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Nhập nội dung tin nhắn của bạn..."
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Đang gửi...
                  </>
                ) : (
                  'Gửi tin nhắn'
                )}
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">📍 Địa chỉ showroom</h3>
              <div className="text-gray-600 space-y-1">
                <p>123 Đường Nguyễn Văn Linh</p>
                <p>Quận 7, TP. Hồ Chí Minh</p>
                <p>Việt Nam</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">📞 Điện thoại</h3>
              <div className="text-gray-600 space-y-1">
                <p>Hotline: 1900-1234</p>
                <p>Zalo: 0901-234-567</p>
                <p>Viber: 0901-234-567</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">📧 Email</h3>
              <div className="text-gray-600 space-y-1">
                <p>info@hondashop.vn</p>
                <p>sales@hondashop.vn</p>
                <p>support@hondashop.vn</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🕒 Giờ làm việc</h3>
              <div className="text-gray-600 space-y-1">
                <p>Thứ 2 - Thứ 6: 8:00 - 18:00</p>
                <p>Thứ 7 - Chủ nhật: 8:00 - 17:00</p>
                <p>Lễ tết: 9:00 - 16:00</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}