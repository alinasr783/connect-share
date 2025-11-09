import {useQuery} from "@tanstack/react-query";
import LoginForm from "../features/auth/LoginForm";
import {useNavigate, Link} from "react-router-dom";
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
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <div className="flex flex-col md:flex-row w-full max-w-6xl bg-white/95 rounded-3xl shadow-2xl overflow-hidden">
        {/* Left Panel */}
        <div className="flex-1 relative overflow-hidden md:block hidden">
          <div className="absolute top-6 left-6 z-10">
            <button
              onClick={() => navigate("/")}
              className="w-10 h-10 bg-black/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/30 transition-all"
            >
              <i className="ri-arrow-left-line text-white text-xl" />
            </button>
          </div>

          <div className="absolute inset-0">
            <img
              src="https://i.ibb.co/fzPfrYgp/Purple-and-Black-3-D-Geometric-Cube-Phone-Wallpaper.png"
              alt="Purple geometric cubes"
              className="w-full h-full object-cover"
            />
            <div className="w-full h-full bg-gradient-to-br from-indigo-500/60 via-blue-600/60 to-indigo-800/60" />
            {/* Left panel text removed per request */}
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex-1 p-8 flex flex-col justify-center">
          <div className="mb-8">
            <Heading as="h2">Log in</Heading>
            <p className="text-gray-600 mt-2">
              Don't have an account?
              <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-medium ml-1">Sign up now</Link>
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}

export default Login;
