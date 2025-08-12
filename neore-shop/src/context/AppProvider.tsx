import { type ReactNode } from 'react';
import { AppContext } from './AppContext';
import { useCart } from '../hooks/useCart';
import { useFavorites } from '../hooks/useFavorites';

/**
 * Props for the AppProvider component
 */
interface AppProviderProps {
  children: ReactNode;
}

/**
 * Main provider component that combines all global state hooks
 * This component serves as the single source of truth for your application
 *
 * @param children - React components that will consume the context
 * @returns JSX.Element - The provider wrapping your app
 */
export const AppProvider = ({ children }: AppProviderProps): JSX.Element => {
  // Use your existing custom hooks
  const cartState = useCart();
  const favoritesState = useFavorites();

  // Combine all state into a single context value
  const contextValue = {
    // Cart state
    cartItems: cartState.cartItems,
    addToCart: cartState.addToCart,
    removeFromCart: cartState.removeFromCart,
    updateQuantity: cartState.updateQuantity,
    clearCart: cartState.clearCart,
    totalPrice: cartState.totalPrice,
    totalQuantity: cartState.totalQuantity,
    getCartItem: cartState.getCartItem,

    // Favorites state
    favorites: favoritesState.favorites,
    addFavorite: favoritesState.addFavorite,
    removeFavorite: favoritesState.removeFavorite,
    isFavorite: favoritesState.isFavorite,

    // Future: User authentication
    // user: userState.user,
    // login: userState.login,
    // logout: userState.logout,

    // Future: Product wishlist
    // wishlist: wishlistState.wishlist,
    // addToWishlist: wishlistState.addToWishlist,
    // removeFromWishlist: wishlistState.removeFromWishlist,
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};
