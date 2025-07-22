'use client';

import React, { createContext, useContext } from 'react';
import { Car, CartItem } from '@/types';

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  isLoading: boolean;
}

interface CartContextType extends CartState {
  addItem: (car: Car) => void;
  removeItem: (carId: string) => void;
  updateQuantity: (carId: string, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (carId: string) => number;
}

// Create a simplified context with default empty implementations
const CartContext = createContext<CartContextType>({
  items: [],
  totalItems: 0,
  totalPrice: 0,
  isLoading: false,
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  getItemQuantity: () => 0
});

// Simple provider that returns the default context
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <CartContext.Provider value={CartContext._currentValue}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  return useContext(CartContext);
};

export default CartContext;
