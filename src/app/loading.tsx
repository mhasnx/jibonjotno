import React from "react";

export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-6 animate-pulse">
      <div className="h-44 bg-emerald-900/20 rounded-3xl w-full" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="h-40 bg-slate-200 rounded-3xl" />
        <div className="h-40 bg-slate-200 rounded-3xl" />
        <div className="h-40 bg-slate-200 rounded-3xl" />
      </div>
    </div>
  );
}