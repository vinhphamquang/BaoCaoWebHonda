'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Bạn cần đăng nhập để xem trang này</h1>
        <Button onClick={() => router.push('/login')}>Đăng nhập</Button>
      </div>
    );
  }

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
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Đăng xuất
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;