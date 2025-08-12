import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router';

import App from './App.tsx';
import ProductDetails from './pages/ProductDetails/ProductDetails.tsx';
import Favorites from './pages/Favorites/Favorites.tsx';
import Cart from './pages/Cart/Cart.tsx';
import Users from './pages/Users/Users.tsx';
import UserDetails from './pages/UsersDetails/UserDetails.tsx';
import { AppProvider } from './context/AppContext/AppProvider.tsx';
import Login from './pages/Login/Login.tsx';
import { AuthProvider } from './context/AuthContext/AuthProvider.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <AppProvider>
        <BrowserRouter basename="/neore-shop/">
          <Routes>
            <Route index element={<App />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/users" element={<Users />} />
            <Route path="/users/:id" element={<UserDetails />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </AuthProvider>
  </StrictMode>
);
