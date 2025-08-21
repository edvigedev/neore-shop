import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router';

import App from './App.tsx';
import ProductDetails from './pages/ProductDetails/ProductDetails.tsx';
import Favorites from './pages/Favorites/Favorites.tsx';
import Cart from './pages/Cart/Cart.tsx';
import Users from './pages/Users/Users.tsx';
import UserDetails from './pages/UsersDetails/UserDetails.tsx';
// import { AppProvider } from './context/AppContext/AppProvider.tsx';
import { CartProvider } from './context/CartContext/CartProvider.tsx';
import { FavoriteProvider } from './context/FavoriteContext/FavoriteProvider.tsx';
import Login from './pages/Login/Login.tsx';
import { AuthProvider } from './context/AuthContext/AuthProvider.tsx';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute.tsx';
import ProtectedLayout from './components/ProtectedRoute/ProtectedLayout.tsx';
import AdminGuard from './components/ProtectedRoute/AdminGuard.tsx';
import AdminPage from './pages/AdminPage/AdminPage.tsx';
import EditProductPage from './pages/EditProductPage/EditProductPage.tsx';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary.tsx';
import { SearchProvider } from './context/SearchContext/SearchProvider';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        <FavoriteProvider>
          <SearchProvider>
            <BrowserRouter basename="/neore-shop/">
              <ErrorBoundary>
                <Routes>
                  {/*                  1. PUBLIC ROUTES                    */}
                  <Route path="/login" element={<Login />} />
                  <Route index element={<App />} />
                  <Route path="/products/:id" element={<ProductDetails />} />
                  <Route path="/cart" element={<Cart />} />
                  {/*              2. GENERAL PROTECTED ROUTES             */}
                  <Route
                    element={
                      <ProtectedRoute>
                        <ProtectedLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route path="favorites" element={<Favorites />} />
                  </Route>
                  {/*              3. ADMIN-ONLY PROTECTED ROUTES          */}
                  <Route
                    path="/admin"
                    element={
                      <ErrorBoundary>
                        <AdminGuard>
                          <ProtectedLayout />
                        </AdminGuard>
                      </ErrorBoundary>
                    }
                  >
                    <Route index element={<AdminPage />} />
                    <Route path="users" element={<Users />} />
                    <Route path="users/:id" element={<UserDetails />} />
                    <Route path="products/:id" element={<EditProductPage />} />
                  </Route>
                </Routes>
              </ErrorBoundary>
            </BrowserRouter>
          </SearchProvider>
        </FavoriteProvider>
      </CartProvider>
    </AuthProvider>
  </StrictMode>
);
