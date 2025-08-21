import { useState, useEffect } from 'react';
import type { Product, StringFormData, ProductFormProps } from '../../types';
import './ProductForm.css';

export default function ProductForm({
  initialProduct,
  onSave,
  onCancel,
  isEditing = false,
  onDelete,
  loading = false,
}: ProductFormProps) {
  const [formData, setFormData] = useState<StringFormData | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialProduct) {
      const formState: StringFormData = {};
      for (const key in initialProduct) {
        const value = initialProduct[key as keyof Product];
        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
          formState[key as keyof StringFormData] = String(value);
        }
      }

      setFormData(formState);
    }
  }, [initialProduct]);

  const validateFields = (name: string, value: string): string | null => {
    const sanitizedValue = typeof value === 'string' ? value.trim() : value;
    switch (name) {
      case 'price':
      case 'stock': {
        const numericValue = parseFloat(sanitizedValue);
        if (isNaN(numericValue)) {
          return 'This field only accepts numbers.';
        }
        if (Number(sanitizedValue) < 0) {
          return 'This field cannot be negative.';
        }
        break;
      }
      case 'discountPercentage': {
        const percentageValue = parseFloat(sanitizedValue);
        if (isNaN(percentageValue)) {
          return 'This field only accepts numbers.';
        }
        if (Number(sanitizedValue) < 0) {
          return 'Discount cannot be negative.';
        }
        if (Number(sanitizedValue) > 100) {
          return 'Discount cannot be greater than 100.';
        }
        break;
      }
      case 'title':
        if (!sanitizedValue) {
          return 'Title is required.';
        }
        if (sanitizedValue.length > 50) {
          return 'Title cannot exceed 50 characters.';
        }
        break;

      case 'description':
        if (sanitizedValue.length > 1000) {
          return 'Description cannot exceed 1000 characters.';
        }
        break;
    }
    return '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const error = validateFields(name, value);
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(error || '');
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // We only parse the numbers for the fields that are ACTUALLY in our form.
    const priceAsNumber = parseFloat(formData?.price?.replace(',', '.') || '0');
    const discountAsNumber = parseFloat(formData?.discountPercentage?.replace(',', '.') || '0');

    if (!formData?.title || priceAsNumber <= 0) {
      setError('Product name and a valid price are required.');
      return;
    }

    const dataToSave: Product = {
      ...(initialProduct as Product),

      ...formData,

      price: priceAsNumber,
      discountPercentage: discountAsNumber,
      images: Array.isArray(formData?.images) ? formData.images : [],
    };

    setError('');
    onSave(dataToSave);
  };

  const calculateDiscountedPrice = () => {
    const price = parseFloat(String(formData?.price).replace(',', '.') || '0');
    const discount = parseFloat(String(formData?.discountPercentage).replace(',', '.') || '0');

    if (price > 0 && discount > 0) {
      const finalPrice = price - price * (discount / 100);
      return finalPrice.toFixed(2);
    }

    return price.toFixed(2);
  };

  const discountedPrice = calculateDiscountedPrice();

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      {error && <p className="form-error">{error}</p>}

      <div className="form-group">
        <label htmlFor="images">Images</label>
        <input
          id="images"
          name="images"
          type="file"
          multiple
          accept="image/*"
          value={formData?.images || ''}
          onChange={handleChange}
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label htmlFor="title">Product Title</label>
        <input
          id="title"
          name="title"
          type="text"
          value={formData?.title || ''}
          onChange={handleChange}
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData?.description || ''}
          onChange={handleChange}
          disabled={loading}
          rows={4}
        />
      </div>

      <div className="price-section">
        {/* Initial Price */}
        <div className="form-group">
          <label htmlFor="price">Initial Price</label>
          <input
            id="price"
            name="price"
            type="text"
            step="0.01"
            value={formData?.price || ''}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        {/* Discount Percentage */}
        <div className="form-group">
          <label htmlFor="discountPercentage">Discount Percentage (%)</label>
          <input
            id="discountPercentage"
            name="discountPercentage"
            type="text"
            step="0.01"
            value={formData?.discountPercentage || ''}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        {/* Discounted Price */}
        <div className="form-group">
          <label>Discounted Price</label>
          <p className="calculated-price">
            <strong>${discountedPrice}</strong>
          </p>
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : isEditing ? 'Update Product' : 'Create Product'}
        </button>

        <button type="button" onClick={onCancel} disabled={loading}>
          Cancel
        </button>

        {isEditing && onDelete && (
          <button type="button" className="delete-button" onClick={onDelete} disabled={loading}>
            Delete
          </button>
        )}
      </div>
    </form>
  );
}
