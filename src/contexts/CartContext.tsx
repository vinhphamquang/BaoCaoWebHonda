'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Car, CartItem } from '@/types';
import { storage } from '@/lib/utils';

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  isLoading: boolean;
}

type CartAction =
  | { type: 'LOAD_CART'; payload: CartItem[] }
  | { type: 'ADD_ITEM'; payload: Car }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { carId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_LOADING'; payload: boolean };

interface CartContextType extends CartState {
  addItem: (car: Car) => void;
  removeItem: (carId: string) => void;
  updateQuantity: (carId: string, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (carId: string) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'LOAD_CART':
      const loadedItems = action.payload;
      return {
        ...state,
        items: loadedItems,
        totalItems: loadedItems.reduce((sum, item) => sum + item.quantity, 0),
        totalPrice: loadedItems.reduce((sum, item) => sum + (item.car.price * item.quantity), 0),
        isLoading: false,
      };

    case 'ADD_ITEM':
      const existingItemIndex = state.items.findIndex(item => item.car._id === action.payload._id);
      let newItems: CartItem[];

      if (existingItemIndex >= 0) {
        // Item already exists, increase quantity
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // New item, add to cart
        newItems = [...state.items, { car: action.payload, quantity: 1 }];
      }

      return {
        ...state,
        items: newItems,
        totalItems: newItems.reduce((sum, item) => sum + item.quantity, 0),
        totalPrice: newItems.reduce((sum, item) => sum + (item.car.price * item.quantity), 0),
      };

    case 'REMOVE_ITEM':
      const filteredItems = state.items.filter(item => item.car._id !== action.payload);
      return {
        ...state,
        items: filteredItems,
        totalItems: filteredItems.reduce((sum, item) => sum + item.quantity, 0),
        totalPrice: filteredItems.reduce((sum, item) => sum + (item.car.price * item.quantity), 0),
      };

    case 'UPDATE_QUANTITY':
      const updatedItems = state.items.map(item =>
        item.car._id === action.payload.carId
          ? { ...item, quantity: action.payload.quantity }
          : item
      ).filter(item => item.quantity > 0);

      return {
        ...state,
        items: updatedItems,
        totalItems: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
        totalPrice: updatedItems.reduce((sum, item) => sum + (item.car.price * item.quantity), 0),
      };

    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        totalItems: 0,
        totalPrice: 0,
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };

    default:
      return state;
  }
};

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  isLoading: true,
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = storage.get('cart') || [];
    dispatch({ type: 'LOAD_CART', payload: savedCart });
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!state.isLoading) {
      storage.set('cart', state.items);
    }
  }, [state.items, state.isLoading]);

  const addItem = (car: Car) => {
    dispatch({ type: 'ADD_ITEM', payload: car });
  };

  const removeItem = (carId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: carId });
  };

  const updateQuantity = (carId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(carId);
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { carId, quantity } });
    }
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getItemQuantity = (carId: string): number => {
    const item = state.items.find(item => item.car._id === carId);
    return item ? item.quantity : 0;
  };

  const value: CartContextType = {
    ...state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getItemQuantity,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
