import Button from "../Button";
import useUser from "../../features/auth/useUser";

function Start() {
  const {user} = useUser();

  return (
    <section className="py-16 text-center" id="start">
      <div>
        <h2>Ready to find your ideal clinic space</h2>
        <p className="mt-3 text-gray-600">
          Join hundreds of doctors and start booking your perfect space today.
        </p>
      </div>

      <div className="mt-8">
        {user ? (
          <Button
            type="primary"
            size="large"
            to={`/${user.user_metadata.userType}`}>
            Dashboard
          </Button>
        ) : (
          <Button type="primary" size="large" to="/signup">
            Sign Up
          </Button>
        )}
      </div>
    </section>
  );
}

export default Start;
