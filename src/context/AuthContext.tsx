import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Role = "USER" | "ADMIN" | "SUPER";

export interface User {
  id?: number;
  nome?: string;
  email?: string;
  tipoUsuario?: Role;
  token?: string;
}

interface AuthContextValue {
  user: User | null;
  setUser: (u: User | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const raw = localStorage.getItem("cc_user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) localStorage.setItem("cc_user", JSON.stringify(user));
    else localStorage.removeItem("cc_user");
  }, [user]);

  function logout() {
    setUser(null);
  }

  return <AuthContext.Provider value={{ user, setUser, logout }}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
