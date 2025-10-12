import {useNavigate} from "react-router-dom";
import Table from "../../ui/Table";
import StatusBadge from "../../ui/StatusBadge";
import Button from "../../ui/Button";
import {useState} from "react";
import {updateUserStatus} from "../../services/apiUsers";
import toast from "react-hot-toast";

function UserRow({user, onStatusUpdate}) {
  const [isUpdating, setIsUpdating] = useState(false);
  const navigate = useNavigate();

  const handleStatusToggle = async () => {
    if (isUpdating) return;

    if (user.userType !== "doctor") {
      toast.error("Status can only be updated for doctors");
      return;
    }

    setIsUpdating(true);
    try {
      const newStatus = user.status === "active" ? "inactive" : "active";
      await updateUserStatus(user.userId, newStatus);
      onStatusUpdate?.(user.userId, newStatus);
      toast.success(`Doctor status updated to ${newStatus}`);
    } catch (error) {
      toast.error("Failed to update doctor status");
      console.error("Error updating doctor status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Table.Row>
      <Table.Cell>{user.fullName}</Table.Cell>
      <Table.Cell>{user.email}</Table.Cell>
      <Table.Cell>{user.phone}</Table.Cell>
      <Table.Cell className="capitalize">{user.userType}</Table.Cell>
      <Table.Cell>
        <StatusBadge status={user.status} />
      </Table.Cell>
      <Table.Cell>
        {user.userType === "doctor" ? (
          <div className="flex gap-2">
            <Button
              onClick={() => navigate(`/admin/doctors/${user.userId}`)}
              variation="link"
              size="small"
              className="text-xs text-blue-600 hover:text-blue-700">
              Details
            </Button>
            <Button
              onClick={handleStatusToggle}
              disabled={isUpdating}
              variation="link"
              size="small"
              className={`text-xs ${
                user.status === "active"
                  ? "text-red-600 hover:text-red-700"
                  : "text-green-600 hover:text-green-700"
              }`}>
              {isUpdating
                ? "Updating..."
                : `Mark as ${user.status === "active" ? "Inactive" : "Active"}`}
            </Button>
          </div>
        ) : (
          <span className="text-gray-400 text-xs">
            {user.userType === "admin" ? "Admin" : "Provider"}
          </span>
        )}
      </Table.Cell>
    </Table.Row>
  );
}

export default UserRow;
