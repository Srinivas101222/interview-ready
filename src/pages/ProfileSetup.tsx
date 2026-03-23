import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const branches = ["CSE", "EEE", "ECE", "Civil", "Mechanical", "IT", "Other"] as const;
const jobRoles = [
  "Software Developer", "Web Developer", "Data Analyst", "Data Scientist",
  "AI/ML Engineer", "DevOps Engineer", "Cloud Engineer", "Mobile Developer",
  "Civil Engineer", "Electrical Engineer", "Mechanical Engineer",
];

const ProfileSetup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState("");
  const [education, setEducation] = useState("");
  const [branch, setBranch] = useState("");
  const [preferredJobRole, setPreferredJobRole] = useState("");
  const [locationPreference, setLocationPreference] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState<string[]>([]);

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("profiles").select("*").eq("user_id", user.id).single();
      if (data) {
        setFullName(data.full_name || "");
        setEducation(data.education || "");
        setBranch(data.branch || "");
        setPreferredJobRole(data.preferred_job_role || "");
        setLocationPreference(data.location_preference || "");
        setSkills(data.skills || []);
      }
    };
    loadProfile();
  }, []);

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setSkillInput("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("profiles").update({
        full_name: fullName,
        education,
        branch: branch as any,
        skills,
        preferred_job_role: preferredJobRole,
        location_preference: locationPreference,
        updated_at: new Date().toISOString(),
      }).eq("user_id", user.id);

      if (error) throw error;
      toast.success("Profile saved!");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 h-16 flex items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Eye className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-heading font-bold text-lg">HireLens</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-10 max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold mb-2">Complete Your Profile</h1>
          <p className="text-muted-foreground mb-8">Tell us about yourself so we can personalize your interview prep.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="education">Education</Label>
                <Input id="education" placeholder="B.Tech, M.Tech, etc." value={education} onChange={(e) => setEducation(e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Branch</Label>
                <Select value={branch} onValueChange={setBranch}>
                  <SelectTrigger><SelectValue placeholder="Select branch" /></SelectTrigger>
                  <SelectContent>
                    {branches.map((b) => (
                      <SelectItem key={b} value={b}>{b}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Preferred Job Role</Label>
                <Select value={preferredJobRole} onValueChange={setPreferredJobRole}>
                  <SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
                  <SelectContent>
                    {jobRoles.map((r) => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location Preference</Label>
              <Input id="location" placeholder="e.g. Bangalore, Remote, Any" value={locationPreference} onChange={(e) => setLocationPreference(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label>Skills</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Type a skill and press Add"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }}
                />
                <Button type="button" variant="outline" onClick={addSkill}>Add</Button>
              </div>
              {skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="gap-1">
                      {skill}
                      <button type="button" onClick={() => setSkills(skills.filter((s) => s !== skill))}>
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? "Saving..." : "Save & Continue"}
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfileSetup;
