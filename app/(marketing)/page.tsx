import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import FeaturesGrid from "@/components/sections/FeaturesGrid";
import WorkflowSection from "@/components/sections/WorkflowSection";
import CTASection from "@/components/sections/CTASection";

export default function MarketingPage() {
  return (
    <div className="min-h-screen bg-p-surface text-p-on-surface">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesGrid />
        <WorkflowSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
