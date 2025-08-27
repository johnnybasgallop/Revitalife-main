"use client";

import { AuthError, Session, User } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (
    email: string,
    password: string,
    fullName: string
  ) => Promise<{ error: AuthError | null }>;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (data.user && !error) {
        console.log("User created successfully:", data.user);
        console.log("User ID:", data.user.id);
        console.log("User email:", data.user.email);

        try {
          // Wait a moment for user to be fully created in auth.users
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // Create profile record directly (user was created successfully above)
          const profileData = {
            id: data.user.id,
            email: data.user.email,
            full_name: fullName,
          };
          console.log("Attempting to create profile with data:", profileData);

          const { error: profileError } = await supabase
            .from("profiles")
            .insert([profileData]);

          if (profileError) {
            console.error("Error creating profile:", profileError);
            // Log more details about the error
            if (profileError.code) {
              console.error("Error code:", profileError.code);
            }
            if (profileError.message) {
              console.error("Error message:", profileError.message);
            }
            if (profileError.details) {
              console.error("Error details:", profileError.details);
            }
            if (profileError.hint) {
              console.error("Error hint:", profileError.hint);
            }
          } else {
            console.log("Profile created successfully");
          }
        } catch (profileErr) {
          console.error("Unexpected error creating profile:", profileErr);
        }
      }

      return { error };
    } catch (error) {
      return { error: error as AuthError };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    } catch (error) {
      return { error: error as AuthError };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      return { error };
    } catch (error) {
      return { error: error as AuthError };
    }
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
