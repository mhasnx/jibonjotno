"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

export default function AuthModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [isLoginTab, setIsLoginTab] = useState(true);
  const { t } = useLanguage();

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [loginError, setLoginError] = useState("");

  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regAddress, setRegAddress] = useState("");
  const [regPass, setRegPass] = useState("");
  const [regError, setRegError] = useState("");

  const { login, signup } = useAuth();

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    const success = login(loginEmail, loginPass);
    if (success) {
      onClose();
    } else {
      setLoginError(t("\u0987\u09AE\u09C7\u0987\u09B2 \u0985\u09A5\u09AC\u09BE \u09AA\u09BE\u09B8\u0993\u09DF\u09BE\u09B0\u09CD\u09A1 \u09B8\u09A0\u09BF\u0995 \u09A8\u09DF!", "Invalid email or password!"));
    }
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError("");
    const success = signup({ name: regName, email: regEmail, phone: regPhone, address: regAddress }, regPass);
    if (success) {
      onClose();
    } else {
      setRegError(t("\u098F\u0987 \u0987\u09AE\u09C7\u0987\u09B2 \u09A6\u09BF\u09DF\u09C7 \u0987\u09A4\u09BF\u09AA\u09C2\u09B0\u09CD\u09AC\u09C7 \u098F\u0995\u09BE\u0989\u09A8\u09CD\u099F \u0996\u09CB\u09B2\u09BE \u09B9\u09DF\u09C7\u099B\u09C7!", "Email is already registered!"));
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[70] flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className="bg-white rounded-3xl max-w-md w-full p-6 md:p-8 shadow-2xl border border-slate-200 relative overflow-hidden space-y-6"
          >
            <button
              onClick={onClose}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 font-bold text-lg w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center transition cursor-pointer"
            >
              ✕
            </button>

            <div className="text-center space-y-1">
              <div className="inline-block bg-emerald-100 text-emerald-900 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                {t("\u099C\u09C0\u09AC\u09A8\u09AF\u09A4\u09CD\u09A8 \u0987\u0989\u099C\u09BE\u09B0 \u09AA\u09CB\u09B0\u09CD\u099F\u09BE\u09B2", "JibonJotno User Portal")}
              </div>
              <h2 className="text-xl md:text-2xl font-black text-slate-900 pt-1">
                {isLoginTab
                  ? t("\u09B2\u0997\u0987\u09A8 \u0995\u09B0\u09C1\u09A8", "Sign In to Account")
                  : t("\u09A8\u09A4\u09C1\u09A8 \u098F\u0995\u09BE\u0989\u09A8\u09CD\u099F \u09A4\u09C8\u09B0\u09BF \u0995\u09B0\u09C1\u09A8", "Create Free Account")}
              </h2>
              <p className="text-xs text-slate-500">
                {isLoginTab
                  ? t("\u0986\u09AA\u09A8\u09BE\u09B0 \u09AA\u09CD\u09B0\u09CB\u09AB\u09BE\u0987\u09B2 \u0993 \u0985\u09B0\u09CD\u09A1\u09BE\u09B0 \u09A6\u09C7\u0996\u09A4\u09C7 \u09B2\u0997\u0987\u09A8 \u0995\u09B0\u09C1\u09A8", "Access your saved address & order history")
                  : t("\u09A4\u09A5\u09CD\u09AF \u09A6\u09BF\u09DF\u09C7 \u09A6\u09CD\u09B0\u09C1\u09A4 \u09AB\u09CD\u09B0\u09BF \u098F\u0995\u09BE\u0989\u09A8\u09CD\u099F \u0996\u09C1\u09B2\u09C1\u09A8", "Register for 1-click Cash on Delivery")}
              </p>
            </div>

            {isLoginTab ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs font-semibold">
                {loginError && (
                  <div className="bg-rose-50 text-rose-700 p-2.5 rounded-xl text-center font-bold">
                    ⚠️ {loginError}
                  </div>
                )}
                <div>
                  <label className="block text-slate-700 mb-1">{t("\u0987\u09AE\u09C7\u0987\u09B2 \u09A0\u09BF\u0995\u09BE\u09A8\u09BE", "Email Address")}</label>
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="user@gmail.com"
                    className="w-full p-3.5 rounded-xl border border-slate-200 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1">{t("\u09AA\u09BE\u09B8\u0993\u09DF\u09BE\u09B0\u09CD\u09A1", "Password")}</label>
                  <input
                    type="password"
                    value={loginPass}
                    onChange={(e) => setLoginPass(e.target.value)}
                    placeholder="••••••••"
                    className="w-full p-3.5 rounded-xl border border-slate-200"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#0f4c3a] hover:bg-emerald-900 text-white py-3.5 rounded-2xl font-black text-xs transition shadow-md cursor-pointer"
                >
                  {t("\u09B2\u0997\u0987\u09A8 \u0995\u09B0\u09C1\u09A8 \u2192", "Login \u2192")}
                </button>

                <div className="text-center pt-2 text-xs text-slate-500">
                  {t("\u0995\u09CB\u09A8\u09CB \u098F\u0995\u09BE\u0989\u09A8\u09CD\u099F \u09A8\u09C7\u0987?", "Don't have an account?")}{" "}
                  <button
                    type="button"
                    onClick={() => setIsLoginTab(false)}
                    className="text-[#0f4c3a] font-black hover:underline cursor-pointer"
                  >
                    {t("\u09B8\u09BE\u0987\u09A8 \u0986\u09AA \u0995\u09B0\u09C1\u09A8", "Sign Up")}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSignupSubmit} className="space-y-3 text-xs font-semibold">
                {regError && (
                  <div className="bg-rose-50 text-rose-700 p-2.5 rounded-xl text-center font-bold">
                    ⚠️ {regError}
                  </div>
                )}
                <div>
                  <label className="block text-slate-700 mb-1">{t("\u09AA\u09C2\u09B0\u09CD\u09A3 \u09A8\u09BE\u09AE *", "Full Name *")}</label>
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder={t("\u0986\u09AA\u09A8\u09BE\u09B0 \u09A8\u09BE\u09AE", "Your Name")}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1">{t("\u0987\u09AE\u09C7\u0987\u09B2 \u09A0\u09BF\u0995\u09BE\u09A8\u09BE *", "Email *")}</label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="user@gmail.com"
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-mono"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-700 mb-1">{t("\u09AE\u09CB\u09AC\u09BE\u0987\u09B2 *", "Mobile *")}</label>
                    <input
                      type="tel"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="01XXXXXXXXX"
                      className="w-full p-2.5 rounded-xl border border-slate-200 font-mono"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 mb-1">{t("\u09AA\u09BE\u09B8\u0993\u09DF\u09BE\u09B0\u09CD\u09A1 *", "Password *")}</label>
                    <input
                      type="password"
                      value={regPass}
                      onChange={(e) => setRegPass(e.target.value)}
                      placeholder="••••••••"
                      className="w-full p-2.5 rounded-xl border border-slate-200"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-slate-700 mb-1">{t("\u09A1\u09C7\u09B2\u09BF\u09AD\u09BE\u09B0\u09BF \u09A0\u09BF\u0995\u09BE\u09A8\u09BE *", "Delivery Address *")}</label>
                  <input
                    type="text"
                    value={regAddress}
                    onChange={(e) => setRegAddress(e.target.value)}
                    placeholder={t("\u09AC\u09BE\u09B8\u09BE, \u09B0\u09CB\u09A1 \u0993 \u098F\u09B2\u09BE\u0995\u09BE...", "House, Road & Area...")}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#0f4c3a] hover:bg-emerald-900 text-white py-3 rounded-2xl font-black text-xs transition shadow-md mt-1 cursor-pointer"
                >
                  {t("\u09B8\u09BE\u0987\u09A8 \u0986\u09AA \u0993 \u098F\u0995\u09BE\u0989\u09A8\u09CD\u099F \u0996\u09C1\u09B2\u09C1\u09A8 \u2192", "Create Account \u2192")}
                </button>

                <div className="text-center pt-2 text-xs text-slate-500">
                  {t("\u0987\u09A4\u09BF\u09AE\u09A7\u09CD\u09AF\u09C7\u0987 \u098F\u0995\u09BE\u0989\u09A8\u09CD\u099F \u0986\u099B\u09C7?", "Already have an account?")}{" "}
                  <button
                    type="button"
                    onClick={() => setIsLoginTab(true)}
                    className="text-[#0f4c3a] font-black hover:underline cursor-pointer"
                  >
                    {t("\u09B2\u0997\u0987\u09A8 \u0995\u09B0\u09C1\u09A8", "Login")}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}