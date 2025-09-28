function SearchInput({
  placeholder = "Search...",
  value,
  onChange,
  className = "",
}) {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <i className="ri-search-line text-gray-400"></i>
      </div>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input-icon"
      />
    </div>
  );
}

export default SearchInput;
