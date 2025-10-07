import {formatCurrency} from "../../utils/helpers";

function Stat({title, value, num, icon, color = "blue"}) {
  const colorClasses = {
    green: "bg-green-100 text-green-600",
    blue: "bg-blue-100 text-blue-600",
    orange: "bg-orange-100 text-orange-600",
    purple: "bg-purple-100 text-purple-600",
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center">
        <div
          className={`p-3 rounded-full ${colorClasses[color]} 
            flex items-center justify-center w-12 h-12`}>
          <i className={`${icon} text-2xl`}></i>
        </div>

        <div className="ml-4 flex-1">
          <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
          {value && (
            <p className="text-2xl font-bold text-gray-700">
              {formatCurrency(value)}
            </p>
          )}

          {num && <p className="text-3xl font-bold text-gray-900">{num}</p>}
        </div>
      </div>
    </div>
  );
}

export default Stat;
