import Button from "../../ui/Button";
import {useState} from "react";
import useLogin from "./useLogin";
import SpinnerMini from "../../ui/SpinnerMini";

function LoginForm() {
  const [email, setEmail] = useState("admin@test.com");
  const [password, setPassword] = useState("11111111");
  const [showPassword, setShowPassword] = useState(false);

  const {login, isLoginPending} = useLogin();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) return;
    login({email, password});
  };

  return (
    <div className="flex items-center justify-center w-full">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              disabled={isLoginPending}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@domain.com"
              className="input border-gray-300 focus-visible:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                disabled={isLoginPending}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="input border-gray-300 pr-10 focus-visible:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-2 flex items-center px-2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                title={showPassword ? "Hide password" : "Show password"}
              >
                <i className={`ri-${showPassword ? "eye-off-line" : "eye-line"} text-xl`} />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <Button
              type="primary"
              size="medium"
              className="w-full rounded-lg"
              disabled={isLoginPending}
            >
              {isLoginPending ? <SpinnerMini /> : "Log in"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
