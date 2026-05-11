"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getProfile, updateProfile } from "@/lib/api";

const SEEDS = [
  "Aria", "Blake", "Casey", "Drew", "Ember",
  "Finn", "Gray", "Harper", "Iris", "Juno",
  "Kai", "Luna", "Morgan", "Nova", "Orion",
];

function dicebearUrl(seed: string) {
  return `https://api.dicebear.com/9.x/personas/svg?seed=${encodeURIComponent(seed)}&backgroundColor=1f2020`;
}

export default function AvatarPage() {
  const router = useRouter();
  const [currentAvatar, setCurrentAvatar] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }
    getProfile()
      .then((p) => {
        setCurrentAvatar(p.avatar_url);
        setSelected(p.avatar_url);
      })
      .catch(() => router.push("/login"));
  }, [router]);

  async function handleSave() {
    if (!selected) return;
    setSaving(true);
    try {
      await updateProfile({ avatar_url: selected });
      router.push("/app/profile");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-p-surface text-p-on-surface flex">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col sticky top-0 h-screen w-64 py-8 px-4 gap-6 bg-p-surface-container-low">
        <div className="flex items-center gap-4 px-4 mb-4">
          <div className="w-10 h-10 rounded-full bg-p-surface-container-high flex items-center justify-center overflow-hidden">
            {currentAvatar ? (
              <img src={currentAvatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="material-symbols-outlined text-p-on-surface-variant text-lg">person</span>
            )}
          </div>
          <div>
            <p className="text-p-on-surface font-semibold text-xs uppercase tracking-widest">The Curator</p>
            <p className="text-[10px] text-p-on-surface-variant opacity-60">Choose Avatar</p>
          </div>
        </div>
        <nav className="flex flex-col gap-2">
          {[
            { icon: "history_edu", label: "Journal", href: "/app" },
            { icon: "analytics", label: "Insights", href: "/app/insights" },
            { icon: "category", label: "Categories", href: "/app/categories" },
            { icon: "account_circle", label: "Profile", href: "/app/profile", active: true },
          ].map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                link.active
                  ? "text-p-secondary font-semibold bg-p-surface-container-high"
                  : "text-p-on-surface-variant hover:bg-p-surface-bright/10 hover:text-p-on-surface"
              }`}
            >
              <span className="material-symbols-outlined">{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-50 h-16 w-full flex items-center justify-between px-8 bg-p-surface-container-highest/80 backdrop-blur-xl border-b border-p-outline-variant/10">
          <span className="text-xl font-bold tracking-tighter text-p-on-surface">Pulsr</span>
          <Link
            href="/app/profile"
            className="flex items-center gap-2 text-p-on-surface-variant hover:text-p-on-surface transition-colors text-sm"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Back to Profile
          </Link>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center px-8 py-12 w-full max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-p-on-surface tracking-tight mb-3">Choose Your Avatar</h1>
            <p className="text-p-on-surface-variant text-lg">Pick a style that represents you</p>
          </div>

          {/* Avatar Grid */}
          <div className="bg-p-surface-container-low rounded-[2rem] p-12 w-full flex flex-col items-center shadow-2xl relative">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-8 mb-16">
              {SEEDS.map((seed) => {
                const url = dicebearUrl(seed);
                const isSelected = selected === url;
                return (
                  <button
                    key={seed}
                    onClick={() => setSelected(url)}
                    className="flex flex-col items-center gap-3 group"
                  >
                    <div
                      className={`w-20 h-20 rounded-full overflow-hidden transition-all duration-300 cursor-pointer ${
                        isSelected
                          ? "scale-105 outline outline-2 outline-p-secondary outline-offset-4 bg-p-surface-bright shadow-[0_0_32px_0_rgba(145,163,144,0.15)]"
                          : "bg-p-surface-container-high hover:-translate-y-0.5 hover:shadow-[0_0_24px_0_rgba(231,229,229,0.06)]"
                      }`}
                    >
                      <img
                        src={url}
                        alt={`Avatar ${seed}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <span className={`text-[0.625rem] uppercase tracking-widest transition-colors ${
                      isSelected ? "text-p-secondary" : "text-p-on-surface-variant opacity-0 group-hover:opacity-60"
                    }`}>
                      {seed}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Actions */}
            <div className="flex flex-col items-center gap-6">
              <button
                onClick={handleSave}
                disabled={saving || !selected}
                className="px-12 py-4 bg-p-primary text-p-on-primary rounded-xl font-bold text-base tracking-tight hover:opacity-90 active:scale-[0.98] transition-all shadow-lg disabled:opacity-40"
              >
                {saving ? "Saving…" : "Save Avatar"}
              </button>
              <Link
                href="/app/profile"
                className="text-p-on-surface-variant font-medium hover:text-p-on-surface transition-colors tracking-wide text-sm underline underline-offset-8 decoration-p-outline-variant/30"
              >
                Skip for now
              </Link>
            </div>

            {/* Decorative blur */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-p-secondary/5 rounded-full blur-[120px] pointer-events-none -z-10" />
          </div>
        </main>

        {/* Mobile Bottom Nav */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-p-surface-container-highest/80 backdrop-blur-xl flex justify-around items-center px-4 z-50">
          <Link href="/app"><span className="material-symbols-outlined text-p-on-surface-variant">history_edu</span></Link>
          <Link href="/app/insights"><span className="material-symbols-outlined text-p-on-surface-variant">analytics</span></Link>
          <Link href="/app/profile"><span className="material-symbols-outlined text-p-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>person</span></Link>
          <span className="material-symbols-outlined text-p-on-surface-variant">settings</span>
        </nav>
      </div>
    </div>
  );
}
