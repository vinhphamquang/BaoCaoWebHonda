import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import authService, { LoginRequest, RegisterRequest, UpdateProfileRequest } from '@/services/auth';

export interface User {
  _id: string;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  city?: string;
  role: 'user' | 'admin';
  avatar?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: UpdateProfileRequest) => Promise<void>;
  refreshUser: () => Promise<void>;
  clearError: () => void;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      initializeAuth: async () => {
        try {
          set({ loading: true, error: null });

          const token = authService.getToken();
          const user = authService.getUser();

          if (token && user) {
            // Verify token by fetching current user
            try {
              const currentUser = await authService.getMe();
              set({
                user: currentUser as User,
                isAuthenticated: true,
                loading: false,
                error: null,
              });
            } catch {
              // Token invalid, clear auth
              authService.clearAuth();
              set({
                user: null,
                isAuthenticated: false,
                loading: false,
                error: null,
              });
            }
          } else {
            set({
              user: null,
              isAuthenticated: false,
              loading: false,
              error: null,
            });
          }
        } catch (error) {
          set({
            user: null,
            isAuthenticated: false,
            loading: false,
            error: error instanceof Error ? error.message : 'Có lỗi xảy ra',
          });
        }
      },

      login: async (data: LoginRequest) => {
        try {
          set({ loading: true, error: null });

          const result = await authService.login(data);

          // Save auth data
          authService.setAuth(result.token, result.user);

          set({
            user: result.user as User,
            isAuthenticated: true,
            loading: false,
            error: null,
          });
        } catch (error) {
          set({
            loading: false,
            error: error instanceof Error ? error.message : 'Đăng nhập thất bại',
          });
          throw error;
        }
      },

      register: async (data: RegisterRequest) => {
        try {
          set({ loading: true, error: null });

          const result = await authService.register(data);

          // Save auth data
          authService.setAuth(result.token, result.user);

          set({
            user: result.user as User,
            isAuthenticated: true,
            loading: false,
            error: null,
          });
        } catch (error) {
          set({
            loading: false,
            error: error instanceof Error ? error.message : 'Đăng ký thất bại',
          });
          throw error;
        }
      },

      logout: async () => {
        try {
          set({ loading: true, error: null });

          await authService.logout();

          set({
            user: null,
            isAuthenticated: false,
            loading: false,
            error: null,
          });
        } catch {
          // Still clear local auth even if API call fails
          authService.clearAuth();
          set({
            user: null,
            isAuthenticated: false,
            loading: false,
            error: null,
          });
        }
      },

      updateProfile: async (data: UpdateProfileRequest) => {
        try {
          set({ loading: true, error: null });

          const updatedUser = await authService.updateProfile(data);

          // Update local user data
          authService.setAuth(authService.getToken()!, updatedUser);

          set({
            user: updatedUser as User,
            loading: false,
            error: null,
          });
        } catch (error) {
          set({
            loading: false,
            error: error instanceof Error ? error.message : 'Cập nhật thông tin thất bại',
          });
          throw error;
        }
      },

      refreshUser: async () => {
        const { isAuthenticated } = get();
        if (!isAuthenticated) return;

        try {
          set({ loading: true, error: null });

          const user = await authService.getMe();

          // Update local user data
          authService.setAuth(authService.getToken()!, user);

          set({
            user: user as User,
            loading: false,
            error: null,
          });
        } catch (error) {
          set({
            loading: false,
            error: error instanceof Error ? error.message : 'Lấy thông tin người dùng thất bại',
          });
        }
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        // Only persist user and isAuthenticated, not loading/error states
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
