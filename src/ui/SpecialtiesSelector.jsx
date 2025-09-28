import {useState, useRef} from "react";

function SpecialtiesSelector({
  selectedSpecialties = [],
  onSpecialtiesChange,
  disabled = false,
}) {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef(null);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSpecialty();
    }
  };

  const addSpecialty = () => {
    const specialty = inputValue.trim();
    if (specialty && !selectedSpecialties.includes(specialty)) {
      onSpecialtiesChange([...selectedSpecialties, specialty]);
      setInputValue("");
    }
  };

  const handleRemoveSpecialty = (specialty) => {
    const newSelection = selectedSpecialties.filter((s) => s !== specialty);
    onSpecialtiesChange(newSelection);
  };

  const handleInputBlur = () => {
    if (inputValue.trim()) {
      addSpecialty();
    }
  };

  return (
    <div className="relative">
      {/* Input Container */}
      <div className="min-h-[40px] p-2 border border-gray-300 rounded-lg bg-white flex flex-wrap gap-1 items-center">
        {/* Selected Specialties Tags */}
        {selectedSpecialties.map((specialty) => (
          <span
            key={specialty}
            className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-md">
            {specialty}
            <button
              type="button"
              onClick={() => handleRemoveSpecialty(specialty)}
              disabled={disabled}
              className="text-blue-600 hover:text-blue-800 disabled:opacity-50">
              ×
            </button>
          </span>
        ))}

        {/* Text Input */}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          onBlur={handleInputBlur}
          disabled={disabled}
          placeholder={
            selectedSpecialties.length === 0
              ? "Enter your medical specialties..."
              : "Add another specialty..."
          }
          className="flex-1 min-w-[200px] px-2 py-1 text-sm border-none outline-none bg-transparent disabled:opacity-50"
        />
      </div>

      {/* Helper Text */}
      <p className="mt-1 text-xs text-gray-500">
        Press Enter or comma (,) to add a specialty
      </p>
    </div>
  );
}

export default SpecialtiesSelector;
