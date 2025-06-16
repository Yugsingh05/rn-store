import { supabase } from "@/lib/supabase";
import { Session, User } from "@supabase/supabase-js";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

export type AuthContextType = {
  session: Session | null;
  user: any | null; // Replace 'any' with your custom user type if available
  mounting: boolean;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  mounting: true,
});

export default function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<any | null>(null); // Custom user from DB
  const [mounting, setMounting] = useState(true);

  useEffect(() => {
    const bootstrapAsync = async () => {
      const { data: authData } = await supabase.auth.getSession();
      const fetchedSession = authData.session;
      setSession(fetchedSession);

      if (fetchedSession?.user) {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", fetchedSession.user.id)
          .single();

        if (error) {
          console.error("Error fetching custom user data:", error);
          setUser(null);
        } else {
          setUser(data);
        }
      } else {
        setUser(null);
      }

      setMounting(false);
    };

    bootstrapAsync();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        setSession(newSession);

        if (newSession?.user) {
          const { data, error } = await supabase
            .from("users")
            .select("*")
            .eq("id", newSession.user.id)
            .single();

          if (error) {
            console.error("Error refreshing custom user data:", error);
            setUser(null);
          } else {
            setUser(data);
          }
        } else {
          setUser(null);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ session, user, mounting }}>
      {!mounting && children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};