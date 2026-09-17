import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { MenuItem, CartItem } from '../types';

export interface CartContextType {
  items: CartItem[];
  addItem: (item: MenuItem, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  totalCount: number;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('gotham_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync cart state with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('gotham_cart', JSON.stringify(items));
    } catch (err) {
      console.warn('Failed to save cart to localStorage:', err);
    }
  }, [items]);

  const addItem = (item: MenuItem, quantity = 1): void => {
    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.item._id === item._id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [...prev, { item, quantity }];
    });
  };

  const removeItem = (itemId: string): void => {
    setItems((prev) => prev.filter((i) => i.item._id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number): void => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.item._id === itemId ? { ...i, quantity } : i))
    );
  };

  const clearCart = (): void => {
    setItems([]);
  };

  const subtotal = items.reduce((acc, i) => acc + i.item.price * i.quantity, 0);
  const totalCount = items.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        subtotal,
        totalCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
