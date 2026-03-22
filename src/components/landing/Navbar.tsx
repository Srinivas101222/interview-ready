import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-foreground/5 backdrop-blur-xl border-b border-border/10">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Eye className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-heading font-bold text-lg text-foreground">HireLens</span>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate("/auth")}>
            Log In
          </Button>
          <Button variant="default" size="sm" onClick={() => navigate("/auth")}>
            Sign Up
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
