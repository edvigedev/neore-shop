import { useState, useEffect } from 'react';
import './SearchFilter.css';
import { useSearch } from '../../context/SearchContext/SearchContext';

interface SearchFilterProps {
  placeholder: string;
  onSearch: (query: string) => void;
  className?: string;
  'data-testid'?: string;
}

export default function SearchFilter({
  placeholder,
  onSearch,
  className,
  'data-testid': dataTestId,
}: SearchFilterProps) {
  const { globalSearch } = useSearch();
  const [searchQuery, setSearchQuery] = useState(globalSearch);

  // Sync local state with global search state
  useEffect(() => {
    setSearchQuery(globalSearch);
  }, [globalSearch]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch(value.trim());
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
        data-testid={dataTestId}
      />
      {searchQuery && (
        <button
          onClick={handleClear}
          className="clear-search-button"
          data-testid={dataTestId ? `${dataTestId}-clear` : 'search-clear-button'}
        >
          x
        </button>
      )}
    </div>
  );
}
