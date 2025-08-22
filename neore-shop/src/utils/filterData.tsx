import type { Product, User } from '../types';

export function filterData<T extends Product | User>(
  data: T[],
  searchQuery: string | null | undefined
): T[] {
  // Handle null/undefined search queries
  if (!searchQuery || !searchQuery.trim()) return data;

  const query = searchQuery.trim().toLowerCase();

  return data.filter((item) => {
    // For products
    if ('title' in item) {
      const product = item as Product;
      return (
        product.title.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
      );
    }

    // For users
    if ('firstName' in item) {
      const user = item as User;
      return (
        user.firstName.toLowerCase().includes(query) ||
        user.lastName.toLowerCase().includes(query) ||
        user.username.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
      );
    }

    return false;
  });
}
