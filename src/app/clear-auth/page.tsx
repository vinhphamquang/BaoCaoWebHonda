'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';

export default function ClearAuthPage() {
  const [status, setStatus] = useState('');
  const router = useRouter();

  const clearAuth = async () => {
    try {
      setStatus('Đang xóa authentication...');
      
      // Call logout API to clear server-side cookie
      await fetch('/api/auth/logout', {
        method: 'POST'
      });
      
      // Clear any client-side storage
      localStorage.clear();
      sessionStorage.clear();
      
      setStatus('✅ Đã xóa authentication thành công!');
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push('/login');
      }, 2000);
      
    } catch (error) {
      setStatus('❌ Lỗi khi xóa authentication');
      console.error('Clear auth error:', error);
    }
  };

  const checkAuthStatus = async () => {
    try {
      setStatus('Đang kiểm tra trạng thái authentication...');
      
      const response = await fetch('/api/auth/me');
      const data = await response.json();
      
      if (data.success) {
        setStatus(`👤 Đang đăng nhập: ${data.user.name} (${data.user.email})`);
      } else {
        setStatus('🔓 Chưa đăng nhập');
      }
      
    } catch (error) {
      setStatus('❌ Lỗi khi kiểm tra authentication');
      console.error('Check auth error:', error);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-8">
          Debug Authentication
        </h1>
        
        <div className="space-y-4">
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Trạng thái hiện tại:</h3>
            <p className="text-sm">{status}</p>
          </div>
          
          <div className="space-y-3">
            <Button 
              onClick={checkAuthStatus}
              variant="outline"
              className="w-full"
            >
              Kiểm tra trạng thái
            </Button>
            
            <Button 
              onClick={clearAuth}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              Xóa Authentication
            </Button>
            
            <Button 
              onClick={() => router.push('/login')}
              variant="outline"
              className="w-full"
            >
              Đến trang đăng nhập
            </Button>
            
            <Button 
              onClick={() => router.push('/register')}
              variant="outline"
              className="w-full"
            >
              Đến trang đăng ký
            </Button>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Nếu bị redirect về trang chủ, có thể do:
          </p>
          <ul className="text-xs text-gray-500 mt-2 space-y-1">
            <li>• Cookie authentication vẫn tồn tại</li>
            <li>• Middleware đang redirect</li>
            <li>• API /auth/me trả về user</li>
          </ul>
        </div>
      </div>
    </div>
  );
}