import { Flame, Zap, Trophy } from "lucide-react";

const levels = [
  { id: "easy", label: "Easy", desc: "Fundamentals & basic concepts", icon: Zap, color: "text-green-500" },
  { id: "medium", label: "Medium", desc: "Applied knowledge & problem solving", icon: Flame, color: "text-accent" },
  { id: "hard", label: "Hard", desc: "Advanced topics & system design", icon: Trophy, color: "text-destructive" },
];

interface Props {
  selected: string;
  onSelect: (id: string) => void;
}

const DifficultySelector = ({ selected, onSelect }: Props) => {
  return (
    <div className="grid gap-4">
      {levels.map((level) => (
        <button
          key={level.id}
          onClick={() => onSelect(level.id)}
          className={`p-5 rounded-xl border-2 text-left transition-all duration-200 flex items-center gap-4 ${
            selected === level.id
              ? "border-primary bg-primary/5 shadow-md"
              : "border-border hover:border-primary/30 bg-card"
          }`}
        >
          <level.icon className={`w-7 h-7 ${level.color}`} />
          <div>
            <p className="font-semibold">{level.label}</p>
            <p className="text-sm text-muted-foreground">{level.desc}</p>
          </div>
        </button>
      ))}
    </div>
  );
};

export default DifficultySelector;
