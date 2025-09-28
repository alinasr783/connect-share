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
    <div className="flex items-center min-h-screen justify-center bg-gray-50 py-8">
      <SignupForm />
    </div>
  );
}

export default Signup;
