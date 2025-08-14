// import { createContext, useContext } from 'react';
// import { type Product, type CartItem } from '../../types';
// import type { User } from '../../types';

// interface AppContextType {
//   // Cart-related state and functions
//   cartItems: CartItem[];
//   addToCart: (product: Product, quantity?: number) => void;
//   removeFromCart: (productId: number) => void;
//   updateQuantity: (productId: number, quantity: number) => void;
//   clearCart: () => void;
//   totalPrice: number;
//   totalQuantity: number;
//   getCartItem: (productId: number) => CartItem | undefined;

//   favorites: Product[];
//   addFavorite: (product: Product) => void;
//   removeFavorite: (product: Product) => void;
//   isFavorite: (productId: number) => boolean;

//   user: User | null;
//   login: (token: string) => void;
//   logout: () => void;

//   // Future: Product wishlist state
//   // wishlist: Product[];
//   // addToWishlist: (product: Product) => void;
//   // removeFromWishlist: (productId: number) => void;
// }

// const AppContext = createContext<AppContextType | undefined>(undefined);

// /**
//  * Custom hook to consume the AppContext
//  * @throws {Error} When used outside of AppProvider
//  * @returns {AppContextType} The global application state
//  */

// // eslint-disable-next-line react-refresh/only-export-components
// export const useAppContext = (): AppContextType => {
//   const context = useContext(AppContext);

//   if (context === undefined) {
//     throw new Error('useAppContext must be used within an AppProvider');
//   }

//   return context;
// };

// export { AppContext };
// export type { AppContextType };
