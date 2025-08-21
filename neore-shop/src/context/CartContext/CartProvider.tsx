import { useState, useEffect, useMemo } from 'react';
import type { Product, CartItem } from '../../types';
import { CartContext } from './CartContext';

const CART_KEY = 'neoreShopCart';

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Failed to load cart from localStorage', error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
    } catch (error) {
      console.error('Failed to save cart to localStorage', error);
    }
  }, [cartItems]);

  const addToCart = (product: Product, quantity: number = 1) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.product.id === product.id);

      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;

        // Check if the new quantity exceeds the limit
        if (newQuantity > 10) {
          alert('You cannot have more than 10 units of the same product.');
          // Cap the quantity at 10 instead of increasing it
          return prev.map((item) =>
            item.product.id === product.id ? { ...item, quantity: 10 } : item
          );
        } else {
          // If within the limit, update as normal
          return prev.map((item) =>
            item.product.id === product.id ? { ...item, quantity: newQuantity } : item
          );
        }
      } else {
        // If it's a new item, just add it to the cart
        return [...prev, { product, quantity }];
      }
    });
  };

  const updateQuantity = (productId: number, newQuantity: number) => {
    // Maintains the limit of 10 items per product even if the select range changes to > 10
    if (newQuantity > 10) {
      alert('You cannot have more than 10 units of the same product.');
      newQuantity = 10; // Enforce the limit
    }

    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (productId: number) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const decreaseQuantity = (productId: number) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.product.id === productId);

      if (!existingItem) return prev;

      if (existingItem.quantity === 1) {
        // If quantity is 1, remove the item completely
        return prev.filter((item) => item.product.id !== productId);
      } else {
        // Decrease quantity by 1
        return prev.map((item) =>
          item.product.id === productId ? { ...item, quantity: item.quantity - 1 } : item
        );
      }
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totalPrice = useMemo(() => {
    return cartItems.reduce((total, item) => {
      const discountedPrice = item.product.price * (1 - item.product.discountPercentage / 100);
      return total + discountedPrice * item.quantity;
    }, 0);
  }, [cartItems]);

  const totalQuantity = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  const getCartItem = (productId: number) => {
    return cartItems.find((item) => item.product.id === productId);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    decreaseQuantity,
    updateQuantity,
    clearCart,
    totalPrice,
    totalQuantity,
    getCartItem,
  };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
