"use client";

import React, { useState, useEffect } from "react";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "Super Admin" | "Admin" | "Moderator" | "Pharmacist";
  addedAt: string;
}

export default function AdminTeamPage() {
  const [mounted, setMounted] = useState(false);
  const [team, setTeam] = useState<TeamMember[]>([
    {
      id: "super-1",
      name: "Mahmudul Hasan (Owner)",
      email: "mahmudulhm2003@gmail.com",
      role: "Super Admin",
      addedAt: "মূল অ্যাডমিন একাউন্ট",
    },
  ]);

  const [inviteModal, setInviteModal] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<TeamMember["role"]>("Admin");

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("jj_admin_team_real");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTeam(parsed);
        }
      } catch {}
    }
  }, []);

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !name.trim()) return;

    const newMember: TeamMember = {
      id: `member-${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role,
      addedAt: new Date().toLocaleDateString("bn-BD"),
    };

    const updated = [...team, newMember];
    setTeam(updated);
    localStorage.setItem("jj_admin_team_real", JSON.stringify(updated));
    setName("");
    setEmail("");
    setInviteModal(false);
  };

  const handleRemove = (id: string) => {
    if (id === "super-1" || team.find((m) => m.id === id)?.email === "mahmudulhm2003@gmail.com") {
      alert("সুপার অ্যাডমিন একাউন্ট ডিলিট করা সম্ভব নয়!");
      return;
    }
    if (confirm("Apni ki shotti ei team member-ke remove korte chan?")) {
      const updated = team.filter((m) => m.id !== id);
      setTeam(updated);
      localStorage.setItem("jj_admin_team_real", JSON.stringify(updated));
    }
  };

  if (!mounted) {
    return <div className="p-8 text-center text-xs font-bold text-slate-400">টিম ডাটা লোড হচ্ছে...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900">টিম ও রোল অ্যাক্সেস (Team & RBAC)</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            শুধুমাত্র আপনার অনুমোদিত সক্রিয় টিম সদস্যদের তালিকা (কোনো ফেক বা স্বয়ংক্রিয় ইউজার নেই)।
          </p>
        </div>
        <button
          onClick={() => setInviteModal(true)}
          className="bg-[#0f4c3a] hover:bg-emerald-950 text-white px-5 py-2.5 rounded-2xl text-xs font-bold transition shadow-xs flex items-center space-x-1.5 shrink-0"
        >
          <span>➕ নতুন সদস্য যুক্ত করুন</span>
        </button>
      </div>

      {/* Team Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200/80 text-[11px] uppercase tracking-wider">
              <th className="py-3.5 px-4">সদস্যের নাম</th>
              <th className="py-3.5 px-4">অ্যাক্সেস ইমেইল</th>
              <th className="py-3.5 px-4">রোল ও অধিকার</th>
              <th className="py-3.5 px-4">যুক্ত হওয়ার তারিখ</th>
              <th className="py-3.5 px-4 text-right">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {team.map((m) => (
              <tr key={m.id} className="hover:bg-slate-50/70 transition">
                <td className="py-3.5 px-4 font-extrabold text-slate-900">
                  <div className="flex items-center space-x-2">
                    <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-900 flex items-center justify-center font-black text-xs">
                      {m.name.charAt(0)}
                    </span>
                    <span>{m.name}</span>
                  </div>
                </td>
                <td className="py-3.5 px-4 font-mono font-medium text-slate-700">
                  {m.email}
                </td>
                <td className="py-3.5 px-4">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${
                      m.role === "Super Admin"
                        ? "bg-purple-50 text-purple-800 border-purple-200"
                        : m.role === "Admin"
                        ? "bg-blue-50 text-blue-800 border-blue-200"
                        : "bg-emerald-50 text-emerald-800 border-emerald-200"
                    }`}
                  >
                    {m.role}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-slate-400 text-[11px] font-medium">
                  {m.addedAt}
                </td>
                <td className="py-3.5 px-4 text-right">
                  {m.role !== "Super Admin" ? (
                    <button
                      onClick={() => handleRemove(m.id)}
                      className="bg-rose-50 text-rose-700 hover:bg-rose-100 px-3 py-1 rounded-lg text-xs font-bold transition"
                    >
                      মুছে ফেলুন
                    </button>
                  ) : (
                    <span className="text-[10px] font-bold text-slate-400">সংরক্ষিত (Owner)</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Invite Modal */}
      {inviteModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <h3 className="text-lg font-black text-slate-900">টিম সদস্য যুক্ত করুন</h3>
              <button onClick={() => setInviteModal(false)} className="text-slate-400 font-bold text-lg">✕</button>
            </div>

            <form onSubmit={handleAddMember} className="space-y-3 text-xs font-semibold">
              <div>
                <label className="block text-slate-700 mb-1">পূর্ণ নাম *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="যেমন: আরমান হোসেন"
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1">অ্যাক্সেস ইমেইল *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@gmail.com"
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1">দায়িত্ব / রোল</label>
                <select
                  value={role}
                  onChange={(e: any) => setRole(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-bold"
                >
                  <option value="Admin">Admin (সম্পূর্ণ এডিট সুবিধা)</option>
                  <option value="Moderator">Moderator (অর্ডার পর্যবেক্ষণ)</option>
                  <option value="Pharmacist">Pharmacist (প্রেসক্রিপশন ভেরিফিকেশন)</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
                <button type="button" onClick={() => setInviteModal(false)} className="px-4 py-2 rounded-xl border font-bold">
                  বাতিল
                </button>
                <button type="submit" className="bg-[#0f4c3a] text-white px-5 py-2 rounded-xl font-bold">
                  ✓ সদস্য যোগ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}