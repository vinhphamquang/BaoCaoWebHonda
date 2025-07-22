import React from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, Facebook, Youtube, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-900/10 to-blue-900/10"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500"></div>

      {/* Main footer content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company info - Honda Plus */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 gradient-yellow-black rounded-xl flex items-center justify-center shadow-2xl">
                  <span className="text-black font-black text-2xl">H</span>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                  <span className="text-xs">+</span>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-black">Honda <span className="text-gradient">Plus</span></h3>
                <p className="text-sm text-gray-300 font-medium tracking-wide">PREMIUM • AUTHENTIC • EXCELLENCE</p>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Đại lý Honda Plus chính hãng với hơn 15 năm kinh nghiệm trong ngành ô tô cao cấp.
              Chúng tôi cam kết mang đến trải nghiệm mua xe Honda đẳng cấp thế giới với
              dịch vụ chăm sóc khách hàng 5 sao.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="group p-3 bg-white/10 rounded-xl hover:bg-amber-600 transition-all duration-300 hover:scale-110">
                <Facebook className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
              </a>
              <a href="#" className="group p-3 bg-white/10 rounded-xl hover:bg-amber-600 transition-all duration-300 hover:scale-110">
                <Youtube className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
              </a>
              <a href="#" className="group p-3 bg-white/10 rounded-xl hover:bg-amber-600 transition-all duration-300 hover:scale-110">
                <Instagram className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Liên kết nhanh</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link href="/cars" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Xe Honda
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Liên hệ
                </Link>
              </li>
              <li>
                <Link href="/warranty" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Bảo hành
                </Link>
              </li>
              <li>
                <Link href="/service" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Dịch vụ
                </Link>
              </li>
            </ul>
          </div>

          {/* Car models */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Dòng xe Honda</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/cars?model=civic" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Honda Civic
                </Link>
              </li>
              <li>
                <Link href="/cars?model=accord" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Honda Accord
                </Link>
              </li>
              <li>
                <Link href="/cars?model=cr-v" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Honda CR-V
                </Link>
              </li>
              <li>
                <Link href="/cars?model=city" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Honda City
                </Link>
              </li>
              <li>
                <Link href="/cars?model=hr-v" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Honda HR-V
                </Link>
              </li>
              <li>
                <Link href="/cars?model=pilot" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Honda Pilot
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Thông tin liên hệ</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-300">
                    123 Đường Nguyễn Văn Linh<br />
                    Quận 7, TP. Hồ Chí Minh
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-red-500 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-300">Hotline: 1900-1234</p>
                  <p className="text-sm text-gray-300">Zalo: 0901-234-567</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-red-500 flex-shrink-0" />
                <p className="text-sm text-gray-300">info@hondashop.vn</p>
              </div>
            </div>
            <div className="pt-2">
              <p className="text-sm text-gray-400">
                <strong>Giờ làm việc:</strong><br />
                Thứ 2 - Chủ nhật: 8:00 - 18:00
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <p className="text-sm text-gray-400">
              © {currentYear} Honda Shop. Tất cả quyền được bảo lưu.
            </p>
            <div className="flex space-x-6 text-sm text-gray-400">
              <Link href="/privacy" className="hover:text-white transition-colors">
                Chính sách bảo mật
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                Điều khoản sử dụng
              </Link>
              <Link href="/sitemap" className="hover:text-white transition-colors">
                Sơ đồ trang web
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
