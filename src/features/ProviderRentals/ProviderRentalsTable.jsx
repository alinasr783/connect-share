import {RENTALS_PAGE_SIZE} from "../../constant/const";
import Spinner from "../../ui/Spinner";
import Table from "../../ui/Table";
import TablePagination from "../../ui/TablePagination";
import ProviderRentalsRow from "./ProviderRentalsRow";
import useProviderRentals from "./useProviderRentals";

function ProviderRentalsTable() {
  const {rentals, totalCount, isLoadingRentals} = useProviderRentals();

  if (isLoadingRentals) return <Spinner />;

  return (
    <div className="space-y-4">
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.Head>CLINIC</Table.Head>
            <Table.Head>DATE</Table.Head>
            <Table.Head>TIME</Table.Head>
            <Table.Head>TENANT</Table.Head>
            <Table.Head>STATUS</Table.Head>
            <Table.Head>AMOUNT</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {rentals && rentals.length > 0 ? (
            rentals.map((rental) => (
              <ProviderRentalsRow key={rental.id} rental={rental} />
            ))
          ) : (
            <Table.Empty message="No rental bookings found" />
          )}
        </Table.Body>
      </Table>

      <TablePagination
        totalCount={totalCount}
        pageSize={RENTALS_PAGE_SIZE}
        className="mt-6">
        {({currentPage, pageCount, totalCount, pageSize, onPageChange}) => (
          <>
            <TablePagination.Info
              currentPage={currentPage}
              pageSize={pageSize}
              totalCount={totalCount}
              itemName="bookings"
            />
            <TablePagination.Navigation
              currentPage={currentPage}
              pageCount={pageCount}
              onPageChange={onPageChange}
            />
          </>
        )}
      </TablePagination>
    </div>
  );
}

export default ProviderRentalsTable;
