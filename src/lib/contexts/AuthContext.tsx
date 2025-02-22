import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { showToast } from "@/lib/utils/toast";

type User = {
  id: string;
  email: string;
  full_name: string;
  role: "admin" | "employee";
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: employee } = await supabase
          .from("employees")
          .select("*")
          .eq("auth_id", session.user.id)
          .single();

        if (employee) {
          setUser({
            id: employee.id,
            email: employee.email,
            full_name: employee.full_name,
            role: employee.role,
          });
        }
      }
      setLoading(false);
    };

    checkSession();

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        const { data: employee } = await supabase
          .from("employees")
          .select("*")
          .eq("auth_id", session.user.id)
          .single();

        if (employee) {
          setUser({
            id: employee.id,
            email: employee.email,
            full_name: employee.full_name,
            role: employee.role,
          });
        }
      } else if (event === "SIGNED_OUT") {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const {
        data: { user: authUser },
        error: authError,
      } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      if (authUser) {
        const { data: employee, error: employeeError } = await supabase
          .from("employees")
          .select("*")
          .eq("auth_id", authUser.id)
          .single();

        if (employeeError) throw employeeError;

        if (employee) {
          setUser({
            id: employee.id,
            email: employee.email,
            full_name: employee.full_name,
            role: employee.role,
          });
          showToast.success("Logged in successfully");
        }
      }
    } catch (error) {
      console.error("Error logging in:", error);
      showToast.error("Invalid email or password");
      throw error;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      showToast.success("Logged out successfully");
    } catch (error) {
      console.error("Error logging out:", error);
      showToast.error("Error logging out");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAdmin: user?.role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
