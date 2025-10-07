import Spinner from "../../ui/Spinner";
import Table from "../../ui/Table";
import useDoctorTransactions from "./useDoctorTransactions";
import TransactionRow from "./TransactionRow";

function TransactionHistoryTable() {
  const {transactions, isLoadingTransactions} = useDoctorTransactions();

  if (isLoadingTransactions) return <Spinner />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Transaction History
        </h3>
      </div>

      <Table>
        <Table.Header>
          <Table.Row>
            <Table.Head>Date</Table.Head>
            <Table.Head>Clinic/Service</Table.Head>
            <Table.Head>Amount</Table.Head>
            <Table.Head>Status</Table.Head>
            <Table.Head>Invoice</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {transactions && transactions.length > 0 ? (
            transactions.map((transaction) => (
              <TransactionRow key={transaction.id} transaction={transaction} />
            ))
          ) : (
            <Table.Empty message="No transactions found" />
          )}
        </Table.Body>
      </Table>
    </div>
  );
}

export default TransactionHistoryTable;
