"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { icon: "account_circle", label: "Profile", href: "/app/profile" },
  { icon: "history_edu", label: "Journal", href: "/app" },
  { icon: "category", label: "Categories", href: "/app/categories" },
  { icon: "analytics", label: "Insights", href: "/app/insights" },
];

export default function AppSidebar() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/app") return pathname === "/app";
    return pathname.startsWith(href);
  }

  return (
    <aside className="hidden lg:flex flex-col fixed left-0 top-16 h-[calc(100vh-4rem)] py-6 px-4 bg-p-surface-container-low w-64 z-40">
      <div className="flex flex-col gap-6 h-full">
        <nav className="flex flex-col gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive(link.href)
                  ? "text-p-on-surface font-semibold bg-p-surface-container-high"
                  : "text-p-on-surface-variant hover:text-p-on-surface hover:bg-p-surface-container-high/50"
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">{link.icon}</span>
              <span className="text-[0.875rem]">{link.label}</span>
            </Link>
          ))}
        </nav>

        <div className="mt-auto flex flex-col gap-1">
          <Link
            href="#"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-p-on-surface-variant hover:text-p-on-surface hover:bg-p-surface-container-high/50 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">tune</span>
            <span className="text-[0.875rem]">Settings</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
