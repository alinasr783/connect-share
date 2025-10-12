import Button from "../../ui/Button";
import {useState} from "react";
import useLogin from "./useLogin";
import SpinnerMini from "../../ui/SpinnerMini";

function LoginForm() {
  const [email, setEmail] = useState("admin@test.com");
  const [password, setPassword] = useState("11111111");

  const {login, isLoginPending} = useLogin();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) return;
    login({email, password});
  };

  return (
    <div className="flex items-center justify-center w-full">
      <div className="w-full max-w-md bg-white rounded-sm shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              disabled={isLoginPending}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input border-gray-300"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              disabled={isLoginPending}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="input border-gray-300"
            />
          </div>

          <div className="flex items-center justify-center">
            <Button
              type="primary"
              size="medium"
              className="w-full"
              disabled={isLoginPending}>
              {isLoginPending ? <SpinnerMini /> : "Login"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
