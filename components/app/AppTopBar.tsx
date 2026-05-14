"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getCached } from "@/lib/cache";
import { getProfile } from "@/lib/api";
import { UserProfile } from "@/types";

function formatDate(d: Date): string {
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function AppTopBar() {
  const [profile, setProfile] = useState<UserProfile | null>(() =>
    getCached<UserProfile>("profile") ?? null
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("token");
    if (!token) return;
    getProfile()
      .then(setProfile)
      .catch(() => {});
  }, []);

  const displayName = profile
    ? profile.name || profile.email.split("@")[0]
    : "";
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <header className="fixed top-0 left-0 right-0 lg:left-64 z-50 h-16 flex items-center justify-between px-6 md:px-8 bg-p-surface-container-highest/80 backdrop-blur-xl border-b border-p-outline-variant/10">
      {/* Logo */}
      <span className="text-xl font-black tracking-tighter text-p-on-surface">Pulsr</span>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Date display */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-p-surface-container-high rounded-full">
          <span className="material-symbols-outlined text-sm text-p-on-surface-variant">calendar_today</span>
          <span className="text-xs font-medium text-p-on-surface-variant">
            {formatDate(new Date())}
          </span>
        </div>

        {/* Profile avatar */}
        <Link
          href="/app/profile"
          className="w-9 h-9 rounded-full bg-p-surface-container-high flex items-center justify-center ring-2 ring-p-outline-variant/20 hover:ring-p-secondary/40 transition-all overflow-hidden flex-shrink-0"
        >
          {profile?.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={displayName}
              className="w-full h-full object-cover"
            />
          ) : initials ? (
            <span className="text-xs font-bold text-p-on-surface">{initials}</span>
          ) : (
            <span className="material-symbols-outlined text-base text-p-on-surface-variant">person</span>
          )}
        </Link>
      </div>
    </header>
  );
}
