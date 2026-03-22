import { Code2, Database, Globe, Brain, BarChart3, Cpu } from "lucide-react";

const categories = [
  { id: "software-dev", label: "Software Developer", icon: Code2 },
  { id: "web-dev", label: "Web Developer", icon: Globe },
  { id: "data-analyst", label: "Data Analyst", icon: BarChart3 },
  { id: "data-scientist", label: "Data Scientist", icon: Database },
  { id: "ai-ml", label: "AI/ML Engineer", icon: Brain },
  { id: "devops", label: "DevOps Engineer", icon: Cpu },
];

interface Props {
  selected: string;
  onSelect: (id: string) => void;
}

const JobCategorySelector = ({ selected, onSelect }: Props) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={`p-5 rounded-xl border-2 text-left transition-all duration-200 ${
            selected === cat.id
              ? "border-primary bg-primary/5 shadow-md"
              : "border-border hover:border-primary/30 bg-card"
          }`}
        >
          <cat.icon className={`w-7 h-7 mb-3 ${selected === cat.id ? "text-primary" : "text-muted-foreground"}`} />
          <p className="font-medium text-sm">{cat.label}</p>
        </button>
      ))}
    </div>
  );
};

export default JobCategorySelector;
