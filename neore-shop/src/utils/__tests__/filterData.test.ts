import { describe, it, expect } from 'vitest';
import { filterData } from '../filterData';
import type { Product, User } from '../../types';

describe('filterData', () => {
  const mockProducts: Product[] = [
    {
      id: 1,
      title: 'iPhone 9',
      description: 'An apple mobile which is nothing like apple',
      price: 549,
      discountPercentage: 12.96,
      rating: 4.69,
      thumbnail: 'https://example.com/iphone9.jpg',
      images: ['https://example.com/iphone9.jpg'],
      category: 'smartphones',
      stock: 1,
    },
    {
      id: 2,
      title: 'Samsung Galaxy',
      description: 'Latest Samsung smartphone with advanced features',
      price: 699,
      discountPercentage: 8.5,
      rating: 4.2,
      thumbnail: 'https://example.com/samsung.jpg',
      images: ['https://example.com/samsung.jpg'],
      category: 'smartphones',
      stock: 3,
    },
    {
      id: 3,
      title: 'MacBook Pro',
      description: 'Professional laptop for developers',
      price: 1999,
      discountPercentage: 5.0,
      rating: 4.8,
      thumbnail: 'https://example.com/macbook.jpg',
      images: ['https://example.com/macbook.jpg'],
      category: 'laptops',
      stock: 5,
    },
  ];

  const mockUsers: User[] = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe',
      email: 'john@example.com',
      role: 'user',
    },
    {
      id: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      username: 'janesmith',
      email: 'jane@example.com',
      role: 'admin',
    },
  ];

  describe('Product filtering', () => {
    it('should return all products when search query is empty', () => {
      const result = filterData(mockProducts, '');
      expect(result).toHaveLength(3);
      expect(result).toEqual(mockProducts);
    });

    it('should return all products when search query is only whitespace', () => {
      const result = filterData(mockProducts, '   ');
      expect(result).toHaveLength(3);
      expect(result).toEqual(mockProducts);
    });

    it('should filter products by title', () => {
      const result = filterData(mockProducts, 'iPhone');
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('iPhone 9');
    });

    it('should filter products by category', () => {
      const result = filterData(mockProducts, 'laptops');
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('MacBook Pro');
    });

    it('should filter products by description', () => {
      const result = filterData(mockProducts, 'apple');
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('iPhone 9');
    });

    it('should handle case insensitive search', () => {
      const result = filterData(mockProducts, 'IPHONE');
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('iPhone 9');
    });

    it('should handle partial matches', () => {
      const result = filterData(mockProducts, 'phone');
      expect(result).toHaveLength(2); // Expect 2 matches: iPhone and Samsung Galaxy
      expect(result.map((p) => p.title)).toContain('iPhone 9');
      expect(result.map((p) => p.title)).toContain('Samsung Galaxy');
    });

    it('should return empty array when no matches found', () => {
      const result = filterData(mockProducts, 'nonexistent');
      expect(result).toHaveLength(0);
    });

    it('should handle whitespace in search query', () => {
      const result = filterData(mockProducts, '  iPhone  ');
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('iPhone 9');
    });
  });

  describe('User filtering', () => {
    it('should return all users when search query is empty', () => {
      const result = filterData(mockUsers, '');
      expect(result).toHaveLength(2);
      expect(result).toEqual(mockUsers);
    });

    it('should filter users by firstName', () => {
      const result = filterData(mockUsers, 'John');
      expect(result).toHaveLength(1);
      expect(result[0].firstName).toBe('John');
    });

    it('should filter users by lastName', () => {
      const result = filterData(mockUsers, 'Smith');
      expect(result).toHaveLength(1);
      expect(result[0].lastName).toBe('Smith');
    });

    it('should filter users by username', () => {
      const result = filterData(mockUsers, 'johndoe');
      expect(result).toHaveLength(1);
      expect(result[0].username).toBe('johndoe');
    });

    it('should filter users by email', () => {
      const result = filterData(mockUsers, 'jane@example.com');
      expect(result).toHaveLength(1);
      expect(result[0].email).toBe('jane@example.com');
    });

    it('should handle case insensitive search for users', () => {
      const result = filterData(mockUsers, 'JOHN');
      expect(result).toHaveLength(1);
      expect(result[0].firstName).toBe('John');
    });

    it('should return empty array when no user matches found', () => {
      const result = filterData(mockUsers, 'nonexistent');
      expect(result).toHaveLength(0);
    });
  });

  describe('Edge cases', () => {
    it('should handle empty data array', () => {
      const result = filterData([], 'test');
      expect(result).toHaveLength(0);
    });

    it('should handle null/undefined search query', () => {
      const result = filterData(mockProducts, null as unknown as string);
      expect(result).toEqual(mockProducts);
    });

    it('should handle mixed data types', () => {
      const mixedData = [...mockProducts, ...mockUsers];
      const result = filterData(mixedData, 'iPhone');
      expect(result).toHaveLength(1);
      expect((result[0] as Product).title).toBe('iPhone 9');
    });
  });
});
