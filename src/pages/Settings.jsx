import useUser from "../features/auth/useUser";
import PaymentSettings from "../features/settings/PaymentSettings";
import UpdateData from "../features/settings/UpdateData";
import Row from "../ui/Row";

function Settings() {
  const {user} = useUser();

  return (
    <Row type="col">
      <UpdateData />

      {user.user_metadata.userType === "provider" && <PaymentSettings />}
    </Row>
  );
}

export default Settings;
