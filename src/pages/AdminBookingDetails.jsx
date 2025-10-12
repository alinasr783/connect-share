import useBooking from "../features/adminBookings/useBooking";
import Button from "../ui/Button";
import Heading from "../ui/Heading";
import Row from "../ui/Row";
import {useParams} from "react-router-dom";
import Spinner from "../ui/Spinner";
import StatusBadge from "../ui/StatusBadge";
import {formatCurrency, formatDate} from "../utils/helpers";

function AdminBookingDetails() {
  const {id} = useParams();
  const {booking, isLoadingBooking} = useBooking();

  if (isLoadingBooking) return <Spinner />;

  if (!booking) return <div>Booking not found</div>;

  return (
    <div className="space-y-6">
      <Row type="row">
        <Heading as="h1">Booking #{id}</Heading>
        <Button
          variation="link"
          to="/admin/bookings"
          className="flex items-center gap-2">
          <i className="ri-arrow-left-line"></i>
          <span>Back</span>
        </Button>
      </Row>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-xs p-6">
            <Heading as="h3">Booking Details</Heading>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Clinic Name</p>
                  <p className="font-semibold text-gray-900">
                    {booking?.clinicId?.name || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Booking Date & Time</p>
                  <p className="text-gray-900">
                    {formatDate(booking?.created_at) || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Price</p>
                  <p className="font-semibold text-gray-900">
                    {formatCurrency(booking?.price || 0)}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="text-gray-900">
                    {booking?.clinicId?.address || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Rental Type</p>
                  <p className="text-gray-900">
                    {booking?.selected_pricing || "-"}
                  </p>
                </div>
                {booking?.selected_pricing === "commission" && (
                  <div>
                    <p className="text-sm text-gray-500">Commission</p>
                    <p className="text-gray-900">
                      {formatCurrency(booking?.commission || 0)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-xs p-6">
            <Heading as="h3">Participants</Heading>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <p className="text-sm text-gray-500">Doctor</p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-full bg-gradient-to-br 
                    from-blue-500 to-purple-500 flex items-center justify-center 
                    text-white font-semibold">
                    {booking?.docId?.fullName?.charAt(0) || "D"}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {booking?.docId?.fullName || "-"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {booking?.docId?.email || "-"}
                    </p>
                    {/* <button className="text-sm text-blue-600 hover:underline">
                      View Profile
                    </button> */}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm text-gray-500">Host</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center text-white font-semibold">
                    {booking?.provId?.fullName?.charAt(0) || "H"}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {booking?.provId?.fullName || "-"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {booking?.provId?.email || "-"}
                    </p>
                    {/* <button className="text-sm text-blue-600 hover:underline">
                      View Profile
                    </button> */}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-xs p-6">
            <Heading as="h3">Audit Trail</Heading>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded bg-blue-500 flex items-center justify-center">
                  <i className="ri-file-text-line text-white text-sm"></i>
                </div>
                <div>
                  <p className="text-gray-900">
                    Booking created by {booking?.docId?.fullName || "Doctor"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatDate(booking?.created_at)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded bg-yellow-500 flex items-center justify-center">
                  <i className="ri-time-line text-white text-sm"></i>
                </div>
                <div>
                  <p className="text-gray-900">
                    Status changed to Pending - Awaiting host confirmation
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatDate(booking?.created_at)}
                  </p>
                </div>
              </div>

              {booking?.status === "confirmed" && (
                <div className="flex items-start gap-3">
                  <div
                    className="w-8 h-8 rounded-full bg-green-500 
                    flex items-center justify-center">
                    <i className="ri-check-line text-white text-sm"></i>
                  </div>
                  <div>
                    <p className="text-gray-900">
                      Status changed to Confirmed by Host{" "}
                      {booking?.provId?.fullName || "Host"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDate(booking?.updated_at)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-xs p-6">
            <Heading as="h3">Booking Status</Heading>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <StatusBadge status={booking?.status} />
              </div>

              <div className="space-y-3">
                {booking?.status === "confirmed" && (
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center gap-2">
                    <i className="ri-check-line"></i>
                    Mark as Completed
                  </Button>
                )}

                <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2">
                  <i className="ri-pause-line"></i>
                  Suspend Booking
                </Button>

                <Button className="w-full bg-red-500 hover:bg-red-600 text-white flex items-center gap-2">
                  <i className="ri-close-line"></i>
                  Cancel Booking
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-xs p-6">
            <Heading as="h3">Payment</Heading>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <p className="text-sm text-gray-500">Status</p>
                <StatusBadge status={booking?.payment_status} />
              </div>

              <div className="space-y-3">
                <h3 className="font-medium text-gray-900">Payment History</h3>

                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-900">
                      Payment from {booking?.docId?.fullName || "Doctor"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(booking?.created_at)} - VISA **** 4567
                    </p>
                  </div>
                  <p className="text-sm font-medium text-green-600">
                    +{formatCurrency(booking?.price || 0)}
                  </p>
                </div>

                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-900">
                      Payout to Host {booking?.provId?.fullName || "Host"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(booking?.created_at)} - Bank Transfer
                    </p>
                  </div>
                  <p className="text-sm font-medium text-red-600">
                    -{formatCurrency(booking?.host_payout || 0)}
                  </p>
                </div>

                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-900">Platform Commission</p>
                    <p className="text-xs text-gray-500">
                      {formatDate(booking?.created_at)}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-green-600">
                    +{formatCurrency(booking?.commission || 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}

export default AdminBookingDetails;
