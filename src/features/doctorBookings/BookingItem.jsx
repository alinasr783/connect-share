import {getDateFromCreatedAt, getTimeFromCreatedAt} from "../../utils/helpers";

function BookingItem({booking}) {
  const {
    clinicId: {name},
    created_at,
    status,
  } = booking;

  return (
    <div>
      <h3>{name}</h3>
      <p>{getDateFromCreatedAt(created_at)}</p>
      <p>{getTimeFromCreatedAt(created_at)}</p>
      <p>{status}</p>
    </div>
  );
}

export default BookingItem;
