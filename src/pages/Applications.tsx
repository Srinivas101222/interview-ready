import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Eye, ExternalLink, Trash2, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Application = {
  id: string;
  company: string;
  role: string;
  location: string | null;
  job_url: string | null;
  source: string | null;
  status: string;
  notes: string | null;
  applied_at: string | null;
  created_at: string;
};

const statusColors: Record<string, string> = {
  saved: "bg-muted text-muted-foreground",
  applied: "bg-primary/15 text-primary",
  interview: "bg-accent/15 text-accent-foreground",
  offer: "bg-green-500/15 text-green-700 dark:text-green-400",
  rejected: "bg-destructive/15 text-destructive",
};

const Applications = () => {
  const navigate = useNavigate();
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newApp, setNewApp] = useState({ company: "", role: "", location: "", job_url: "" });

  const fetchApps = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data, error } = await supabase
      .from("job_applications")
      .select("*")
      .order("created_at", { ascending: false }) as any;
    if (!error && data) setApps(data);
    setLoading(false);
  };

  useEffect(() => { fetchApps(); }, []);

  const addApp = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase.from("job_applications").insert({
      user_id: user.id,
      company: newApp.company,
      role: newApp.role,
      location: newApp.location || null,
      job_url: newApp.job_url || null,
      status: "applied",
      applied_at: new Date().toISOString(),
    } as any);
    if (error) { toast.error(error.message); return; }
    toast.success("Application added!");
    setNewApp({ company: "", role: "", location: "", job_url: "" });
    setDialogOpen(false);
    fetchApps();
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("job_applications").update({ status } as any).eq("id", id) as any;
    if (error) { toast.error(error.message); return; }
    setApps((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    toast.success("Status updated");
  };

  const deleteApp = async (id: string) => {
    const { error } = await supabase.from("job_applications").delete().eq("id", id) as any;
    if (error) { toast.error(error.message); return; }
    setApps((prev) => prev.filter((a) => a.id !== id));
    toast.success("Removed");
  };

  const filtered = filter === "all" ? apps : apps.filter((a) => a.status === filter);
  const counts = {
    all: apps.length,
    saved: apps.filter((a) => a.status === "saved").length,
    applied: apps.filter((a) => a.status === "applied").length,
    interview: apps.filter((a) => a.status === "interview").length,
    offer: apps.filter((a) => a.status === "offer").length,
    rejected: apps.filter((a) => a.status === "rejected").length,
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
            <Button variant="ghost" size="sm" onClick={() => navigate("/jobs")}>Job Search</Button>
            <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>Dashboard</Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">My Applications</h1>
              <p className="text-muted-foreground">Track your job application progress</p>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button><Plus className="w-4 h-4 mr-1" /> Add Application</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Add Application</DialogTitle></DialogHeader>
                <div className="space-y-3 pt-2">
                  <div><Label>Company *</Label><Input value={newApp.company} onChange={(e) => setNewApp({ ...newApp, company: e.target.value })} placeholder="e.g. TCS" /></div>
                  <div><Label>Role *</Label><Input value={newApp.role} onChange={(e) => setNewApp({ ...newApp, role: e.target.value })} placeholder="e.g. Software Developer" /></div>
                  <div><Label>Location</Label><Input value={newApp.location} onChange={(e) => setNewApp({ ...newApp, location: e.target.value })} placeholder="e.g. Bangalore" /></div>
                  <div><Label>Job URL</Label><Input value={newApp.job_url} onChange={(e) => setNewApp({ ...newApp, job_url: e.target.value })} placeholder="https://..." /></div>
                  <Button className="w-full" onClick={addApp} disabled={!newApp.company || !newApp.role}>Save Application</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Status filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            {(["all", "saved", "applied", "interview", "offer", "rejected"] as const).map((s) => (
              <Button
                key={s}
                variant={filter === s ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(s)}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)} ({counts[s]})
              </Button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-16"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" /></div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No applications yet. Search for jobs or add one manually!</p>
              <Button className="mt-4" onClick={() => navigate("/jobs")}>Search Jobs</Button>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((app, i) => (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="glass-card rounded-xl p-4 flex items-center justify-between gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold truncate">{app.role}</h3>
                      <Badge className={`text-xs ${statusColors[app.status] || ""}`}>{app.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{app.company}{app.location ? ` • ${app.location}` : ""}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {app.source && `via ${app.source} • `}
                      {app.applied_at ? `Applied ${new Date(app.applied_at).toLocaleDateString()}` : `Saved ${new Date(app.created_at).toLocaleDateString()}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Select value={app.status} onValueChange={(v) => updateStatus(app.id, v)}>
                      <SelectTrigger className="w-28 h-8 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="saved">Saved</SelectItem>
                        <SelectItem value="applied">Applied</SelectItem>
                        <SelectItem value="interview">Interview</SelectItem>
                        <SelectItem value="offer">Offer</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                    {app.job_url && (
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => window.open(app.job_url!, "_blank")}>
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteApp(app.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Applications;
