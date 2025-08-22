import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Product } from '../../types';
import ProductForm from '../../components/ProductForm/ProductForm';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import FetchingError from '../../components/FetchingError/FetchingError';
import './EditProductPage.css';
import { getErrorMessage } from '../../utils/getErrorMessage';

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [initialProduct, setInitialProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    async function fetchProduct() {
      const response = await fetch(`https://dummyjson.com/products/${id}`);
      if (!response.ok) {
        throw new Error(getErrorMessage(response));
      }
      const data = await response.json();
      setInitialProduct(data);
    }
    fetchProduct()
      .catch((error) => {
        setError(getErrorMessage(error));
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleSave = async (updatedProductData: Product) => {
    setLoading(true);
    setError('');
    console.log('Faking PUT request with data:', updatedProductData);

    try {
      const response = await fetch(`https://dummyjson.com/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: updatedProductData.title,
          price: updatedProductData.price,
          description: updatedProductData.description,
          discountPercentage: updatedProductData.discountPercentage,
        }),
      });
      const result = await response.json();
      console.log('API Response:', result);
      alert('Product updated successfully!');
      navigate('/admin');
    } catch (error) {
      console.error('Error updating product:', error);
      setError('Failed to update product.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin');
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <FetchingError />;
  if (!initialProduct) return <p>Product not found.</p>;

  return (
    <div>
      <h1 className="edit-product-page-title" data-testid="edit-product-page-title">
        Edit: {initialProduct.title}
      </h1>
      <ProductForm
        initialProduct={initialProduct}
        onSave={handleSave}
        onCancel={handleCancel}
        isEditing={true}
        loading={loading}
      />
    </div>
  );
}
