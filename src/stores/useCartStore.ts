import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Car } from '@/services/cars';
import { CreateOrderRequest, CustomerInfo } from '@/services/orders';
import { PAYMENT_METHODS } from '@/lib/constants';
import ordersService from '@/services/orders';

export interface CartItem {
  car: Car;
  quantity: number;
  selectedColor: string;
  depositAmount: number;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  loading: boolean;
  error: string | null;
  addItem: (car: Car, selectedColor: string, depositAmount: number) => void;
  removeItem: (carId: string) => void;
  updateQuantity: (carId: string, quantity: number) => void;
  updateItem: (carId: string, updates: Partial<Omit<CartItem, 'car'>>) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalAmount: () => number;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  checkout: (customerInfo: CustomerInfo, paymentMethod: (typeof PAYMENT_METHODS)[keyof typeof PAYMENT_METHODS], notes?: string) => Promise<void>;
  clearError: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      loading: false,
      error: null,

      addItem: (car: Car, selectedColor: string, depositAmount: number) => {
        const items = get().items;
        const existingItem = items.find(item => item.car._id === car._id);

        if (existingItem) {
          set({
            items: items.map(item =>
              item.car._id === car._id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          });
        } else {
          set({
            items: [...items, { car, quantity: 1, selectedColor, depositAmount }]
          });
        }
      },

      removeItem: (carId: string) => {
        set({
          items: get().items.filter(item => item.car._id !== carId)
        });
      },

      updateQuantity: (carId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(carId);
          return;
        }

        set({
          items: get().items.map(item =>
            item.car._id === carId
              ? { ...item, quantity }
              : item
          )
        });
      },

      updateItem: (carId: string, updates: Partial<Omit<CartItem, 'car'>>) => {
        set({
          items: get().items.map(item =>
            item.car._id === carId
              ? { ...item, ...updates }
              : item
          )
        });
      },

      clearCart: () => {
        set({ items: [], error: null });
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalAmount: () => {
        return get().items.reduce((total, item) => total + (item.depositAmount * item.quantity), 0);
      },

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set({ isOpen: !get().isOpen }),

      checkout: async (customerInfo: CustomerInfo, paymentMethod: (typeof PAYMENT_METHODS)[keyof typeof PAYMENT_METHODS], notes?: string) => {
        try {
          set({ loading: true, error: null });

          const items = get().items;
          if (items.length === 0) {
            throw new Error('Giỏ hàng trống');
          }

          const orderData: CreateOrderRequest = {
            items: items.map(item => ({
              car: item.car._id,
              quantity: item.quantity,
              selectedColor: item.selectedColor,
              depositAmount: item.depositAmount,
            })),
            customerInfo,
            payment: {
              method: paymentMethod,
            },
            notes: notes ? { customer: notes } : undefined,
          };

          await ordersService.createOrder(orderData);

          // Clear cart after successful order
          set({
            items: [],
            loading: false,
            error: null,
            isOpen: false
          });
        } catch (error) {
          set({
            loading: false,
            error: error instanceof Error ? error.message : 'Đặt hàng thất bại',
          });
          throw error;
        }
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({
        // Only persist items, not loading/error states
        items: state.items,
        isOpen: state.isOpen,
      }),
    }
  )
);
