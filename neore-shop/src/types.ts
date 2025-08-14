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

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Address {
  address: string;
  city: string;
  state: string;
  stateCode: string;
  postalCode: string;
  coordinates: Coordinates;
  country: string;
}

export interface Hair {
  color: string;
  type: string;
}

export interface Bank {
  cardExpire: string;
  cardNumber: string;
  cardType: string;
  currency: string;
  iban: string;
}

export interface Company {
  department: string;
  name: string;
  title: string;
  address: Address;
}

export interface Crypto {
  coin: string;
  wallet: string;
  network: string;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  maidenName: string;
  age: number;
  gender: string;
  email: string;
  phone: string;
  username: string;
  password: string;
  birthDate: string;
  image: string;
  bloodGroup: string;
  height: number;
  weight: number;
  eyeColor: string;
  hair: Hair;
  ip: string;
  address: Address;
  macAddress: string;
  university: string;
  bank: Bank;
  company: Company;
  ein: string;
  ssn: string;
  userAgent: string;
  crypto: Crypto;
  role: 'admin' | 'moderator' | 'user';
}

export interface UsersResponse {
  users: User[];
  total: number;
  skip: number;
  limit: number;
}

// Interface for geographic coordinates
export interface Coordinates {
  lat: number;
  lng: number;
}

// Interface for address details, used for both user and company
export interface Address {
  address: string;
  city: string;
  state: string;
  stateCode: string;
  postalCode: string;
  coordinates: Coordinates;
  country: string;
}

// Interface for the user's hair properties
export interface Hair {
  color: string;
  type: string;
}

// Interface for the user's bank details
export interface Bank {
  cardExpire: string;
  cardNumber: string;
  cardType: string;
  currency: string;
  iban: string;
}

// Interface for the user's company information
export interface Company {
  department: string;
  name: string;
  title: string;
  address: Address; // Reusing the Address interface
}

// Interface for the user's cryptocurrency details
export interface Crypto {
  coin: string;
  wallet: string;
  network: string;
}

// The main UserDetails interface
export interface UserDetails {
  id: number;
  firstName: string;
  lastName: string;
  maidenName: string;
  age: number;
  gender: 'female' | 'male' | 'other'; // Using literal types for specificity
  email: string;
  phone: string;
  username: string;
  password: string; // Note: Storing passwords in plaintext is not recommended
  birthDate: string;
  image: string;
  bloodGroup: string;
  height: number;
  weight: number;
  eyeColor: string;
  hair: Hair;
  ip: string;
  address: Address;
  macAddress: string;
  university: string;
  bank: Bank;
  company: Company;
  ein: string;
  ssn: string;
  userAgent: string;
  crypto: Crypto;
  role: 'admin' | 'moderator' | 'user'; // Using literal types for roles
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
