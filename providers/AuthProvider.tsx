import { supabase } from "@/lib/supabase";
import { Session, User } from "@supabase/supabase-js";
import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";

export type AuthContextType = {
  session: Session | null;
  user: User | null;
  mounting: boolean;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  mounting: true,
});

export default function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [mounting, setMounting] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);

    //   if (session) {
    //     const { data: user, error } = await supabase
    //       .from("users")
    //       .select("*")
    //       .eq("id", session.user.id)
    //       .single();

    //     if (user) {
    //       setUser(user);
    //     } else {
    //       console.log("No user found", error);
    //     }
    //   }

      setMounting(false);
    };

    fetchSession();
    supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <AuthContext.Provider value={{ session, user, mounting }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
