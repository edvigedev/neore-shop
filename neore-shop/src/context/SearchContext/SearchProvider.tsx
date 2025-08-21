import { useState, type ReactNode } from 'react';
import { SearchContext } from './SearchContext';

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [globalSearch, setGlobalSearch] = useState('');

  return (
    <SearchContext.Provider value={{ globalSearch, setGlobalSearch }}>
      {children}
    </SearchContext.Provider>
  );
};
