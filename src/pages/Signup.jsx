import {useNavigate} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import SignupForm from "../features/auth/SignupForm";
import {getCurrentUser} from "../services/apiAuth";
import Heading from "../ui/Heading";

function Signup() {
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
      <Heading as="h2">Register</Heading>

      <SignupForm />
    </div>
  );
}

export default Signup;
