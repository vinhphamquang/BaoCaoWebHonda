import React from 'react';
import { Award, Users, Car, Shield, Star, Target, Heart, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';

const AboutPage: React.FC = () => {
  const stats = [
    { icon: Car, label: 'Xe đã bán', value: '5,000+' },
    { icon: Users, label: 'Khách hàng hài lòng', value: '4,500+' },
    { icon: Award, label: 'Năm kinh nghiệm', value: '10+' },
    { icon: Star, label: 'Đánh giá 5 sao', value: '98%' },
  ];

  const values = [
    {
      icon: Shield,
      title: 'Uy tín',
      description: 'Đại lý Honda chính hãng với chứng nhận đầy đủ từ Honda Việt Nam.',
    },
    {
      icon: Heart,
      title: 'Tận tâm',
      description: 'Đội ngũ tư vấn chuyên nghiệp, luôn đặt lợi ích khách hàng lên hàng đầu.',
    },
    {
      icon: Target,
      title: 'Chính xác',
      description: 'Tư vấn chính xác, báo giá minh bạch, không phát sinh chi phí ẩn.',
    },
    {
      icon: Zap,
      title: 'Nhanh chóng',
      description: 'Quy trình mua xe nhanh gọn, hỗ trợ thủ tục trong ngày.',
    },
  ];

  const milestones = [
    {
      year: '2014',
      title: 'Thành lập Honda Shop',
      description: 'Bắt đầu với showroom đầu tiên tại TP. Hồ Chí Minh',
    },
    {
      year: '2016',
      title: 'Mở rộng dịch vụ',
      description: 'Thêm dịch vụ bảo dưỡng và sửa chữa chuyên nghiệp',
    },
    {
      year: '2018',
      title: 'Đạt mốc 1000 xe',
      description: 'Bán thành công 1000 xe Honda trong năm',
    },
    {
      year: '2020',
      title: 'Chuyển đổi số',
      description: 'Ra mắt website và hệ thống bán hàng online',
    },
    {
      year: '2022',
      title: 'Mở rộng showroom',
      description: 'Khai trương showroom thứ 2 với quy mô lớn hơn',
    },
    {
      year: '2024',
      title: 'Đạt 5000+ khách hàng',
      description: 'Phục vụ hơn 5000 khách hàng trên toàn quốc',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white">
        <div className="container-honda section-padding">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Về Honda Shop
            </h1>
            <p className="text-xl lg:text-2xl text-red-100 max-w-4xl mx-auto">
              Hơn 10 năm đồng hành cùng khách hàng Việt Nam, Honda Shop tự hào là đại lý Honda uy tín
              với cam kết mang đến những chiếc xe chất lượng và dịch vụ tốt nhất.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="section-padding bg-white">
        <div className="container-honda">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <stat.icon className="h-8 w-8 text-red-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="section-padding bg-gray-50">
        <div className="container-honda">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Sứ mệnh của chúng tôi
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Honda Shop cam kết mang đến cho khách hàng Việt Nam những chiếc xe Honda chính hãng
                  với chất lượng tốt nhất, giá cả hợp lý và dịch vụ chăm sóc khách hàng tận tâm.
                  Chúng tôi không chỉ bán xe mà còn đồng hành cùng khách hàng trong suốt quá trình
                  sử dụng xe.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Tầm nhìn của chúng tôi
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Trở thành đại lý Honda hàng đầu Việt Nam, được khách hàng tin tưởng và lựa chọn
                  bởi sự uy tín, chất lượng dịch vụ và cam kết phục vụ. Chúng tôi hướng tới việc
                  mở rộng mạng lưới showroom trên toàn quốc để phục vụ khách hàng tốt hơn.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div className="section-padding bg-white">
        <div className="container-honda">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Giá trị cốt lõi
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Những giá trị mà Honda Shop luôn theo đuổi và thực hiện trong mọi hoạt động
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                    <value.icon className="h-8 w-8 text-red-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="section-padding bg-gray-50">
        <div className="container-honda">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Hành trình phát triển
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Những cột mốc quan trọng trong quá trình phát triển của Honda Shop
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-red-200"></div>

            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <Card>
                      <CardContent className="p-6">
                        <div className="text-2xl font-bold text-red-600 mb-2">
                          {milestone.year}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {milestone.title}
                        </h3>
                        <p className="text-gray-600">
                          {milestone.description}
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Timeline dot */}
                  <div className="relative z-10 w-4 h-4 bg-red-600 rounded-full border-4 border-white shadow-lg"></div>

                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="section-padding bg-white">
        <div className="container-honda">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Đội ngũ chuyên nghiệp
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Đội ngũ nhân viên giàu kinh nghiệm, được đào tạo bài bản và luôn sẵn sàng phục vụ
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4"></div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Nguyễn Văn A
                </h3>
                <p className="text-red-600 font-medium mb-2">
                  Giám đốc kinh doanh
                </p>
                <p className="text-gray-600 text-sm">
                  10+ năm kinh nghiệm trong ngành ô tô
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4"></div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Trần Thị B
                </h3>
                <p className="text-red-600 font-medium mb-2">
                  Trưởng phòng tư vấn
                </p>
                <p className="text-gray-600 text-sm">
                  8+ năm kinh nghiệm tư vấn bán hàng
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4"></div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Lê Văn C
                </h3>
                <p className="text-red-600 font-medium mb-2">
                  Trưởng phòng kỹ thuật
                </p>
                <p className="text-gray-600 text-sm">
                  12+ năm kinh nghiệm bảo dưỡng Honda
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
