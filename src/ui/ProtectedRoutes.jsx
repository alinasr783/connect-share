import {useEffect} from "react";
import {Outlet, useNavigate} from "react-router-dom";
import useUser from "../features/auth/useUser";
import Spinner from "./Spinner";

function ProtectedRoutes() {
  const navigate = useNavigate();

  // 1. load auth user
  const {isUserPending, isAuthenticated} = useUser();

  // 2. If there is NO authenticated user, redirect to the /login
  useEffect(() => {
    if (!isAuthenticated && !isUserPending)
      navigate("/login", {replace: false});
  }, [isAuthenticated, isUserPending, navigate]);

  // 3. show spinner if loading
  if (isUserPending) {
    return <Spinner />;
  }

  // 4. if there is a user, render the nested routes
  return <Outlet />;
}

export default ProtectedRoutes;
