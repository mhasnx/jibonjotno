"use client";

import React from "react";

export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-slate-200/80 rounded-2xl ${className}`}
      aria-hidden="true"
    />
  );
}

export function MedicineCardSkeleton() {
  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-200/80 space-y-4 shadow-2xs">
      <div className="flex items-start space-x-4">
        <Skeleton className="w-20 h-20 rounded-2xl shrink-0" />
        <div className="flex-1 space-y-2 py-1">
          <div className="flex justify-between">
            <Skeleton className="w-14 h-4 rounded-md" />
            <Skeleton className="w-10 h-4 rounded-md" />
          </div>
          <Skeleton className="w-3/4 h-5 rounded-lg" />
          <Skeleton className="w-1/2 h-3.5 rounded-md" />
          <Skeleton className="w-2/3 h-3 rounded-md" />
        </div>
      </div>
      <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
        <div className="space-y-1">
          <Skeleton className="w-12 h-2.5 rounded" />
          <Skeleton className="w-16 h-5 rounded-md" />
        </div>
        <div className="flex space-x-1.5">
          <Skeleton className="w-16 h-8 rounded-xl" />
          <Skeleton className="w-16 h-8 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function SearchDropdownSkeleton() {
  return (
    <div className="p-3 space-y-2.5 divide-y divide-slate-100">
      {[1, 2, 3].map((i) => (
        <div key={i} className="pt-2 first:pt-0 flex justify-between items-center">
          <div className="space-y-1.5 w-2/3">
            <Skeleton className="w-3/4 h-4 rounded-md" />
            <Skeleton className="w-1/2 h-3 rounded-md" />
          </div>
          <Skeleton className="w-14 h-5 rounded-lg" />
        </div>
      ))}
    </div>
  );
}