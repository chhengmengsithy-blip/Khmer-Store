"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores/auth-store";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setSession, setLoading, setInitialized } = useAuthStore();

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) {
      setLoading(false);
      setInitialized(true);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser({
          id: session.user.id,
          email: session.user.email || "",
          role: "user",
          created_at: session.user.created_at,
          updated_at: session.user.updated_at || session.user.created_at,
        });
        setSession({
          access_token: session.access_token,
          refresh_token: session.refresh_token,
        });
      }
      setLoading(false);
      setInitialized(true);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser({
          id: session.user.id,
          email: session.user.email || "",
          role: "user",
          created_at: session.user.created_at,
          updated_at: session.user.updated_at || session.user.created_at,
        });
        setSession({
          access_token: session.access_token,
          refresh_token: session.refresh_token,
        });
      } else {
        setUser(null);
        setSession(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [setUser, setSession, setLoading, setInitialized]);

  return <>{children}</>;
}
