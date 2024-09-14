import React, { useState, useEffect, useMemo } from 'react';
import countriesData from './countriesData.json'; 
import "./SearchBar.css"

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [filteredResults, setFilteredResults] = useState([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState('');

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  const handleSearch = (input) => {
    const trimmedInput = input.trim().toLowerCase();
    setQuery(trimmedInput);

    if (trimmedInput.length === 0) {
      setFilteredResults([]);
      return;
    }

    if (!Array.isArray(countriesData)) {
      console.error('countriesData is not an array:', countriesData);
      return;
    }

    const filtered = countriesData.filter((country) =>
      country.country.toLowerCase().startsWith(trimmedInput) ||
      country.capital.toLowerCase().startsWith(trimmedInput)
    );

    setFilteredResults(filtered);
  };

  const handleSelect = (country) => {
    setQuery(country.country);
    setFilteredResults([]);
    setSelectedSuggestion(country.country);
  };

  const debouncedSearch = useMemo(() => debounce(handleSearch, 300), []);

  useEffect(() => {
    debouncedSearch(query);
  }, [query, debouncedSearch]);

  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Search by country or capital..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="search-input"
        aria-label="Search by country or capital"
      />

      {filteredResults.length > 0 ? (
        <div className="suggestions-list">
          {filteredResults.map((item, index) => (
            <div
              key={index}
              className="suggestion-item"
              onClick={() => handleSelect(item)}
            >
              <strong>{item.country}</strong> - {item.capital}
            </div>
          ))}
        </div>
      ) : query && (
        <div className="no-results">
          No results found.
        </div>
      )}
    </div>
  );
};

export default SearchBar;