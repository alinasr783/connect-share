import {useQuery} from "@tanstack/react-query";
import LoginForm from "../features/auth/LoginForm";
import {useNavigate} from "react-router-dom";
import {getCurrentUser} from "../services/apiAuth";
import Heading from "../ui/Heading";

function Login() {
  const navigate = useNavigate();

  const {data: session} = useQuery({
    queryKey: ["session"],
    queryFn: () => getCurrentUser(),
  });

  if (session) {
    navigate("/dashboard");
  }

  return (
    <div className="flex flex-col items-center h-screen justify-center">
      <Heading as="h2">Login to your account</Heading>

      <LoginForm />
    </div>
  );
}

export default Login;
