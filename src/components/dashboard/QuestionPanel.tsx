import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, ChevronLeft, CheckCircle2, XCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

const sampleQuestions = [
  { id: 1, category: "Resume", question: "Tell me about a challenging project you worked on. What was your role and how did you overcome obstacles?", type: "behavioral" },
  { id: 2, category: "Technical", question: "Explain the difference between a stack and a queue. When would you use each?", type: "technical" },
  { id: 3, category: "Aptitude", question: "If a task takes 8 machines 10 days to complete, how many days would it take 5 machines?", type: "aptitude" },
  { id: 4, category: "Coding", question: "Write a function to check if a string is a palindrome. Consider edge cases like spaces and capitalization.", type: "coding" },
  { id: 5, category: "Technical", question: "What is the time complexity of binary search? Explain how it works step by step.", type: "technical" },
];

interface Props {
  category: string;
  difficulty: string;
  onBack: () => void;
}

const QuestionPanel = ({ category, difficulty, onBack }: Props) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const question = sampleQuestions[currentIdx];

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const handleNext = () => {
    setCurrentIdx((prev) => Math.min(prev + 1, sampleQuestions.length - 1));
    setAnswer("");
    setSubmitted(false);
  };

  const categoryLabel = category.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const diffLabel = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Practice Session</h2>
          <div className="flex gap-2 mt-2">
            <Badge variant="secondary">{categoryLabel}</Badge>
            <Badge variant="outline">{diffLabel}</Badge>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onBack}>
          <RotateCcw className="w-4 h-4 mr-1" /> Start Over
        </Button>
      </div>

      {/* Progress */}
      <div className="flex gap-1 mb-8">
        {sampleQuestions.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i <= currentIdx ? "bg-primary" : "bg-muted"
            }`}
          />
        ))}
      </div>

      <motion.div
        key={currentIdx}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-xl p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Badge className="bg-primary/10 text-primary border-0">{question.category}</Badge>
          <span className="text-sm text-muted-foreground">Question {currentIdx + 1} of {sampleQuestions.length}</span>
        </div>

        <p className="text-lg font-medium mb-6 leading-relaxed">{question.question}</p>

        <Textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type your answer here..."
          className="min-h-[120px] mb-4"
          disabled={submitted}
        />

        {submitted && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-lg bg-primary/5 border border-primary/20 mb-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <span className="font-semibold text-sm">AI Feedback</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Good attempt! Your answer covers the key points. Consider adding more specific examples
              and quantifying your impact where possible. Structure your response using the STAR method
              (Situation, Task, Action, Result) for behavioral questions.
            </p>
          </motion.div>
        )}

        <div className="flex justify-between">
          <Button
            variant="ghost"
            onClick={() => { setCurrentIdx(Math.max(0, currentIdx - 1)); setAnswer(""); setSubmitted(false); }}
            disabled={currentIdx === 0}
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </Button>

          {!submitted ? (
            <Button onClick={handleSubmit} disabled={!answer.trim()}>
              Submit Answer
            </Button>
          ) : (
            <Button onClick={handleNext} disabled={currentIdx === sampleQuestions.length - 1}>
              Next Question <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default QuestionPanel;
