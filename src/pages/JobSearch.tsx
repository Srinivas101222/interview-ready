import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, Search, MapPin, Briefcase, ExternalLink, Bookmark, Filter, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  experience: string;
  skills: string[];
  source: string;
  posted: string;
  url: string;
  salary: string;
};

const JobSearch = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const { data, error } = await supabase.functions.invoke("search-jobs", {
        body: { query: query.trim(), location: location.trim() },
      });
      if (error) throw error;
      if (data?.success) {
        setJobs(data.data);
      } else {
        toast.error(data?.error || "Search failed");
      }
    } catch (err: any) {
      toast.error("Failed to search jobs");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const saveJob = async (job: Job) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { toast.error("Please log in"); return; }

      const { error } = await supabase.from("job_applications").insert({
        user_id: user.id,
        company: job.company,
        role: job.title,
        location: job.location,
        job_url: job.url,
        source: job.source,
        status: "saved",
      } as any);
      if (error) throw error;
      toast.success(`Saved ${job.title} at ${job.company}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to save");
    }
  };

  const applyJob = async (job: Job) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { toast.error("Please log in"); return; }

      await supabase.from("job_applications").insert({
        user_id: user.id,
        company: job.company,
        role: job.title,
        location: job.location,
        job_url: job.url,
        source: job.source,
        status: "applied",
        applied_at: new Date().toISOString(),
      } as any);

      window.open(job.url, "_blank");
      toast.success("Opening application page & tracking it!");
    } catch (err: any) {
      toast.error(err.message || "Failed");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/dashboard")}>
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Eye className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-heading font-bold text-lg">HireLens</span>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => navigate("/applications")}>
              My Applications
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
              Dashboard
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold mb-2">Job Search</h1>
          <p className="text-muted-foreground mb-6">Find and apply to jobs matching your skills</p>

          {/* Search bar */}
          <div className="flex gap-3 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Job title, e.g. Software Developer"
                className="pl-10"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <div className="relative w-48">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Location"
                className="pl-10"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch} disabled={loading || !query.trim()}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Search"}
            </Button>
          </div>

          {/* Results */}
          {loading && (
            <div className="text-center py-16">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary mb-3" />
              <p className="text-muted-foreground">Searching across LinkedIn, Naukri, Indeed, Internshala...</p>
            </div>
          )}

          {!loading && searched && jobs.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No jobs found. Try different keywords.</p>
            </div>
          )}

          {!loading && jobs.length > 0 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">{jobs.length} jobs found</p>
              {jobs.map((job, i) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-card rounded-xl p-5 hover:border-primary/30 transition-colors"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg">{job.title}</h3>
                        <Badge variant="outline" className="text-xs">{job.type}</Badge>
                      </div>
                      <p className="text-muted-foreground font-medium">{job.company}</p>
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{job.location}</span>
                        <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" />{job.experience}</span>
                        <span>{job.salary}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {job.skills.map((s) => (
                          <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                        <span>via {job.source}</span>
                        <span>• {job.posted}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 shrink-0">
                      <Button size="sm" onClick={() => applyJob(job)}>
                        Apply <ExternalLink className="w-3.5 h-3.5 ml-1" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => saveJob(job)}>
                        <Bookmark className="w-3.5 h-3.5 mr-1" /> Save
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {!searched && !loading && (
            <div className="text-center py-16">
              <Search className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium mb-2">Search for Jobs</h3>
              <p className="text-muted-foreground">Enter a job title and location to find openings across multiple platforms</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default JobSearch;
