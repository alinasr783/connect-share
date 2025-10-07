import {useState, useEffect} from "react";
import StatusBadge from "../../ui/StatusBadge";
import Table from "../../ui/Table";
import TablePagination from "../../ui/TablePagination";
import useProviderTransactions from "./useProviderTransactions";
import useTransactionFilters from "./useTransactionFilters";
import {formatCurrency, formatDate} from "../../utils/helpers";
import Spinner from "../../ui/Spinner";

function TransactionHistory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const {transactions, totalCount, pageSize, isLoadingTransactions} =
    useProviderTransactions();

  const {updateFilter, updateMultipleFilters} = useTransactionFilters();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      updateFilter("search", searchTerm);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, updateFilter]);

  useEffect(() => {
    updateFilter("date", selectedDate);
  }, [selectedDate, updateFilter]);

  useEffect(() => {
    updateMultipleFilters({
      type: selectedType,
      status: selectedStatus,
    });
  }, [selectedType, selectedStatus, updateMultipleFilters]);

  if (isLoadingTransactions) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-8">
          <Spinner />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <span
              className="absolute left-3 top-1/2 transform -translate-y-1/2 
            text-gray-400">
              <span className="ri-search-line"></span>
            </span>
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

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

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg 
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="all">All Types</option>
            <option value="earning">Earning</option>
            <option value="withdrawal">Withdrawal</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg 
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      <Table maxHeight="500px">
        <Table.Header>
          <Table.Row>
            <Table.Head>DATE</Table.Head>
            <Table.Head>RENTAL/SERVICE</Table.Head>
            <Table.Head>AMOUNT</Table.Head>
            <Table.Head>TYPE</Table.Head>
            <Table.Head>STATUS</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {transactions.length > 0 ? (
            transactions.map((transaction) => (
              <Table.Row key={transaction.id}>
                <Table.Cell>{formatDate(transaction.created_at)}</Table.Cell>
                <Table.Cell>{transaction.service}</Table.Cell>
                <Table.Cell
                  className={`font-medium ${
                    transaction.amount > 0 ? "text-green-600" : "text-red-600"
                  }`}>
                  {transaction.amount < 0 ? "-" : "+"}{" "}
                  {formatCurrency(Math.abs(transaction.amount))}
                </Table.Cell>
                <Table.Cell className="capitalize">
                  {transaction.type}
                </Table.Cell>
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

      {totalCount > 0 && (
        <TablePagination
          totalCount={totalCount}
          pageSize={pageSize}
          className="mt-6">
          {({currentPage, pageCount, totalCount, pageSize, onPageChange}) => (
            <>
              <TablePagination.Info
                currentPage={currentPage}
                pageSize={pageSize}
                totalCount={totalCount}
                itemName="transactions"
              />
              <div className="flex items-center gap-4">
                <TablePagination.PageNumbers
                  currentPage={currentPage}
                  pageCount={pageCount}
                  onPageChange={onPageChange}
                />
                <TablePagination.Navigation
                  currentPage={currentPage}
                  pageCount={pageCount}
                  onPageChange={onPageChange}
                />
              </div>
            </>
          )}
        </TablePagination>
      )}
    </div>
  );
}

export default TransactionHistory;
