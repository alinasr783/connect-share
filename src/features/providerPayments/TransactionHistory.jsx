import {useState} from "react";
import StatusBadge from "../../ui/StatusBadge";
import Table from "../../ui/Table";

function TransactionHistory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClinic, setSelectedClinic] = useState("all");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedType, setSelectedType] = useState("all");

  // Mock transaction data
  const transactions = [
    {
      id: 1,
      date: "2024-03-16",
      rental: "City Health / Dr. Olivia Hayes",
      amount: 350.0,
      type: "Earning",
      status: "Paid",
    },
    {
      id: 2,
      date: "2024-03-15",
      rental: "Payout to Bank Account",
      amount: -2500.0,
      type: "Payout",
      status: "Paid",
    },
    {
      id: 3,
      date: "2024-03-14",
      rental: "Downtown Medical / Dr. Noah Clark",
      amount: 400.0,
      type: "Earning",
      status: "Pending",
    },
    {
      id: 4,
      date: "2024-03-13",
      rental: "Metro Clinic / Dr. Sarah Johnson",
      amount: 275.0,
      type: "Earning",
      status: "Paid",
    },
    {
      id: 5,
      date: "2024-03-12",
      rental: "Payout to Bank Account",
      amount: -1500.0,
      type: "Payout",
      status: "Processing",
    },
  ];

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = transaction.rental
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesClinic =
      selectedClinic === "all" || transaction.rental.includes(selectedClinic);
    const matchesType =
      selectedType === "all" ||
      transaction.type.toLowerCase() === selectedType.toLowerCase();

    return matchesSearch && matchesClinic && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <span className="ri-search-line"></span>
            </span>
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-icon"
            />
          </div>

          {/* Clinic Filter */}
          {/* <select
            value={selectedClinic}
            onChange={(e) => setSelectedClinic(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="all">All Clinics</option>
            <option value="City Health">City Health</option>
            <option value="Downtown Medical">Downtown Medical</option>
            <option value="Metro Clinic">Metro Clinic</option>
          </select> */}

          {/* Date Filter */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <span className="ri-calendar-line"></span>
            </span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg 
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="all">All Types</option>
            <option value="earning">Earning</option>
            <option value="payout">Payout</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <Table maxHeight="500px">
        <Table.Header>
          <Table.Row>
            <Table.Head>DATE</Table.Head>
            <Table.Head>RENTAL</Table.Head>
            <Table.Head>AMOUNT</Table.Head>
            <Table.Head>TYPE</Table.Head>
            <Table.Head>STATUS</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((transaction) => (
              <Table.Row key={transaction.id}>
                <Table.Cell>{transaction.date}</Table.Cell>
                <Table.Cell>{transaction.rental}</Table.Cell>
                <Table.Cell
                  className={`font-medium ${
                    transaction.amount > 0 ? "text-green-600" : "text-red-600"
                  }`}>
                  {transaction.amount > 0 ? "+" : ""}$
                  {transaction.amount.toLocaleString()}
                </Table.Cell>
                <Table.Cell>{transaction.type}</Table.Cell>
                <Table.Cell>
                  <StatusBadge status={transaction.status} />
                </Table.Cell>
              </Table.Row>
            ))
          ) : (
            <Table.Empty message="No transactions found" />
          )}
        </Table.Body>
      </Table>
    </div>
  );
}

export default TransactionHistory;
