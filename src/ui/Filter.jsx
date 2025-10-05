import {useState} from "react";
import {useSearchParams} from "react-router-dom";

function Filter({
  options = [],
  value,
  onChange,
  placeholder = "All",
  className = "",
  urlParam = null,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const currentValue = urlParam ? searchParams.get(urlParam) || "" : value;

  const handleOptionClick = (option) => {
    if (urlParam) {
      const newSearchParams = new URLSearchParams(searchParams);
      if (option && option !== "All") {
        newSearchParams.set(urlParam, option);
      } else {
        newSearchParams.delete(urlParam);
      }
      setSearchParams(newSearchParams);
    } else {
      onChange?.(option);
    }
    setIsOpen(false);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    if (urlParam) {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete(urlParam);
      setSearchParams(newSearchParams);
    } else {
      onChange?.("");
    }
  };

  return (
    <div className={`relative ${className} w-40`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 pr-8 border border-gray-300 rounded-lg 
          focus:ring-2 focus:ring-primary focus:border-transparent 
          bg-white text-left flex items-center justify-between">
        <span
          className={
            currentValue ? "text-gray-900 font-medium" : "text-gray-500"
          }>
          {currentValue || placeholder}
        </span>
        <div className="flex items-center gap-2">
          {currentValue && (
            <span
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 cursor-pointer">
              <i className="ri-close-line"></i>
            </span>
          )}
          <i
            className={`ri-arrow-down-s-line transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}></i>
        </div>
      </button>

      {isOpen && (
        <div
          className="absolute z-10 w-full mt-1 bg-white border 
            border-gray-300 rounded-lg shadow-lg">
          <div className="py-1">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => handleOptionClick(option)}
                className={`w-full px-4 py-2 text-left hover:bg-gray-50 flex 
                        items-center justify-between ${
                          currentValue === option
                            ? "bg-blue-50 text-primary"
                            : "text-gray-900"
                        }`}>
                <span className="capitalize">{option}</span>
                {currentValue === option && (
                  <i className="ri-check-line text-primary"></i>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Filter;
