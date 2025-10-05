import {DropdownMenu, MenuItem} from "../../ui/DropdownMenu";
import Heading from "../../ui/Heading";
import StatusBadge from "../../ui/StatusBadge";
import {formatDateRange, formatTime} from "../../utils/helpers";
import useUpdateBooking from "./useUpdateBooking";

function BookingItem({booking}) {
  const {updateBooking, isUpdatingBooking} = useUpdateBooking();

  const {
    clinicId: {name},
    status,
    selected_date,
    selected_hours,
    selected_pricing,
  } = booking;

  const handleCancel = () => {
    updateBooking({id: booking.id, updateData: {status: "cancelled"}});
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-xs border border-gray-100 flex items-center justify-between">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-4">
          <Heading
            as="h4"
            className="text-xl 
              font-bold text-primary">
            {name}
          </Heading>
          <StatusBadge status={status} />
        </div>

        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2 text-gray-600">
            <i className="ri-calendar-line"></i>
            <span className="text-sm font-medium">
              {formatDateRange(selected_date?.from, selected_date?.to)}
            </span>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <i className="ri-time-line"></i>
            <span className="text-sm font-medium">
              {formatTime(selected_hours?.startTime)} -{" "}
              {formatTime(selected_hours?.endTime)}
            </span>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <i className="ri-price-tag-3-line"></i>
            <span className="text-sm font-medium ">{selected_pricing}</span>
          </div>
        </div>
      </div>

      <div className="ml-4">
        <DropdownMenu
          trigger={
            <button
              className="py-1 px-2 h-fit cursor-pointer 
                hover:bg-gray-100 rounded-full transition-colors">
              <i className="ri-more-2-line text-gray-500 text-2xl"></i>
            </button>
          }
          position="right">
          <MenuItem
            onClick={handleCancel}
            disabled={status !== "pending" || isUpdatingBooking}
            icon="ri-close-line"
            className={
              status !== "pending"
                ? "text-gray-400"
                : "text-red-600 hover:text-red-700 hover:bg-red-50"
            }>
            Cancel
          </MenuItem>
        </DropdownMenu>
      </div>
    </div>
  );
}

export default BookingItem;
