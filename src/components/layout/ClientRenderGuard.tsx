"use client";

import React, { useEffect, useState } from "react";

export default function ClientRenderGuard({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Remove any browser extension injected attributes post-mount
    if (typeof document !== "undefined") {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === "attributes" && mutation.attributeName === "bis_skin_checked") {
            (mutation.target as HTMLElement).removeAttribute("bis_skin_checked");
          }
        });
      });
      observer.observe(document.body, { attributes: true, subtree: true, attributeFilter: ["bis_skin_checked"] });
      return () => observer.disconnect();
    }
  }, []);

  if (!mounted) {
    return (
      <div
        suppressHydrationWarning
        className="min-h-screen bg-[#f4f7f6] flex items-center justify-center font-sans"
      >
        <div suppressHydrationWarning className="w-8 h-8 rounded-full border-3 border-[#0f4c3a] border-t-transparent animate-spin" />
      </div>
    );
  }

  return <div suppressHydrationWarning>{children}</div>;
}