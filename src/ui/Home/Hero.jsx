import useUser from "../../features/auth/useUser";
import Button from "../Button";

function Hero() {
  const {user} = useUser();

  return (
    <section
      className="relative h-[calc(100vh-4rem)] flex 
      items-center justify-center text-center">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBCt1rI3i9o6JyDgz2XWmfc2Ba_bQ--ytf0f7FdUsgeKnVsRcsvHBt_KAA3Yg9CIolTaYFTMtex-bdE-WSTv0kXJBKGheNqZb1t3wivOvBkJ5FBmYkqjwNh5h42rQmRREEdh-jlua2Iz6OODt2tNFbb78_XMobvU25ma_hsDZ7l41_U3ErBu5idQYaMjYGZXh7Fp1NnkhK60iZbg0XufWO4UyC3jTCpdKIQUo7LEyzz6ZmJCo7WpwVuTB1oziXBvyIs6qzGuqPEl9o')",
        }}></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-black/20"></div>

      <div className="relative z-10 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-black  text-white">
          Find your perfect clinic space
        </h1>

        <p className="mt-4 max-w-2xl mx-auto text-base sm:text-xl md:text-lg text-gray-200">
          Discover and book professional clinic spaces tailored to your needs.
          Our platform connects you with a variety of locations, ensuring you
          have the right environment to provide exceptional care.
        </p>

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
      </div>
    </section>
  );
}

export default Hero;
