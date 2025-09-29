import {memo} from "react";
import useUser from "../../features/auth/useUser";
import Button from "../Button";

function Start() {
  const {user} = useUser();

  return (
    <section className="py-16 text-center" id="start">
      <div className="max-w-4xl mx-auto px-4">
        <h2>
          Ready to find your ideal
          <span
            className="block text-transparent bg-clip-text bg-gradient-to-r 
            from-[var(--color-primary)] to-cyan-600">
            clinic space
          </span>
        </h2>
        <p className="mt-6 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Join hundreds of doctors and start booking your perfect space today.
          Experience the future of medical practice management.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
          {user ? (
            <Button
              type="primary"
              size="large"
              to={`/${user.user_metadata.userType}`}>
              Go to Dashboard
            </Button>
          ) : (
            <>
              <Button type="primary" size="large" to="/signup">
                Get Started
              </Button>
              <Button type="secondary" size="large" to="/login">
                Sign In
              </Button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default memo(Start);
