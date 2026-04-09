"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  function handleLogout() {
    localStorage.removeItem("token");
    router.push("/login");
  }

  return (
    <nav className="border-b border-neutral-100 bg-white px-6 py-4 flex items-center justify-between">
      <Link href="/app" className="text-lg font-semibold tracking-tight text-neutral-900">
        Pulsr
      </Link>
      <button
        onClick={handleLogout}
        className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
      >
        Logout
      </button>
    </nav>
  );
}
