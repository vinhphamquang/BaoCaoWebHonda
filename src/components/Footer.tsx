import Link from 'next/link';
import { MapPin, Phone, Mail, Facebook, Youtube, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-xl mb-4 inline-block">
              VinFast
            </div>
            <p className="text-gray-300 mb-4">
              Thương hiệu ô tô Việt Nam tiên phong trong lĩnh vực xe điện thông minh, 
              mang đến trải nghiệm di chuyển an toàn, tiện nghi và thân thiện với môi trường.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liên kết nhanh</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-300 hover:text-white transition-colors">
                  Sản phẩm
                </Link>
              </li>
              <li>
                <Link href="/test-drive" className="text-gray-300 hover:text-white transition-colors">
                  Đăng ký lái thử
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Liên hệ
                </Link>
              </li>
              <li>
                <Link href="/warranty" className="text-gray-300 hover:text-white transition-colors">
                  Bảo hành
                </Link>
              </li>
              <li>
                <Link href="/service" className="text-gray-300 hover:text-white transition-colors">
                  Dịch vụ
                </Link>
              </li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Sản phẩm</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products/vf3" className="text-gray-300 hover:text-white transition-colors">
                  VinFast VF 3
                </Link>
              </li>
              <li>
                <Link href="/products/vf5" className="text-gray-300 hover:text-white transition-colors">
                  VinFast VF 5
                </Link>
              </li>
              <li>
                <Link href="/products/vf6" className="text-gray-300 hover:text-white transition-colors">
                  VinFast VF 6
                </Link>
              </li>
              <li>
                <Link href="/products/vf7" className="text-gray-300 hover:text-white transition-colors">
                  VinFast VF 7
                </Link>
              </li>
              <li>
                <Link href="/products/vf8" className="text-gray-300 hover:text-white transition-colors">
                  VinFast VF 8
                </Link>
              </li>
              <li>
                <Link href="/products/vf9" className="text-gray-300 hover:text-white transition-colors">
                  VinFast VF 9
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Thông tin liên hệ</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 mr-3 mt-0.5 text-blue-400" />
                <div>
                  <p className="text-gray-300">Showroom Hà Nội</p>
                  <p className="text-sm text-gray-400">
                    Số 7, Đường Bằng Lăng 1, Khu đô thị Vinhomes Riverside, 
                    Long Biên, Hà Nội
                  </p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Phone className="h-5 w-5 mr-3 text-blue-400" />
                <div>
                  <p className="text-gray-300">1900 23 23 89</p>
                  <p className="text-sm text-gray-400">Hotline 24/7</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Mail className="h-5 w-5 mr-3 text-blue-400" />
                <div>
                  <p className="text-gray-300">info@vinfast.vn</p>
                  <p className="text-sm text-gray-400">Email hỗ trợ</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 VinFast. Tất cả quyền được bảo lưu.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                Chính sách bảo mật
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                Điều khoản sử dụng
              </Link>
              <Link href="/sitemap" className="text-gray-400 hover:text-white text-sm transition-colors">
                Sơ đồ trang web
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
