import {useState} from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function FinancialTrends() {
  const [selectedPeriod, setSelectedPeriod] = useState("7days");

  const periods = [
    {id: "7days", label: "Last 7 Days"},
    {id: "30days", label: "Last 30 Days"},
    {id: "90days", label: "Last 90 Days"},
  ];

  // Mock data for the chart
  const chartData = [
    {date: "Mar 10", earnings: 400, payouts: 0},
    {date: "Mar 11", earnings: 350, payouts: 0},
    {date: "Mar 12", earnings: 300, payouts: 0},
    {date: "Mar 13", earnings: 0, payouts: 0},
    {date: "Mar 14", earnings: 400, payouts: 0},
    {date: "Mar 15", earnings: 0, payouts: 2400},
    {date: "Mar 16", earnings: 300, payouts: 0},
  ];

  // Custom tooltip component
  const CustomTooltip = ({active, payload, label}) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-800 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{color: entry.color}}>
              {entry.name}: ${entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-xs">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">
          Financial Trends
        </h3>
        <div className="flex space-x-2">
          {periods.map((period) => (
            <button
              key={period.id}
              onClick={() => setSelectedPeriod(period.id)}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                selectedPeriod === period.id
                  ? "bg-blue-100 text-blue-700 font-medium"
                  : "text-gray-600 hover:bg-gray-100"
              }`}>
              {period.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Container */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{fontSize: 12, fill: "#6b7280"}}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{fontSize: 12, fill: "#6b7280"}}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="top"
              height={36}
              iconType="rect"
              wrapperStyle={{fontSize: "14px", color: "#6b7280"}}
            />
            <Bar
              dataKey="earnings"
              name="Earnings"
              fill="#10b981"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="payouts"
              name="Payouts"
              fill="#ef4444"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default FinancialTrends;
