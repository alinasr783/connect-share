import {Navigate} from "react-router-dom";
import useUser from "../features/auth/useUser";
import Spinner from "../ui/Spinner";

function Dashboard() {
  const {user, isUserPending} = useUser();

  if (isUserPending) {
    return <Spinner />;
  }

  if (user) {
    const userType = user.user_metadata?.userType;
    if (userType === "provider") {
      return <Navigate to="/provider" replace />;
    }
    if (userType === "doctor") {
      return <Navigate to="/doctor" replace />;
    }
  }

  // Fallback
  return <Navigate to="/" replace />;
}

export default Dashboard;
