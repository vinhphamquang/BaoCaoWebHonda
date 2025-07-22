'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Heart, Clock, Settings, LogOut, Car, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Loading from '@/components/ui/Loading';
import { Car as CarType } from '@/types';
import { formatPrice } from '@/lib/utils';
import { useToast } from '@/components/ui/Toast';
import Image from 'next/image';

const FavoritesPage: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [favorites, setFavorites] = useState<CarType[]>([]);
  const { success, error: showError } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      // Kiểm tra token từ cookie
      const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
      
      if (!token) {
        router.push('/login?callbackUrl=/profile/favorites');
        return;
      }

      try {
        // Lấy thông tin người dùng
        const userResponse = await fetch('/api/auth/me');
        const userData = await userResponse.json();

        if (userData.success) {
          setUser(userData.data);
          // Lấy danh sách xe yêu thích
          fetchFavorites();
        } else {
          console.error('Error fetching user data:', userData.error);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const fetchFavorites = async () => {
    try {
      const response = await fetch('/api/user/favorites');
      const data = await response.json();

      if (data.success) {
        setFavorites(data.data);
      } else {
        console.error('Error fetching favorites:', data.error);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (carId: string) => {
    try {
      const response = await fetch(`/api/user/favorites/${carId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        // Cập nhật danh sách xe yêu thích
        setFavorites(favorites.filter(car => car._id !== carId));
        success('Đã xóa khỏi yêu thích!', 'Xe đã được xóa khỏi danh sách yêu thích.');
      } else {
        showError('Lỗi', data.error || 'Không thể xóa xe khỏi danh sách yêu thích.');
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
      showError('Lỗi', 'Đã xảy ra lỗi khi xóa xe khỏi danh sách yêu thích.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loading size="lg" text="Đang tải danh sách xe yêu thích..." />
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
          <Link href="/login?callbackUrl=/profile/favorites">
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
                  <Link href="/profile" className="flex items-center p-2 text-gray-700 rounded-lg hover:bg-gray-100">
                    <User className="h-5 w-5 mr-3" />
                    Thông tin cá nhân
                  </Link>
                  <Link href="/profile/favorites" className="flex items-center p-2 text-gray-900 rounded-lg bg-gray-100">
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
                <CardTitle className="flex items-center">
                  <Heart className="h-5 w-5 mr-2" />
                  Xe yêu thích
                </CardTitle>
              </CardHeader>
              <CardContent>
                {favorites.length === 0 ? (
                  <div className="text-center py-12">
                    <Heart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có xe yêu thích</h3>
                    <p className="text-gray-600 mb-6">Bạn chưa thêm xe nào vào danh sách yêu thích.</p>
                    <Link href="/cars">
                      <Button>
                        <Car className="h-5 w-5 mr-2" />
                        Khám phá các mẫu xe
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {favorites.map((car) => (
                      <div key={car._id} className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="flex flex-col md:flex-row">
                          <div className="md:w-1/3 relative h-48">
                            {car.images && car.images.length > 0 ? (
                              <Image 
                                src={`/${car.images[0]}`}
                                alt={car.name}
                                fill
                                style={{ objectFit: 'cover' }}
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <Car className="h-12 w-12 text-gray-400" />
                              </div>
                            )}
                            <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                              {car.category.toUpperCase()}
                            </div>
                          </div>
                          <div className="md:w-2/3 p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-1">
                                  <Link href={`/cars/${car._id}`} className="hover:text-red-600">
                                    {car.name}
                                  </Link>
                                </h3>
                                <div className="text-red-600 font-bold text-xl mb-2">
                                  {formatPrice(car.price)}
                                </div>
                                <div className="text-sm text-gray-600 mb-4">
                                  <span className="mr-3">{car.year}</span>
                                  <span className="mr-3">{car.specifications.engine}</span>
                                  <span>{car.specifications.transmission}</span>
                                </div>
                              </div>
                              <button 
                                onClick={() => car._id && removeFavorite(car._id)}
                                className="text-gray-500 hover:text-red-600"
                                title="Xóa khỏi yêu thích"
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </div>
                            <div className="flex space-x-3 mt-4">
                              <Link href={`/cars/${car._id}`}>
                                <Button variant="outline" size="sm">
                                  Xem chi tiết
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FavoritesPage;