import {Link} from "react-router-dom";
import {DropdownMenu, MenuItem, MenuSeparator} from "../../ui/DropdownMenu";
import StatusBadge from "../../ui/StatusBadge";
import Table from "../../ui/Table";
import {formatDate} from "../../utils/helpers";
import useUpdateBooking from "../doctorBookings/useUpdateBooking";

function BookingTableRow({booking}) {
  const {updateBooking} = useUpdateBooking();

  const handelUpdateStatus = (id, status) => {
    updateBooking({id, updateData: {status}});
  };

  return (
    <Table.Row key={booking.id}>
      <Table.Cell>{booking?.clinicId?.name || "-"}</Table.Cell>
      <Table.Cell>{booking?.docId?.fullName || "-"}</Table.Cell>
      <Table.Cell>{booking?.provId?.fullName || "-"}</Table.Cell>
      <Table.Cell>{formatDate(booking?.created_at) || "-"}</Table.Cell>
      <Table.Cell>{booking?.selected_pricing || "-"}</Table.Cell>
      <Table.Cell>
        <StatusBadge status={booking.payment_status} />
      </Table.Cell>
      <Table.Cell>{<StatusBadge status={booking.status} /> || "-"}</Table.Cell>
      <Table.Cell>
        <DropdownMenu
          trigger={
            <button
              className="w-9 h-9 rounded-full flex items-center 
                    justify-center bg-gray-100 hover:bg-gray-200">
              <i className="ri-more-2-line" />
            </button>
          }>
          <MenuItem icon="ri-eye-line">
            <Link
              to={`/admin/bookings/${booking.id}`}
              className="w-full text-left block">
              View details
            </Link>
          </MenuItem>
          <MenuSeparator />
          {booking.status === "pending" && (
            <MenuItem
              icon="ri-close-circle-line"
              onClick={() => handelUpdateStatus(booking.id, "cancelled")}>
              Cancel booking
            </MenuItem>
          )}
          {booking.status === "pending" && (
            <MenuItem
              icon="ri-check-line"
              onClick={() => handelUpdateStatus(booking.id, "confirmed")}>
              Confirm booking
            </MenuItem>
          )}
        </DropdownMenu>
      </Table.Cell>
    </Table.Row>
  );
}

export default BookingTableRow;
