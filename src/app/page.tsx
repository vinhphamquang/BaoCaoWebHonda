'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Car, ArrowRight, Phone, Shield, Award, Clock, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import CarCard from '@/components/cars/CarCard';
import { Car as CarType } from '@/types';

const HomePage: React.FC = () => {
  const router = useRouter();
  const [featuredCars, setFeaturedCars] = useState<CarType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedCars = async () => {
      try {
        const response = await fetch('/api/cars?limit=4&sortBy=price&sortOrder=desc');
        const data = await response.json();
        if (data.success) {
          setFeaturedCars(data.data);
        }
      } catch (error) {
        console.error('Error fetching featured cars:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedCars();
  }, []);

  const features = [
    {
      icon: Shield,
      title: 'Bảo hành chính hãng',
      description: 'Xe Honda được bảo hành toàn diện 3 năm hoặc 100.000 km',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: Award,
      title: 'Chất lượng đảm bảo',
      description: 'Tất cả xe đều được kiểm tra nghiêm ngặt trước khi giao',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      icon: Clock,
      title: 'Dịch vụ 24/7',
      description: 'Hỗ trợ kỹ thuật và tư vấn mọi lúc mọi nơi',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      icon: Car,
      title: 'Lái thử miễn phí',
      description: 'Đăng ký lái thử xe Honda yêu thích của bạn',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-gray-900 to-black py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/cars/img/img/honda-pattern.png')] opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                Khám phá dòng xe <span className="text-gradient bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent">Honda</span> mới nhất
              </h1>
              <p className="text-lg text-gray-300 mb-8">
                Trải nghiệm đẳng cấp với thiết kế hiện đại, công nghệ tiên tiến và hiệu suất vượt trội
              </p>
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <Link href="/cars">
                  <Button size="lg" className="gradient-primary hover:shadow-lg btn-hover-lift font-semibold px-8 py-4 rounded-xl">
                    Xem tất cả xe
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/test-drive">
                  <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white hover:text-red-600 backdrop-blur-sm bg-white/10 font-semibold px-8 py-4 rounded-xl">
                    Đăng ký lái thử
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="relative h-64 md:h-80 lg:h-96 w-full overflow-hidden rounded-2xl shadow-2xl">
                <Image 
                  src="/images/cars/img/img/honda-civic.webp" 
                  alt="Honda Civic" 
                  fill 
                  className="object-cover" 
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-red-600 text-white p-4 rounded-xl shadow-xl">
                <div className="text-sm font-medium">Bắt đầu từ</div>
                <div className="text-2xl font-bold">559.000.000 VNĐ</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Cars Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Xe Honda nổi bật</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Khám phá những mẫu xe Honda được yêu thích nhất với thiết kế hiện đại và công nghệ tiên tiến</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              Array(4).fill(0).map((_, index) => (
                <Card key={index} className="animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                  <CardContent>
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                  </CardContent>
                </Card>
              ))
            ) : featuredCars.length > 0 ? (
              featuredCars.map((car) => (
                <CarCard key={car._id} car={car} />
              ))
            ) : (
              <div className="col-span-4 text-center py-12">
                <p className="text-gray-500">Không tìm thấy xe nổi bật</p>
              </div>
            )}
          </div>

          <div className="text-center mt-12">
            <Link href="/cars">
              <Button variant="outline" className="border-red-200 hover:border-red-500 font-medium">
                Xem tất cả xe
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Tại sao chọn Honda Plus?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Chúng tôi cam kết mang đến trải nghiệm mua xe Honda đẳng cấp với dịch vụ chăm sóc khách hàng 5 sao</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center gap-4">
                    <div className={`p-4 rounded-xl ${feature.bgColor}`}>
                      <feature.icon className={`h-8 w-8 ${feature.color}`} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-red-600 to-red-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Sẵn sàng trải nghiệm xe Honda?</h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">Liên hệ với chúng tôi ngay hôm nay để được tư vấn và đặt lịch lái thử xe Honda yêu thích của bạn</p>
          <div className="flex justify-center">
            <Link href="/cars">
              <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white hover:text-red-600 backdrop-blur-sm bg-white/10 font-semibold px-8 py-4 rounded-xl">
                Xem tất cả xe
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;