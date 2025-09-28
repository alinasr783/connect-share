import {Navigate} from "react-router-dom";
import useUser from "../features/auth/useUser";
import Spinner from "./Spinner";

function RoleProtectedRoute({children, role}) {
  const {user, isUserPending} = useUser();

  if (isUserPending) {
    return <Spinner />;
  }

  if (user) {
    const userType = user.user_metadata?.userType;
    if (userType === role) {
      return children;
    } else {
      if (userType === "provider")
        return <Navigate to="/provider" replace={false} />;
      if (userType === "doctor")
        return <Navigate to="/doctor" replace={false} />;
      return <Navigate to="/dashboard" replace={false} />;
    }
  }

  return <Navigate to="/login" replace={false} />;
}

export default RoleProtectedRoute;
