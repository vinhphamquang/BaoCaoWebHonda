import { apiClient, handleApiResponse, handleApiError, ApiResponse } from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/constants';

// Types
export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'user' | 'admin';
  avatar?: string;
  address?: string;
  city?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone: string;
  address?: string;
  city?: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
  address?: string;
  city?: string;
}

export interface UpdatePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  password: string;
  confirmPassword: string;
}

// Auth Service
export const authService = {
  // Đăng nhập
  async login(data: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<ApiResponse<LoginResponse>>(
        API_ENDPOINTS.AUTH.LOGIN,
        data
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Đăng ký
  async register(data: RegisterRequest): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<ApiResponse<LoginResponse>>(
        API_ENDPOINTS.AUTH.REGISTER,
        data
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Đăng xuất
  async logout(): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
      // Xóa token và user data từ localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    } catch (error) {
      // Vẫn xóa token local dù API call thất bại
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
      throw new Error(handleApiError(error));
    }
  },

  // Lấy thông tin user hiện tại
  async getMe(): Promise<User> {
    try {
      const response = await apiClient.get<ApiResponse<User>>(
        API_ENDPOINTS.AUTH.ME
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Cập nhật profile
  async updateProfile(data: UpdateProfileRequest): Promise<User> {
    try {
      const response = await apiClient.put<ApiResponse<User>>(
        API_ENDPOINTS.AUTH.UPDATE_PROFILE,
        data
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Cập nhật mật khẩu
  async updatePassword(data: UpdatePasswordRequest): Promise<void> {
    try {
      const response = await apiClient.put<ApiResponse<void>>(
        API_ENDPOINTS.AUTH.UPDATE_PASSWORD,
        data
      );
      handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Quên mật khẩu
  async forgotPassword(data: ForgotPasswordRequest): Promise<void> {
    try {
      const response = await apiClient.post<ApiResponse<void>>(
        API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
        data
      );
      handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Reset mật khẩu
  async resetPassword(token: string, data: ResetPasswordRequest): Promise<void> {
    try {
      const response = await apiClient.put<ApiResponse<void>>(
        `${API_ENDPOINTS.AUTH.RESET_PASSWORD}/${token}`,
        data
      );
      handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Kiểm tra token có hợp lệ không
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    const token = localStorage.getItem('token');
    return !!token;
  },

  // Lấy token từ localStorage
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  },

  // Lấy user từ localStorage
  getUser(): User | null {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  // Lưu token và user vào localStorage
  setAuth(token: string, user: User): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  },

  // Xóa auth data
  clearAuth(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

export default authService;
