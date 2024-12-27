import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../shared/Button";
import { Avatar } from "../shared/Avatar";
import { Home, User, PlusCircle, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/auth");
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-semibold">
          Social
        </Link>

        <div className="flex items-center space-x-6">
          <Link to="/">
            <Button
              variant={isActive("/") ? "default" : "ghost"}
              size="sm"
              className="gap-2"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </Button>
          </Link>
          <Link to="/create-post">
            <Button variant="outline" size="sm" className="gap-2">
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Create</span>
            </Button>
          </Link>

          <Link to="/profile">
            <Button
              variant={isActive("/profile") ? "default" : "ghost"}
              size="sm"
              className="gap-2"
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Profile</span>
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="sm"
            className="gap-2"
            onClick={handleSignOut}
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </Button>
        </div>
      </div>
    </nav>
  );
};
