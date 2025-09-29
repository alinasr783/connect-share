import {useState, useEffect, useRef} from "react";
import useUser from "../../features/auth/useUser";
import Button from "../Button";

function Hero() {
  const {user} = useUser();
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {threshold: 0.1}
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative h-[calc(100vh-4rem)] flex 
      items-center justify-center text-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="/images/hero.png"
          alt="Modern medical clinic interior"
          className="w-full h-full object-cover"
          loading="eager"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-black/10 to-black/30"></div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20"></div>

      {/* Content */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div
          className={`transform transition-all duration-1000 delay-300 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight mb-6">
            Find your perfect
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300">
              clinic space
            </span>
          </h1>

          <p
            className="mt-6 max-w-3xl mx-auto text-base sm:text-lg md:text-xl 
            text-gray-200 leading-relaxed font-light">
            Discover and book professional clinic spaces tailored to your needs.
            Our platform connects you with a variety of locations, ensuring you
            have the right environment to provide exceptional care.
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
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
