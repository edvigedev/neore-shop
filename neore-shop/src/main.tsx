import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router';

import App from './App.tsx';
import ProductDetails from './pages/ProductDetails/ProductDetails.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename="/neore-shop/">
      <Routes>
        <Route index element={<App />} />
        <Route path="/products/:id" element={<ProductDetails />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
