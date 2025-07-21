import { useState, useEffect, useCallback } from 'react';
import { useMutation } from './useApi';
import authService, { 
  User, 
  LoginRequest, 
  RegisterRequest, 
  UpdateProfileRequest, 
  UpdatePasswordRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest 
} from '@/services/auth';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface UseAuthReturn extends AuthState {
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: UpdateProfileRequest) => Promise<void>;
  updatePassword: (data: UpdatePasswordRequest) => Promise<void>;
  forgotPassword: (data: ForgotPasswordRequest) => Promise<void>;
  resetPassword: (token: string, data: ResetPasswordRequest) => Promise<void>;
  refreshUser: () => Promise<void>;
  clearError: () => void;
}

export function useAuth(): UseAuthReturn {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    loading: true,
    error: null,
  });

  // Mutations
  const loginMutation = useMutation(authService.login);
  const registerMutation = useMutation(authService.register);
  const logoutMutation = useMutation(authService.logout);
  const updateProfileMutation = useMutation(authService.updateProfile);
  const updatePasswordMutation = useMutation(authService.updatePassword);
  const forgotPasswordMutation = useMutation(authService.forgotPassword);
  const resetPasswordMutation = useMutation((params: { token: string; data: ResetPasswordRequest }) =>
    authService.resetPassword(params.token, params.data)
  );

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = authService.getToken();
        const user = authService.getUser();
        
        if (token && user) {
          // Verify token by fetching current user
          try {
            const currentUser = await authService.getMe();
            setState({
              user: currentUser,
              isAuthenticated: true,
              loading: false,
              error: null,
            });
          } catch {
            // Token invalid, clear auth
            authService.clearAuth();
            setState({
              user: null,
              isAuthenticated: false,
              loading: false,
              error: null,
            });
          }
        } else {
          setState({
            user: null,
            isAuthenticated: false,
            loading: false,
            error: null,
          });
        }
      } catch (error) {
        setState({
          user: null,
          isAuthenticated: false,
          loading: false,
          error: error instanceof Error ? error.message : 'Có lỗi xảy ra',
        });
      }
    };

    initAuth();
  }, []);

  // Login
  const login = useCallback(async (data: LoginRequest) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const result = await loginMutation.mutate(data);
      
      // Save auth data
      authService.setAuth(result.token, result.user);
      
      setState({
        user: result.user,
        isAuthenticated: true,
        loading: false,
        error: null,
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Đăng nhập thất bại',
      }));
      throw error;
    }
  }, [loginMutation]);

  // Register
  const register = useCallback(async (data: RegisterRequest) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const result = await registerMutation.mutate(data);
      
      // Save auth data
      authService.setAuth(result.token, result.user);
      
      setState({
        user: result.user,
        isAuthenticated: true,
        loading: false,
        error: null,
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Đăng ký thất bại',
      }));
      throw error;
    }
  }, [registerMutation]);

  // Logout
  const logout = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      await logoutMutation.mutate();
      
      // Clear auth data
      authService.clearAuth();
      
      setState({
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      });
    } catch {
      // Still clear local auth even if API call fails
      authService.clearAuth();
      setState({
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      });
    }
  }, [logoutMutation]);

  // Update profile
  const updateProfile = useCallback(async (data: UpdateProfileRequest) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const updatedUser = await updateProfileMutation.mutate(data);
      
      // Update local user data
      authService.setAuth(authService.getToken()!, updatedUser);
      
      setState(prev => ({
        ...prev,
        user: updatedUser,
        loading: false,
        error: null,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Cập nhật thông tin thất bại',
      }));
      throw error;
    }
  }, [updateProfileMutation]);

  // Update password
  const updatePassword = useCallback(async (data: UpdatePasswordRequest) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      await updatePasswordMutation.mutate(data);
      setState(prev => ({ ...prev, loading: false, error: null }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Đổi mật khẩu thất bại',
      }));
      throw error;
    }
  }, [updatePasswordMutation]);

  // Forgot password
  const forgotPassword = useCallback(async (data: ForgotPasswordRequest) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      await forgotPasswordMutation.mutate(data);
      setState(prev => ({ ...prev, loading: false, error: null }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Gửi email thất bại',
      }));
      throw error;
    }
  }, [forgotPasswordMutation]);

  // Reset password
  const resetPassword = useCallback(async (token: string, data: ResetPasswordRequest) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      await resetPasswordMutation.mutate({ token, data });
      setState(prev => ({ ...prev, loading: false, error: null }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Đặt lại mật khẩu thất bại',
      }));
      throw error;
    }
  }, [resetPasswordMutation]);

  // Refresh user data
  const refreshUser = useCallback(async () => {
    if (!state.isAuthenticated) return;
    
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const user = await authService.getMe();
      
      // Update local user data
      authService.setAuth(authService.getToken()!, user);
      
      setState(prev => ({
        ...prev,
        user,
        loading: false,
        error: null,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Lấy thông tin người dùng thất bại',
      }));
    }
  }, [state.isAuthenticated]);

  // Clear error
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    updatePassword,
    forgotPassword,
    resetPassword,
    refreshUser,
    clearError,
  };
}

export default useAuth;
