import UsersTable from "../features/adminUsers/UsersTable";
import UserTableOperations from "../features/adminUsers/UserTableOperations";
import Heading from "../ui/Heading";
import Row from "../ui/Row";

function AdminUsers() {
  return (
    <>
      <Row type="col">
        <Heading as="h1">Users</Heading>

        <UserTableOperations />
      </Row>

      <Row type="col">
        <UsersTable />
      </Row>
    </>
  );
}

export default AdminUsers;
