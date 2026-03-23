import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Upload, FileText, X, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import JobCategorySelector from "@/components/dashboard/JobCategorySelector";
import DifficultySelector from "@/components/dashboard/DifficultySelector";
import QuestionPanel from "@/components/dashboard/QuestionPanel";

const Dashboard = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.type === "application/pdf" || file.name.endsWith(".docx"))) {
      setResumeFile(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setResumeFile(file);
  };

  const canProceed = () => {
    if (step === 1) return !!resumeFile;
    if (step === 2) return !!selectedCategory;
    if (step === 3) return !!selectedDifficulty;
    return false;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Eye className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-heading font-bold text-lg">HireLens</span>
          </div>
          <Button variant="ghost" size="sm" onClick={async () => {
            await supabase.auth.signOut();
            toast.success("Logged out");
            navigate("/");
          }}>
            Log Out
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-6 py-10 max-w-3xl">
        {/* Progress */}
        {step < 4 && (
          <div className="flex items-center gap-2 mb-10">
            {["Upload Resume", "Select Role", "Difficulty"].map((label, i) => (
              <div key={label} className="flex items-center gap-2 flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  step > i + 1 ? "bg-primary text-primary-foreground" :
                  step === i + 1 ? "bg-primary text-primary-foreground" :
                  "bg-muted text-muted-foreground"
                }`}>
                  {i + 1}
                </div>
                <span className={`text-sm hidden sm:block ${step >= i + 1 ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                  {label}
                </span>
                {i < 2 && <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto" />}
              </div>
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-2xl font-bold mb-2">Upload Your Resume</h2>
              <p className="text-muted-foreground mb-6">We'll analyze your skills and experience to generate personalized questions.</p>

              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleFileDrop}
                className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors cursor-pointer ${
                  dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                }`}
                onClick={() => document.getElementById("file-input")?.click()}
              >
                <input id="file-input" type="file" accept=".pdf,.docx" className="hidden" onChange={handleFileSelect} />
                {resumeFile ? (
                  <div className="flex items-center justify-center gap-3">
                    <FileText className="w-8 h-8 text-primary" />
                    <div className="text-left">
                      <p className="font-medium">{resumeFile.name}</p>
                      <p className="text-sm text-muted-foreground">{(resumeFile.size / 1024).toFixed(1)} KB</p>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); setResumeFile(null); }} className="ml-4 p-1 rounded-full hover:bg-muted">
                      <X className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                    <p className="font-medium mb-1">Drop your resume here</p>
                    <p className="text-sm text-muted-foreground">PDF or DOCX — up to 10MB</p>
                  </>
                )}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-2xl font-bold mb-2">Select Target Role</h2>
              <p className="text-muted-foreground mb-6">Choose the job category you're preparing for.</p>
              <JobCategorySelector selected={selectedCategory} onSelect={setSelectedCategory} />
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-2xl font-bold mb-2">Choose Difficulty</h2>
              <p className="text-muted-foreground mb-6">Select the difficulty level for your practice session.</p>
              <DifficultySelector selected={selectedDifficulty} onSelect={setSelectedDifficulty} />
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <QuestionPanel
                category={selectedCategory}
                difficulty={selectedDifficulty}
                onBack={() => setStep(1)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {step < 4 && (
          <div className="flex justify-between mt-8">
            <Button variant="ghost" onClick={() => setStep(Math.max(1, step - 1))} disabled={step === 1}>
              Back
            </Button>
            <Button onClick={() => setStep(step + 1)} disabled={!canProceed()}>
              {step === 3 ? "Generate Questions" : "Continue"}
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
