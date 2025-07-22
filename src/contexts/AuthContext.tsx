'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Kiểm tra người dùng đã đăng nhập chưa khi tải trang
  useEffect(() => {
    const checkUserLoggedIn = async () => {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();

        if (data.success) {
          setUser(data.user);
        }
      } catch (error) {
        console.error('Lỗi kiểm tra đăng nhập:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUserLoggedIn();
  }, []);

  // Đăng nhập
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        const errorMessage = data.message || 'Đăng nhập thất bại';
        setError(errorMessage);
        throw new Error(errorMessage);
      }

      setUser(data.user);
    } catch (error: any) {
      setError(error.message);
      throw error; // Ném lỗi để component có thể bắt và xử lý
    } finally {
      setLoading(false);
    }
  };

  // Đăng ký
  const register = async (userData: RegisterData) => {
    setLoading(true);
    setError(null);

    try {
      console.log('Sending registration data to API:', userData);
      
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await res.json();
      console.log('API response:', data, 'Status:', res.status);

      if (!res.ok) {
        const errorMessage = data.message || 'Đăng ký thất bại';
        console.error('Registration failed:', errorMessage);
        setError(errorMessage);
        throw new Error(errorMessage);
      }

      console.log('Setting user data:', data.user);
      setUser(data.user);
    } catch (error: any) {
      console.error('Registration error caught:', error);
      setError(error.message);
      throw error; // Ném lỗi để component có thể bắt và xử lý
    } finally {
      setLoading(false);
    }
  };

  // Đăng xuất
  const logout = async () => {
    setLoading(true);

    try {
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (res.ok) {
        setUser(null);
      }
    } catch (error) {
      console.error('Lỗi đăng xuất:', error);
    } finally {
      setLoading(false);
    }
  };

  // Xóa thông báo lỗi
  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook để sử dụng context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};