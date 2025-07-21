import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  address?: string;
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Omit<User, 'id'> & { password: string }) => Promise<boolean>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => void;
}

// Mock users data - trong thực tế sẽ kết nối với database
const mockUsers: (User & { password: string })[] = [
  {
    id: '1',
    email: 'admin@vinfast.com',
    name: 'Admin VinFast',
    phone: '0123456789',
    address: 'Hà Nội',
    password: 'admin123'
  }
];

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      
      login: async (email: string, password: string) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const user = mockUsers.find(u => u.email === email && u.password === password);
        
        if (user) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { password, ...userWithoutPassword } = user;
          set({
            user: userWithoutPassword,
            isAuthenticated: true
          });
          return true;
        }
        
        return false;
      },
      
      register: async (userData) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Check if user already exists
        const existingUser = mockUsers.find(u => u.email === userData.email);
        if (existingUser) {
          return false;
        }
        
        // Create new user
        const newUser = {
          id: Date.now().toString(),
          ...userData
        };
        
        mockUsers.push(newUser);
        
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...userWithoutPassword } = newUser;
        set({
          user: userWithoutPassword,
          isAuthenticated: true
        });
        
        return true;
      },
      
      logout: () => {
        set({
          user: null,
          isAuthenticated: false
        });
      },
      
      updateProfile: (userData) => {
        const currentUser = get().user;
        if (currentUser) {
          const updatedUser = { ...currentUser, ...userData };
          set({ user: updatedUser });
          
          // Update in mock data
          const userIndex = mockUsers.findIndex(u => u.id === currentUser.id);
          if (userIndex !== -1) {
            mockUsers[userIndex] = { ...mockUsers[userIndex], ...userData };
          }
        }
      }
    }),
    {
      name: 'auth-storage',
    }
  )
);
