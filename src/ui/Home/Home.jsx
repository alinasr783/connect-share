import {lazy, Suspense, memo} from "react";
import Header from "../Header/Header";
import Hero from "./Hero";
import Spinner from "../Spinner";

// Lazy load non-critical components
const WhyUs = lazy(() => import("./WhyUs"));
const HowItWorks = lazy(() => import("./HowItWorks"));
const Testimonials = lazy(() => import("./Testimonials"));
const LatestArticles = lazy(() => import("./LatestArticles"));
const FAQ = lazy(() => import("./FAQ"));
const Start = lazy(() => import("./Start"));
const Footer = lazy(() => import("./Footer"));

const SectionLoader = () => (
  <div className="flex justify-center items-center py-16">
    <Spinner />
  </div>
);

function Home() {
  return (
    <div>
      <Header />

      <main className="flex-grow min-h-screen bg-gray-100">
        <Hero />

        <div className="max-w-7xl px-4 mx-auto">
          <Suspense fallback={<SectionLoader />}>
            <WhyUs />
          </Suspense>

          <Suspense fallback={<SectionLoader />}>
            <HowItWorks />
          </Suspense>

          <Suspense fallback={<SectionLoader />}>
            <Testimonials />
          </Suspense>

          <Suspense fallback={<SectionLoader />}>
            <LatestArticles />
          </Suspense>

          <Suspense fallback={<SectionLoader />}>
            <FAQ />
          </Suspense>

          <Suspense fallback={<SectionLoader />}>
            <Start />
          </Suspense>
        </div>

        <Suspense fallback={<SectionLoader />}>
          <Footer />
        </Suspense>
      </main>
    </div>
  );
}

// Memoize the component to prevent unnecessary re-renders
export default memo(Home);
