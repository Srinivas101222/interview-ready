import { motion } from "framer-motion";
import { FileText, Brain, Code2, BarChart3, Target, Zap } from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Resume Analysis",
    description: "Upload your resume and our AI extracts skills, projects, and experience to personalize your prep.",
  },
  {
    icon: Target,
    title: "Role-Based Questions",
    description: "Select your target role — Software Dev, Data Analyst, ML Engineer — and get relevant questions.",
  },
  {
    icon: Brain,
    title: "Aptitude & Technical",
    description: "Practice aptitude reasoning, technical concepts, and domain-specific knowledge questions.",
  },
  {
    icon: Code2,
    title: "Coding Challenges",
    description: "Tackle coding problems matched to your skill level with hints and solution walkthroughs.",
  },
  {
    icon: BarChart3,
    title: "Difficulty Levels",
    description: "Choose Easy, Medium, or Hard to progressively build your confidence and competence.",
  },
  {
    icon: Zap,
    title: "Instant Feedback",
    description: "Get AI-powered evaluation of your answers with improvement suggestions in real time.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything You Need to <span className="text-gradient-primary">Prepare</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            From resume analysis to personalized questions, HireLens covers every aspect of interview preparation.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card rounded-xl p-6 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
