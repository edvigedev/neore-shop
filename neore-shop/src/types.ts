export interface Product {
  id: number;
  thumbnail: string;
  title: string;
  price: number;
  discountPercentage: number;
  description: string;
  images: string[];
  rating: number;
  category: string;
  stock: number;
}

// User-related interfaces for API responses

export interface UsersResponse {
  users: User[];
  total: number;
  skip: number;
  limit: number;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  role: 'admin' | 'moderator' | 'user';
}

// The main UserDetails interface
export interface UserDetails {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'admin' | 'moderator' | 'user';
}

export interface Carts {
  carts: Cart[];
}

export interface Cart {
  id: number;
  total: number;
  skip: number;
  limit: number;
  products: Product[];
  discountedTotal: number;
  userId: number;
  totalProducts: number;
  totalQuantity: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  decreaseQuantity: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getCartItem: (productId: number) => CartItem | undefined;
  totalPrice: number;
  totalQuantity: number;
}

export type StringFormData = {
  [K in keyof Omit<Product, 'id' | 'stock' | 'rating'>]?: string;
};

export interface AuthResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  accessToken: string;
  refreshToken: string;
  role?: 'admin' | 'user';
}

// Simpler type for what we store as the authenticated user
export type AuthenticatedUser = Omit<AuthResponse, 'accessToken' | 'refreshToken'>;

export interface ProductFormProps {
  initialProduct?: Product;
  onSave: (product: Product) => void;
  onCancel: () => void;
  isEditing?: boolean;
  onDelete?: () => void;
  loading?: boolean;
}
