import React from 'react';
import { Crown, Star, Shield, Zap, Heart, Award, Users, Sparkles } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';

const PremiumPage: React.FC = () => {
  const premiumFeatures = [
    {
      icon: Crown,
      title: 'VIP Concierge Service',
      description: 'Dịch vụ tư vấn cá nhân hóa 1-1 với chuyên gia Honda Plus',
      color: 'from-yellow-400 to-orange-500'
    },
    {
      icon: Zap,
      title: 'Express Delivery',
      description: 'Giao xe tận nơi trong 24h với dịch vụ white-glove',
      color: 'from-blue-400 to-cyan-500'
    },
    {
      icon: Shield,
      title: 'Platinum Warranty',
      description: 'Bảo hành mở rộng 5 năm + bảo dưỡng miễn phí trọn đời',
      color: 'from-green-400 to-emerald-500'
    },
    {
      icon: Heart,
      title: 'Lifetime Support',
      description: 'Hỗ trợ 24/7 với hotline riêng cho khách hàng Honda Plus',
      color: 'from-red-400 to-pink-500'
    },
    {
      icon: Star,
      title: 'Exclusive Events',
      description: 'Tham gia các sự kiện độc quyền và test drive mẫu xe mới',
      color: 'from-purple-400 to-indigo-500'
    },
    {
      icon: Award,
      title: 'Premium Rewards',
      description: 'Tích điểm và đổi quà cao cấp trong hệ sinh thái Honda Plus',
      color: 'from-amber-400 to-yellow-500'
    }
  ];

  const membershipTiers = [
    {
      name: 'Honda Plus Silver',
      price: 'Miễn phí',
      features: ['Tư vấn chuyên nghiệp', 'Bảo hành chuẩn', 'Hỗ trợ 24/7'],
      color: 'from-gray-400 to-gray-600',
      popular: false
    },
    {
      name: 'Honda Plus Gold',
      price: '5,000,000 VND/năm',
      features: ['Tất cả quyền lợi Silver', 'Bảo dưỡng miễn phí', 'Ưu tiên hỗ trợ', 'Sự kiện độc quyền'],
      color: 'from-yellow-400 to-amber-500',
      popular: true
    },
    {
      name: 'Honda Plus Platinum',
      price: '15,000,000 VND/năm',
      features: ['Tất cả quyền lợi Gold', 'Concierge service', 'Xe thay thế', 'Test drive ưu tiên'],
      color: 'from-purple-400 to-indigo-600',
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 bg-gradient-to-br from-gray-900 via-red-900 to-black text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-blue-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            <div className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
              <Crown className="h-5 w-5 mr-2 text-yellow-400" />
              <span className="text-sm font-bold tracking-wide">HONDA PLUS PREMIUM</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-black leading-tight">
              Trải Nghiệm
              <span className="block text-gradient bg-gradient-to-r from-yellow-400 to-red-400 bg-clip-text text-transparent">
                Đẳng Cấp
              </span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed">
              Gia nhập Honda Plus để tận hưởng dịch vụ cao cấp nhất với những đặc quyền độc quyền 
              dành riêng cho khách hàng VIP
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button size="lg" className="gradient-primary hover:shadow-2xl btn-hover-lift font-bold px-10 py-4 rounded-2xl text-lg">
                <Crown className="mr-3 h-6 w-6" />
                Đăng ký ngay
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-white/50 text-white hover:bg-white hover:text-gray-900 backdrop-blur-sm bg-white/10 font-bold px-10 py-4 rounded-2xl text-lg">
                Tìm hiểu thêm
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Features */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6 mb-16">
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900">
              Đặc Quyền
              <span className="block text-gradient bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent">
                Honda Plus
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Những dịch vụ cao cấp được thiết kế riêng cho khách hàng Honda Plus
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {premiumFeatures.map((feature, index) => (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-500 card-hover bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-8 text-center">
                  <div className={`mx-auto w-20 h-20 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center shadow-2xl group-hover:shadow-lg group-hover:scale-110 transition-all duration-500 mb-6`}>
                    <feature.icon className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Membership Tiers */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-gray-100 to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6 mb-16">
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900">
              Gói Thành Viên
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Chọn gói thành viên phù hợp để tận hưởng những đặc quyền Honda Plus
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {membershipTiers.map((tier, index) => (
              <Card key={index} className={`relative overflow-hidden transition-all duration-500 hover:scale-105 ${tier.popular ? 'ring-4 ring-yellow-400 shadow-2xl' : 'shadow-lg'}`}>
                {tier.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-yellow-400 to-amber-500 text-center py-2">
                    <span className="text-sm font-bold text-gray-900">PHỔ BIẾN NHẤT</span>
                  </div>
                )}
                
                <CardContent className={`p-8 text-center ${tier.popular ? 'pt-12' : ''}`}>
                  <div className={`mx-auto w-16 h-16 bg-gradient-to-r ${tier.color} rounded-2xl flex items-center justify-center shadow-lg mb-6`}>
                    <Crown className="h-8 w-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                  <div className="text-3xl font-black text-red-600 mb-6">{tier.price}</div>
                  
                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-gray-600">
                        <Sparkles className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full ${tier.popular ? 'gradient-primary' : 'bg-gray-900 hover:bg-gray-800'} font-bold py-3 rounded-xl`}
                  >
                    {tier.price === 'Miễn phí' ? 'Đăng ký miễn phí' : 'Nâng cấp ngay'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 gradient-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            <h2 className="text-4xl lg:text-5xl font-black">
              Sẵn Sàng Trở Thành
              <span className="block text-yellow-400">Honda Plus Member?</span>
            </h2>
            <p className="text-xl text-red-100 max-w-3xl mx-auto">
              Gia nhập cộng đồng Honda Plus ngay hôm nay để tận hưởng những đặc quyền độc quyền
            </p>
            <Button size="lg" variant="secondary" className="bg-white text-gray-900 hover:bg-yellow-400 font-bold px-10 py-4 rounded-2xl text-lg shadow-2xl btn-hover-lift">
              <Crown className="mr-3 h-6 w-6" />
              Đăng ký Honda Plus
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PremiumPage;
