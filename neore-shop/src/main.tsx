import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router';

import App from './App.tsx';
import ProductDetails from './pages/ProductDetails/ProductDetails.tsx';
import Favorites from './pages/Favorites/Favorites.tsx';
import Users from './pages/Users/Users.tsx';
import UserDetails from './pages/UsersDetails/UserDetails.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename="/neore-shop/">
      <Routes>
        <Route index element={<App />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/users" element={<Users />} />
        <Route path="/users/:id" element={<UserDetails />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
