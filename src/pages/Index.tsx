import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import CTASection from "@/components/landing/CTASection";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CTASection />
      <footer className="py-8 bg-hero border-t border-border/10">
        <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
          © 2026 HireLens. Built to help you land your dream job.
        </div>
      </footer>
    </div>
  );
};

export default Index;
