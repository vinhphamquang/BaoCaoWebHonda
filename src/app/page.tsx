import Link from 'next/link';
import Image from 'next/image';
import { getFeaturedCars } from '@/data/cars';
import ProductCard from '@/components/ProductCard';
import { ArrowRight, Zap, Shield, Award, Users } from 'lucide-react';

export default function Home() {
  const featuredCars = getFeaturedCars();

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-900 to-blue-700 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Tương lai của
                <span className="block text-green-400">Xe điện Việt Nam</span>
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                Khám phá dòng xe điện thông minh VinFast với công nghệ tiên tiến,
                thiết kế hiện đại và trải nghiệm lái xe tuyệt vời.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/products"
                  className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center"
                >
                  Khám phá sản phẩm
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  href="/test-drive"
                  className="border-2 border-white text-white hover:bg-white hover:text-blue-900 px-8 py-3 rounded-lg font-semibold transition-colors text-center"
                >
                  Đăng ký lái thử
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                <Image
                  src="/images/placeholder-car.jpg"
                  alt="VinFast Electric Car"
                  width={600}
                  height={400}
                  className="rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tại sao chọn VinFast?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              VinFast mang đến những giá trị vượt trội cho khách hàng với công nghệ tiên tiến và dịch vụ chuyên nghiệp
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">100% Điện</h3>
              <p className="text-gray-600">
                Thân thiện với môi trường, tiết kiệm chi phí vận hành
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">An toàn tuyệt đối</h3>
              <p className="text-gray-600">
                Đạt chuẩn an toàn 5 sao với công nghệ ADAS tiên tiến
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Chất lượng cao</h3>
              <p className="text-gray-600">
                Thiết kế hiện đại, chất liệu cao cấp, hoàn thiện tỉ mỉ
              </p>
            </div>

            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Dịch vụ tận tâm</h3>
              <p className="text-gray-600">
                Hỗ trợ 24/7, bảo hành toàn diện, dịch vụ chuyên nghiệp
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Sản phẩm nổi bật
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Khám phá những mẫu xe điện VinFast được yêu thích nhất
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCars.map((car) => (
              <ProductCard key={car.id} car={car} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/products"
              className="inline-flex items-center bg-blue-900 text-white px-8 py-3 rounded-lg hover:bg-blue-800 transition-colors font-semibold"
            >
              Xem tất cả sản phẩm
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Sẵn sàng trải nghiệm tương lai?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Đăng ký lái thử ngay hôm nay để cảm nhận sự khác biệt của xe điện VinFast
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/test-drive"
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Đăng ký lái thử miễn phí
            </Link>
            <Link
              href="/contact"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-900 px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Liên hệ tư vấn
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
