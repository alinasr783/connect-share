import {formatCurrency} from "../../utils/helpers";

function Stat({title, value, num, rate}) {
  const numberStyle = "text-3xl font-bold text-gray-700 mb-1";

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center">
        <div className="ml-4 flex-1">
          <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>

          {value && <p className={numberStyle}>{formatCurrency(value)}</p>}

          {num && <p className={numberStyle}>{num}</p>}

          {rate && <p className={numberStyle}>{rate}%</p>}
        </div>
      </div>
    </div>
  );
}

export default Stat;
