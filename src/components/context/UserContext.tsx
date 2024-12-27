import { supabase } from "@/integrations/supabase/client";
import { createContext, useContext, useEffect, useState } from "react";

interface UserContextType {
  currentUser: {
    id: string;
    name: string;
    email: string;
    username: string;
    avatar?: string;
    bio?: string;
  };
  isAuthenticated: boolean | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: authData, error: authError } =
          await supabase.auth.getUser();
        if (authError) throw authError;
        const user = {
          id: authData.user.id,
          email: authData.user.email,
          name: authData.user.user_metadata.name,
          username: authData.user.user_metadata.name,
          bio: authData.user.user_metadata.bio,
          ...authData.user,
        };
        setCurrentUser(user);
      } catch (error) {
        console.error("Error fetching user:", error.message);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      if (session) {
        const user = {
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata.name,
          username: session.user.user_metadata.name,
          bio: session.user.user_metadata.bio,
          ...session.user,
        };
        setCurrentUser(user);
      }else{
        setCurrentUser(null);
      }

    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ currentUser, isAuthenticated }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
