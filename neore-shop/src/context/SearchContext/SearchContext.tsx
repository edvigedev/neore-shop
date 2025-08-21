import { createContext, useContext } from 'react';

interface SearchContextType {
  globalSearch: string;
  setGlobalSearch: (search: string) => void;
}
// eslint-disable-next-line
export const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const useSearch = () => {
  const context = useContext(SearchContext);
  // If the context is undefined, it means we are using the hook outside of the provider
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};
