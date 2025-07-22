'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Heart, Clock, Settings, LogOut, Car } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Loading from '@/components/ui/Loading';

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkAuth = async () => {
      // Kiểm tra token từ cookie
      const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
      
      if (!token) {
        router.push('/login?callbackUrl=/profile');
        return;
      }

      try {
        const response = await fetch('/api/auth/me');
        const data = await response.json();

        if (data.success) {
          setUser(data.data);
        } else {
          console.error('Error fetching user data:', data.error);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loading size="lg" text="Đang tải thông tin tài khoản..." />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Không thể tải thông tin tài khoản
          </h2>
          <p className="text-gray-600 mb-6">
            Vui lòng đăng nhập để xem thông tin tài khoản của bạn.
          </p>
          <Link href="/login?callbackUrl=/profile">
            <Button size="lg">Đăng nhập</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Tài khoản của tôi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <nav className="space-y-2">
                  <Link href="/profile" className="flex items-center p-2 text-gray-900 rounded-lg bg-gray-100">
                    <User className="h-5 w-5 mr-3" />
                    Thông tin cá nhân
                  </Link>
                  <Link href="/profile/favorites" className="flex items-center p-2 text-gray-700 rounded-lg hover:bg-gray-100">
                    <Heart className="h-5 w-5 mr-3" />
                    Xe yêu thích
                  </Link>
                  <Link href="/profile/history" className="flex items-center p-2 text-gray-700 rounded-lg hover:bg-gray-100">
                    <Clock className="h-5 w-5 mr-3" />
                    Lịch sử xem xe
                  </Link>
                  <Link href="/settings" className="flex items-center p-2 text-gray-700 rounded-lg hover:bg-gray-100">
                    <Settings className="h-5 w-5 mr-3" />
                    Cài đặt
                  </Link>
                  <button 
                    onClick={() => {
                      // Xử lý đăng xuất
                      router.push('/api/auth/logout');
                    }}
                    className="flex items-center w-full p-2 text-left text-gray-700 rounded-lg hover:bg-gray-100"
                  >
                    <LogOut className="h-5 w-5 mr-3" />
                    Đăng xuất
                  </button>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin cá nhân</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Thông tin cơ bản</h3>
                      <p className="text-sm text-gray-600">Thông tin cá nhân của bạn</p>
                    </div>
                    <Button variant="outline" size="sm" className="mt-2 sm:mt-0">
                      Chỉnh sửa
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <div className="text-sm text-gray-600">Họ và tên</div>
                      <div className="font-medium">{user.name}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Email</div>
                      <div className="font-medium">{user.email}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Số điện thoại</div>
                      <div className="font-medium">{user.phone}</div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">Địa chỉ</h3>
                        <p className="text-sm text-gray-600">Địa chỉ giao hàng của bạn</p>
                      </div>
                      <Button variant="outline" size="sm" className="mt-2 sm:mt-0">
                        Chỉnh sửa
                      </Button>
                    </div>

                    <div className="mt-4">
                      <div className="text-sm text-gray-600">Địa chỉ đầy đủ</div>
                      <div className="font-medium">
                        {user.address?.street}, {user.address?.city}, {user.address?.state}, {user.address?.zipCode}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">Bảo mật</h3>
                        <p className="text-sm text-gray-600">Cập nhật mật khẩu của bạn</p>
                      </div>
                      <Button variant="outline" size="sm" className="mt-2 sm:mt-0">
                        Đổi mật khẩu
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;