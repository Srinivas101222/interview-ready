import { motion } from "framer-motion";
import { Upload, Search, ListChecks, Trophy } from "lucide-react";

const steps = [
  { icon: Upload, title: "Upload Resume", desc: "Upload your PDF or DOCX resume to get started." },
  { icon: Search, title: "AI Analysis", desc: "Our AI extracts your skills, projects, and experience." },
  { icon: ListChecks, title: "Practice Questions", desc: "Answer personalized questions across multiple categories." },
  { icon: Trophy, title: "Get Ready", desc: "Build confidence with feedback and improve your weak areas." },
];

const HowItWorksSection = () => {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How <span className="text-gradient-accent">HireLens</span> Works
          </h2>
          <p className="text-muted-foreground text-lg">Four simple steps to interview success</p>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="text-center relative"
            >
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-border" />
              )}
              <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center mx-auto mb-4 relative z-10">
                <step.icon className="w-7 h-7 text-primary" />
              </div>
              <div className="text-xs font-bold text-accent mb-2">Step {i + 1}</div>
              <h3 className="font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
