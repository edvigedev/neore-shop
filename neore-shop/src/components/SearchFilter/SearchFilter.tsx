import { useState } from 'react';
import './SearchFilter.css';

interface SearchFilterProps {
  placeholder: string;
  onSearch: (query: string) => void;
  className?: string;
}

export default function SearchFilter({ placeholder, onSearch, className }: SearchFilterProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch(value);
  };

  const handleClear = () => {
    setSearchQuery('');
    onSearch('');
  };

  return (
    <div className="search-container">
      <input
        id="search-input"
        type="text"
        placeholder={placeholder}
        onChange={handleSearch}
        value={searchQuery}
        className={className}
      />
      {searchQuery && (
        <button onClick={handleClear} className="clear-search-button">
          x
        </button>
      )}
    </div>
  );
}
