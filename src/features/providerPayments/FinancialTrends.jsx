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
import Heading from "../../ui/Heading";
import {formatCurrency} from "../../utils/helpers";
import {eachDayOfInterval, format, isSameDay, subDays} from "date-fns";
import useEarnings from "./useEarnings";
import usePayouts from "./usePayouts";

function FinancialTrends() {
  const [selectedPeriod, setSelectedPeriod] = useState("7days");
  const {rentals, isLoadingRentals} = useEarnings();
  const {allPayouts, isLoadingPayouts} = usePayouts();

  // Period options
  const periods = [
    {id: "7days", label: "7 Days", days: 7},
    {id: "30days", label: "30 Days", days: 30},
    {id: "90days", label: "90 Days", days: 90},
  ];

  // Get the number of days for selected period
  const currentPeriod =
    periods.find((p) => p.id === selectedPeriod) || periods[0];
  const daysToShow = currentPeriod.days;

  const allDates = eachDayOfInterval({
    start: subDays(new Date(), daysToShow - 1),
    end: new Date(),
  });

  // Filter completed rentals for earnings
  const completedRentals =
    rentals?.filter((rental) => rental.status === "completed") || [];

  // Filter confirmed payouts
  const confirmedPayouts =
    allPayouts?.filter(
      (payout) => payout.status === "confirmed" || payout.status === "completed"
    ) || [];

  const data = allDates.map((date) => {
    const dailyEarnings = completedRentals
      .filter((rental) => isSameDay(date, new Date(rental.created_at)))
      .reduce((total, rental) => total + (rental.price || 0), 0);

    const dailyPayouts = confirmedPayouts
      .filter((payout) => isSameDay(date, new Date(payout.created_at)))
      .reduce((total, payout) => total + (payout.amount || 0), 0);

    return {
      date: format(date, "MMM dd"),
      earnings: dailyEarnings,
      payouts: dailyPayouts,
    };
  });

  const CustomTooltip = ({active, payload, label}) => {
    if (active && payload && payload.length) {
      return (
        <div
          className="bg-white p-3 border 
          border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-800 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{color: entry.color}}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (isLoadingRentals || isLoadingPayouts) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-xs">
        <div className="flex items-center justify-center h-[350px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Loading financial data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-xs">
      <div className="flex items-center justify-between mb-6">
        <Heading as="h3">Financial Trends</Heading>
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
      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
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
              tickFormatter={(value) => formatCurrency(value)}
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
