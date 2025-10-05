import {formatCurrency} from "../../utils/helpers";

function RenderPricing({pricing, title, isSelectable, isSelected, onSelect}) {
  const getPrice = () => {
    if (title === "Hourly Rate") return pricing.hourlyRate || 0;
    if (title === "Daily Rate") return pricing.dailyRate || 0;
    if (title === "Monthly Rate") return pricing.monthlyRate || 0;
    return 0;
  };

  return (
    <div
      className={`flex items-center p-4 rounded-2xl cursor-pointer transition-all ${
        isSelectable
          ? isSelected
            ? "border-2 border-primary"
            : "bg-gray-200/60 hover:bg-gray-300/60"
          : "bg-gray-200/60"
      }`}
      onClick={isSelectable ? () => onSelect(title) : undefined}>
      {isSelectable && (
        <div className="flex items-center mr-3">
          <div
            className={`w-4 h-4 rounded-full border-2 ${
              isSelected
                ? "border-primary bg-primary"
                : "border-gray-400 bg-white"
            }`}>
            {isSelected && (
              <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
            )}
          </div>
        </div>
      )}
      <span className="text-gray-700 text-base flex-1">{title}</span>
      <span className="text-lg font-bold">{formatCurrency(getPrice())}</span>
    </div>
  );
}

export default RenderPricing;
