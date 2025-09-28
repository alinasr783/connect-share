import useUser from "../features/auth/useUser";

function User() {
  const {user} = useUser();

  const {avatar, fullName, userType} = user.user_metadata;

  const name = fullName.split(" ").slice(0, 1).join(" ");

  return (
    <div className="flex items-center justify-center gap-3">
      {avatar && (
        <img
          src={avatar}
          alt={fullName}
          className="w-11 h-11 rounded-full object-cover"
        />
      )}
      <p className="text-lg font-semibold">
        {userType === "provider" ? "Pro." : "Dr."} {name}
      </p>
    </div>
  );
}

export default User;
