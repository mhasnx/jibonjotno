"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { looksLikeSha256Hex, saltedPasswordDigest, timingSafeEqualHex } from "@/lib/auth/sha256";

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface StoredUser extends UserProfile {
  passwordHash?: string;
  pass?: string;
}

interface AuthContextType {
  currentUser: UserProfile | null;
  login: (email: string, pass: string) => Promise<boolean>;
  signup: (profile: UserProfile, pass: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function profileFromStored(user: StoredUser): UserProfile {
  return { name: user.name, email: user.email, phone: user.phone, address: user.address };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    try {
      const activeUser = localStorage.getItem("jj_active_user");
      if (activeUser) setCurrentUser(JSON.parse(activeUser));
    } catch {}
  }, []);

  const login = async (email: string, pass: string): Promise<boolean> => {
    try {
      const users: StoredUser[] = JSON.parse(localStorage.getItem("jj_registered_users") || "[]");
      const normalized = email.toLowerCase();
      const incomingHash = await saltedPasswordDigest(normalized, pass);
      const foundIndex = users.findIndex((u) => u.email === normalized);
      if (foundIndex < 0) return false;

      const found = users[foundIndex];
      const storedHash = found.passwordHash;
      const legacyPass = found.pass;
      const hashOk = storedHash && looksLikeSha256Hex(storedHash) && timingSafeEqualHex(storedHash.toLowerCase(), incomingHash);
      const legacyOk = Boolean(legacyPass) && legacyPass === pass && !storedHash;

      if (!hashOk && !legacyOk) return false;

      if (legacyOk || (hashOk && legacyPass)) {
        users[foundIndex] = { ...found, passwordHash: incomingHash };
        delete users[foundIndex].pass;
        localStorage.setItem("jj_registered_users", JSON.stringify(users));
      }

      const profile = profileFromStored(found);
      setCurrentUser(profile);
      localStorage.setItem("jj_active_user", JSON.stringify(profile));
      return true;
    } catch {
      return false;
    }
  };

  const signup = async (profile: UserProfile, pass: string): Promise<boolean> => {
    try {
      const users: StoredUser[] = JSON.parse(localStorage.getItem("jj_registered_users") || "[]");
      const email = profile.email.toLowerCase();
      const exists = users.some((u) => u.email === email);
      if (exists) return false;

      const passwordHash = await saltedPasswordDigest(email, pass);
      const newUser: StoredUser = { ...profile, email, passwordHash };
      users.push(newUser);
      localStorage.setItem("jj_registered_users", JSON.stringify(users));
      const safeProfile = { name: profile.name, email, phone: profile.phone, address: profile.address };
      setCurrentUser(safeProfile);
      localStorage.setItem("jj_active_user", JSON.stringify(safeProfile));
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
