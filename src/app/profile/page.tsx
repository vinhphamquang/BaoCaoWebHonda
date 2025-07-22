'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Heart, Clock, Settings, LogOut, Car, FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { useUserActivity } from '@/hooks/useUserActivity';

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const { favoriteCars, viewedCars } = useUserActivity();
  const router = useRouter();

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Bạn cần đăng nhập để xem trang này</h1>
        <Button onClick={() => router.push('/login')}>Đăng nhập</Button>
      </div>
    );
  }

  const profileMenuItems = [
    {
      icon: Heart,
      title: 'Xe yêu thích',
      description: `${favoriteCars.length} xe`,
      href: '/profile/favorites',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      icon: Clock,
      title: 'Lịch sử xem',
      description: `${viewedCars.length} xe`,
      href: '/profile/history',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: Car,
      title: 'Đơn đặt hàng',
      description: 'Quản lý đơn hàng',
      href: '/profile/orders',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      icon: FileText,
      title: 'Lịch lái thử',
      description: 'Quản lý lịch hẹn',
      href: '/profile/test-drives',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      icon: Settings,
      title: 'Cài đặt tài khoản',
      description: 'Cập nhật thông tin',
      href: '/profile/settings',
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
    },
  ];

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-2xl p-8 mb-8 text-white">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-4xl font-bold">
              {user.name.charAt(0)}
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
              <p className="text-white/80 mb-4">{user.email}</p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <Button 
                  variant="outline" 
                  className="border-white/30 text-white hover:bg-white hover:text-red-600 backdrop-blur-sm bg-white/10"
                  onClick={() => router.push('/profile/settings')}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Chỉnh sửa hồ sơ
                </Button>
                <Button 
                  variant="outline" 
                  className="border-white/30 text-white hover:bg-white hover:text-red-600 backdrop-blur-sm bg-white/10"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Đăng xuất
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Menu */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {profileMenuItems.map((item, index) => (
            <Link key={index} href={item.href}>
              <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl ${item.bgColor}`}>
                      <item.icon className={`h-6 w-6 ${item.color}`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{item.title}</h3>
                      <p className="text-gray-500">{item.description}</p>
                    </div>
                    <div className="ml-auto">
                      <div className="p-2 rounded-full hover:bg-gray-100">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-gray-400"
                        >
                          <path d="m9 18 6-6-6-6" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;