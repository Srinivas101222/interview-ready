import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImg from "@/assets/hero-illustration.png";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[90vh] bg-hero overflow-hidden flex items-center">
      {/* Decorative circles */}
      <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-10 right-20 w-96 h-96 rounded-full bg-accent/5 blur-3xl" />

      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">AI-Powered Interview Prep</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              <span className="text-primary-foreground">Ace Your Next</span>
              <br />
              <span className="text-gradient-primary">Interview</span>
              <span className="text-primary-foreground"> with</span>
              <br />
              <span className="text-gradient-accent">HireLens</span>
            </h1>

            <p className="text-lg text-muted-foreground mb-8 max-w-lg leading-relaxed">
              Upload your resume, pick your target role, and get personalized interview questions
              tailored to your skills and experience. Practice smarter, land faster.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button variant="hero" size="lg" onClick={() => navigate("/dashboard")} className="group">
                Start Practicing
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="heroOutline" size="lg" onClick={() => {
                document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
              }}>
                Learn More
              </Button>
            </div>

            <div className="mt-10 flex items-center gap-6">
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full bg-primary/20 border-2 border-primary/30 flex items-center justify-center text-xs font-bold text-primary">
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div>
                <p className="text-sm font-semibold text-primary-foreground">1,000+ Students</p>
                <p className="text-xs text-muted-foreground">Already preparing smarter</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="hidden lg:flex justify-center"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-primary/10 rounded-3xl blur-2xl scale-110" />
              <img
                src={heroImg}
                alt="HireLens interview preparation platform illustration"
                className="relative rounded-3xl w-full max-w-lg animate-float"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
