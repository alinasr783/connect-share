import Header from "../Header/Header";
import Hero from "./Hero";
import WhyUs from "./WhyUs";
import HowItWorks from "./HowItWorks";
import Testimonials from "./Testimonials";
import FAQ from "./FAQ";
import Start from "./Start";
import Footer from "./Footer";

function Home() {
  return (
    <div>
      <Header />

      <main className="flex-grow min-h-screen bg-gray-100">
        <Hero />

        <div className="max-w-7xl px-4 mx-auto">
          <WhyUs />

          <HowItWorks />

          <Testimonials />

          <FAQ />

          <Start />
        </div>

        <Footer />
      </main>
    </div>
  );
}

export default Home;
