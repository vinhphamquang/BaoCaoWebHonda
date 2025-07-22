'use client';

import React from 'react';
import Link from 'next/link';

import { ArrowRight, Shield, Award, Users, Sparkles, Star } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function Home() {
  const features = [
    {
      icon: Shield,
      title: 'Bảo hành chính hãng',
      description: 'Bảo hành toàn diện 3 năm hoặc 100.000km',
    },
    {
      icon: Award,
      title: 'Chất lượng đảm bảo',
      description: 'Xe Honda chính hãng 100% nhập khẩu',
    },
    {
      icon: Users,
      title: 'Dịch vụ tận tâm',
      description: 'Đội ngũ tư vấn chuyên nghiệp 24/7',
    },
    {
      icon: Star,
      title: 'Uy tín hàng đầu',
      description: 'Hơn 10 năm kinh nghiệm trong ngành',
    },
  ];



  return (
    <div className="bg-white">
      {/* Hero Section - Honda Plus */}
      <section className="relative min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-black text-white overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-transparent animate-pulse"></div>
          <div className="absolute top-0 left-0 w-full h-full opacity-30 animate-float"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 flex items-center min-h-screen">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">
            <div className="space-y-10 animate-slide-up">
              <div className="space-y-6">
                <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                  <Sparkles className="h-4 w-4 mr-2 text-red-600" />
                  <span className="text-sm font-semibold">Honda Plus Premium Experience</span>
                </div>

                <h1 className="text-5xl lg:text-7xl font-black leading-tight">
                  <span className="block">Honda</span>
                  <span className="block text-gradient bg-gradient-to-r from-red-600 to-black bg-clip-text text-transparent">
                  Plus
                </span>
                  <span className="block text-3xl lg:text-4xl font-light text-gray-300">
                    Chính Hãng
                  </span>
                </h1>

                <p className="text-xl lg:text-2xl text-gray-200 font-light leading-relaxed">
                  Trải nghiệm <span className="font-bold text-red-600">Premium</span> •
                  Chất lượng <span className="font-bold text-red-400">Vượt trội</span> •
                  Dịch vụ <span className="font-bold text-blue-400">Đẳng cấp</span>
                </p>

                <p className="text-lg text-gray-300 max-w-2xl leading-relaxed">
                  Showroom Honda Plus - Nơi hội tụ những mẫu xe Honda cao cấp nhất với công nghệ tiên tiến,
                  thiết kế sang trọng và dịch vụ chăm sóc khách hàng 5 sao.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-6">
                <Link href="/cars">
                  <Button size="lg" className="gradient-primary hover:shadow-2xl btn-hover-lift font-bold px-8 py-4 rounded-2xl text-lg">
                    Xem các mẫu xe
                    <ArrowRight className="ml-3 h-6 w-6" />
                  </Button>
                </Link>
                <Link href="/test-drive">
                  <Button size="lg" variant="outline" className="border-2 border-white/30 text-white hover:bg-white hover:text-gray-900 backdrop-blur-sm bg-white/10 font-semibold px-8 py-4 rounded-2xl text-lg">
                    Đặt lịch lái thử
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-8 pt-8">
                <div className="text-center group">
                  <div className="text-4xl font-black text-red-600 group-hover:scale-110 transition-transform">15+</div>
                  <div className="text-gray-300 font-medium">Năm kinh nghiệm</div>
                </div>
                <div className="text-center group">
                  <div className="text-4xl font-black text-blue-400 group-hover:scale-110 transition-transform">10K+</div>
                  <div className="text-gray-300 font-medium">Khách hàng VIP</div>
                </div>
                <div className="text-center group">
                  <div className="text-4xl font-black text-green-400 group-hover:scale-110 transition-transform">100%</div>
                  <div className="text-gray-300 font-medium">Chính hãng</div>
                </div>
              </div>
            </div>

            <div className="relative animate-slide-right">
              <div className="relative z-10">
                <div className="w-full h-96 lg:h-[500px] bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl flex items-center justify-center shadow-2xl overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-blue-600/20 group-hover:from-red-600/30 group-hover:to-blue-600/30 transition-all duration-500"></div>
                  <div className="relative text-center">
                    <div className="text-6xl mb-4">🚗</div>
                    <span className="text-white text-xl font-bold">Honda Plus</span>
                    <p className="text-gray-300 mt-2">Premium Experience Awaits</p>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-full h-full bg-gradient-to-br from-red-600 to-black rounded-3xl -z-10 opacity-50"></div>
              <div className="absolute -top-6 -left-6 w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 rounded-3xl -z-20 opacity-30"></div>
            </div>
          </div>
        </div>
      </section>



      {/* Features - Honda Plus */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-gray-900 to-black text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-900/20 to-blue-900/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6 mb-16">
            <h2 className="text-4xl lg:text-6xl font-black">
              Tại Sao Chọn
              <span className="block text-gradient bg-gradient-to-r from-red-600 to-black bg-clip-text text-transparent">
                Honda Plus?
              </span>
            </h2>
            <p className="text-xl lg:text-2xl text-gray-300 max-w-4xl mx-auto font-light">
              Trải nghiệm dịch vụ đẳng cấp thế giới với cam kết chất lượng vượt trội
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group text-center space-y-6 p-8 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-500 hover:scale-105">
                <div className="mx-auto w-20 h-20 gradient-primary rounded-2xl flex items-center justify-center shadow-2xl group-hover:shadow-red-500/25 transition-all duration-500 group-hover:scale-110">
                  <feature.icon className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white group-hover:text-red-600 transition-colors">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Xóa toàn bộ phần CTA Section này */}
      {/* 
      <section className="py-20 lg:py-32 gradient-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-yellow-400/10 to-transparent"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-10">
            <div className="space-y-6">
              <div className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                <Sparkles className="h-5 w-5 mr-2 text-yellow-400" />
                <span className="text-sm font-bold tracking-wide">HONDA PLUS EXPERIENCE</span>
              </div>

              <h2 className="text-4xl lg:text-6xl font-black leading-tight">
                Sẵn Sàng Trải Nghiệm
                <span className="block text-yellow-400">Đẳng Cấp?</span>
              </h2>

              <p className="text-xl lg:text-2xl text-red-100 max-w-4xl mx-auto font-light leading-relaxed">
                Đặt lịch hẹn ngay hôm nay để trải nghiệm dịch vụ Honda Plus đẳng cấp thế giới.
                <span className="font-bold text-yellow-400">Tư vấn miễn phí</span> •
                <span className="font-bold text-blue-300">Lái thử tận nơi</span> •
                <span className="font-bold text-green-300">Hỗ trợ 24/7</span>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button size="lg" variant="secondary" className="bg-white text-gray-900 hover:bg-yellow-400 hover:text-gray-900 font-bold px-10 py-4 rounded-2xl text-lg shadow-2xl btn-hover-lift">
                📞 Gọi ngay: 1900-1234
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-white/50 text-white hover:bg-white hover:text-red-600 backdrop-blur-sm bg-white/10 font-bold px-10 py-4 rounded-2xl text-lg">
                🚗 Đặt lịch lái thử VIP
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12">
              <div className="text-center space-y-2">
                <div className="text-3xl">⚡</div>
                <div className="font-bold text-yellow-400">Phản hồi trong 5 phút</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-3xl">🎯</div>
                <div className="font-bold text-blue-300">Tư vấn 1-1 chuyên sâu</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-3xl">🏆</div>
                <div className="font-bold text-green-300">Cam kết giá tốt nhất</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      */}
    </div>
  );
}
