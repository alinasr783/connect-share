import useProviderTransactions from "./useProviderTransactions";
import {formatCurrency, formatDate} from "../../utils/helpers";
import Spinner from "../../ui/Spinner";
import Table from "../../ui/Table";

function ProviderTransactionHistory() {
  const {transactions, isLoadingTransactions} = useProviderTransactions();

  if (isLoadingTransactions) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-xs">
        <div className="flex items-center justify-center py-8">
          <Spinner />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-xs">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">
        Transaction History
      </h3>

      <Table>
        <Table.Header>
          <Table.Row>
            <Table.Head>Date</Table.Head>
            <Table.Head>Service</Table.Head>
            <Table.Head>Type</Table.Head>
            <Table.Head>Amount</Table.Head>
            <Table.Head>Status</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {transactions && transactions.length > 0 ? (
            transactions.map((transaction) => (
              <Table.Row key={transaction.id}>
                <Table.Cell>{formatDate(transaction.created_at)}</Table.Cell>
                <Table.Cell>{transaction.service}</Table.Cell>
                <Table.Cell>
                  <span className="capitalize">{transaction.type}</span>
                </Table.Cell>
                <Table.Cell>
                  <span
                    className={`font-medium ${
                      transaction.amount < 0 ? "text-red-600" : "text-green-600"
                    }`}>
                    {formatCurrency(Math.abs(transaction.amount))}
                    {transaction.amount < 0 && " (Withdrawal)"}
                  </span>
                </Table.Cell>
                <Table.Cell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      transaction.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : transaction.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}>
                    {transaction.status}
                  </span>
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

export default ProviderTransactionHistory;
