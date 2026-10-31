"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface AuthContextType {
  currentUser: UserProfile | null;
  login: (email: string, pass: string) => boolean;
  signup: (profile: UserProfile, pass: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    try {
      const activeUser = localStorage.getItem("jj_active_user");
      if (activeUser) setCurrentUser(JSON.parse(activeUser));
    } catch {}
  }, []);

  const login = (email: string, pass: string): boolean => {
    try {
      const users = JSON.parse(localStorage.getItem("jj_registered_users") || "[]");
      const found = users.find((u: any) => u.email === email.toLowerCase() && u.pass === pass);
      if (found) {
        const profile = { name: found.name, email: found.email, phone: found.phone, address: found.address };
        setCurrentUser(profile);
        localStorage.setItem("jj_active_user", JSON.stringify(profile));
        return true;
      }
    } catch {}
    return false;
  };

  const signup = (profile: UserProfile, pass: string): boolean => {
    try {
      const users = JSON.parse(localStorage.getItem("jj_registered_users") || "[]");
      const exists = users.some((u: any) => u.email === profile.email.toLowerCase());
      if (exists) return false;

      const newUser = { ...profile, email: profile.email.toLowerCase(), pass };
      users.push(newUser);
      localStorage.setItem("jj_registered_users", JSON.stringify(users));
      setCurrentUser(profile);
      localStorage.setItem("jj_active_user", JSON.stringify(profile));
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("jj_active_user");
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}