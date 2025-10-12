import {useState, useRef, useEffect} from "react";
import useSearchProviders from "../features/providerClinics/useSearchProviders";

function SearchableDropdown({
  selectedProvider,
  onSelectProvider,
  placeholder = "Search for provider...",
  disabled = false,
  error = null,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  const {searchTerm, setSearchTerm, searchResults, isSearching} =
    useSearchProviders();

  // Update input value when selected provider changes
  useEffect(() => {
    if (selectedProvider) {
      setInputValue(`${selectedProvider.fullName} (${selectedProvider.email})`);
    } else {
      setInputValue("");
    }
  }, [selectedProvider]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    setSearchTerm(value);
    setIsOpen(true);

    // Clear selection if input is cleared
    if (!value.trim()) {
      onSelectProvider(null);
    }
  };

  const handleInputFocus = () => {
    setIsOpen(true);
    if (searchTerm) {
      setSearchTerm(searchTerm);
    }
  };

  const handleSelectProvider = (provider) => {
    onSelectProvider(provider);
    setInputValue(`${provider.fullName} (${provider.email})`);
    setIsOpen(false);
  };

  const handleClear = () => {
    setInputValue("");
    setSearchTerm("");
    onSelectProvider(null);
    inputRef.current?.focus();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full px-4 py-2.5 text-base bg-white border rounded-lg
                        appearance-none focus:outline-none focus:ring-2 
                        focus:ring-primary focus:border-transparent
                        disabled:bg-gray-100 disabled:cursor-not-allowed
                        transition-all duration-200 ${
                          error ? "border-red-300" : "border-gray-300"
                        }`}
        />

        {/* Clear button */}
        {inputValue && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-8 top-1/2 transform -translate-y-1/2 
                            text-gray-400 hover:text-gray-600">
            ✕
          </button>
        )}

        {/* Dropdown arrow */}
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {/* Dropdown menu */}
      {isOpen && (
        <div
          className="absolute z-50 w-full mt-1 bg-white border border-gray-300 
                    rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {isSearching ? (
            <div className="px-4 py-2 text-gray-500 text-sm">Searching...</div>
          ) : searchResults.length > 0 ? (
            searchResults.map((provider) => (
              <button
                key={provider.userId}
                type="button"
                onClick={() => handleSelectProvider(provider)}
                className="w-full px-4 py-2 text-left hover:bg-gray-100 
                                    focus:bg-gray-100 focus:outline-none">
                <div className="font-medium text-gray-900">
                  {provider.fullName}
                </div>
                <div className="text-sm text-gray-500">
                  {provider.email} • ID: {provider.userId}
                </div>
              </button>
            ))
          ) : searchTerm.length >= 2 ? (
            <div className="px-4 py-2 text-gray-500 text-sm">
              No providers found
            </div>
          ) : (
            <div className="px-4 py-2 text-gray-500 text-sm">
              Type at least 2 characters to search
            </div>
          )}
        </div>
      )}

      {/* Error message */}
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}

export default SearchableDropdown;

