import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-blue-900 mb-4">404</h1>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Trang không tồn tại
          </h2>
          <p className="text-gray-600 mb-8">
            Xin lỗi, chúng tôi không thể tìm thấy trang bạn đang tìm kiếm. 
            Có thể trang đã được di chuyển hoặc không còn tồn tại.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-flex items-center bg-blue-900 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition-colors font-medium"
          >
            <Home className="h-4 w-4 mr-2" />
            Về trang chủ
          </Link>
          
          <div className="text-center">
            <Link
              href="/"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Quay lại trang chủ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
