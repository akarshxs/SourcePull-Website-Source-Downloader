import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Hero from "./components/sections/Hero";
import ProblemSection from "./components/sections/ProblemSection";
import FeaturesSection from "./components/sections/FeaturesSection";
import HowItWorksSection from "./components/sections/HowItWorksSection";
import MetricsSection from "./components/sections/MetricsSection";
import DashboardPreview from "./components/sections/DashboardPreview";
import PricingSection from "./components/sections/PricingSection";
import { BlogSection, CTASection } from "./components/sections/BlogCTASection";

export default function HomePage() {
  return (
    <main className="relative">
      <Navbar />
      <Hero />
      <ProblemSection />
      <FeaturesSection />
      <HowItWorksSection />
      <MetricsSection />
      <DashboardPreview />
      <PricingSection />
      <BlogSection />
      <CTASection />
      <Footer />
    </main>
  );
}
