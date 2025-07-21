import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Car } from '@/data/cars';

export interface CartItem {
  car: Car;
  quantity: number;
  selectedColor: string;
  depositAmount: number;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (car: Car, selectedColor: string, depositAmount: number) => void;
  removeItem: (carId: string) => void;
  updateQuantity: (carId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalAmount: () => number;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      
      addItem: (car: Car, selectedColor: string, depositAmount: number) => {
        const items = get().items;
        const existingItem = items.find(item => item.car.id === car.id);
        
        if (existingItem) {
          set({
            items: items.map(item =>
              item.car.id === car.id
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
          items: get().items.filter(item => item.car.id !== carId)
        });
      },
      
      updateQuantity: (carId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(carId);
          return;
        }
        
        set({
          items: get().items.map(item =>
            item.car.id === carId
              ? { ...item, quantity }
              : item
          )
        });
      },
      
      clearCart: () => {
        set({ items: [] });
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
    }),
    {
      name: 'cart-storage',
    }
  )
);
