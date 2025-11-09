import useUser from "../features/auth/useUser";

function User() {
  const {user} = useUser();

  const {avatar, fullName, userType} = user.user_metadata;

  const name = fullName?.split(" ")?.slice(0, 1)?.join(" ") || "User";

  const initials = fullName
    ? fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <div className="flex items-center justify-center gap-3">
      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
        {avatar ? (
          <img
            src={avatar}
            alt={fullName || "User"}
            className="w-full h-full rounded-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          initials
        )}
      </div>
      <p className="text-lg font-semibold">
        {userType === "admin"
          ? "Admin Panel"
          : `${userType === "provider" ? "Pro." : "Dr."} ${name}`}
      </p>
    </div>
  );
}

export default User;
