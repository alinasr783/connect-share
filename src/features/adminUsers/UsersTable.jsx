import {useState, useEffect} from "react";
import Spinner from "../../ui/Spinner";
import Table from "../../ui/Table";
import Pagination from "../../ui/Pagination";
import UserRow from "./UserRow";
import useUsers from "./useUsers";

function UsersTable() {
  const {users, count, isLoadingUsers} = useUsers();
  const [localUsers, setLocalUsers] = useState(users);

  useEffect(() => {
    setLocalUsers(users);
  }, [users]);

  const handleStatusUpdate = (userId, newStatus) => {
    setLocalUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.userId === userId ? {...user, status: newStatus} : user
      )
    );
  };

  if (isLoadingUsers) return <Spinner />;

  const displayUsers = localUsers.length > 0 ? localUsers : users;

  return (
    <div>
      <Table columnTemplate="1fr 2fr 1fr 1fr 1fr 1fr">
        <Table.Header>
          <Table.Row>
            <Table.Head>Name</Table.Head>
            <Table.Head>Email</Table.Head>
            <Table.Head>Phone</Table.Head>
            <Table.Head>Role</Table.Head>
            <Table.Head>Status</Table.Head>
            <Table.Head>
              Action
              <span className="block text-xs font-normal text-gray-500 mt-1">
                (Doctors only)
              </span>
            </Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {displayUsers.length === 0 ? (
            <Table.Empty message="No users found" />
          ) : (
            displayUsers.map((user) => (
              <UserRow
                key={user.userId}
                user={user}
                onStatusUpdate={handleStatusUpdate}
              />
            ))
          )}
        </Table.Body>
      </Table>

      <Pagination count={count} />
    </div>
  );
}

export default UsersTable;
