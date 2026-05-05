"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginUser, storeToken } from "@/lib/api/auth";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";

const inputClass =
  "w-full bg-transparent border-none focus:ring-0 px-4 py-3 text-sm text-p-on-surface placeholder:text-p-outline-variant/60 outline-none";

const labelClass =
  "block text-[0.6875rem] uppercase tracking-[0.05em] font-medium text-p-on-surface-variant px-1";

export default function LoginForm() {
  const router = useRouter();
  const submitting = useRef(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting.current) return;

    if (!email.trim()) { setError("Email is required"); return; }
    if (!password) { setError("Password is required"); return; }

    submitting.current = true;
    setError("");
    setLoading(true);

    try {
      const { access_token } = await loginUser({ email: email.trim(), password });
      storeToken(access_token);
      router.push("/app");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed. Please try again.");
    } finally {
      setLoading(false);
      submitting.current = false;
    }
  }

  return (
    <>
      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Email */}
        <div className="space-y-2">
          <label className={labelClass}>Email Address</label>
          <div className="ghost-border bg-p-surface-container-lowest rounded-xl transition-all duration-300">
            <input
              className={inputClass}
              type="email"
              placeholder="name@company.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-2">
          <div className="flex justify-between items-center px-1">
            <label className={labelClass}>Password</label>
            <a
              href="#"
              className="text-[0.6875rem] uppercase tracking-[0.05em] text-p-tertiary-dim hover:text-p-tertiary transition-colors"
            >
              Forgot?
            </a>
          </div>
          <div className="ghost-border bg-p-surface-container-lowest rounded-xl transition-all duration-300">
            <input
              className={inputClass}
              type="password"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        {error && <p className="text-p-error text-xs px-1">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-p-primary text-p-on-primary font-medium py-3 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all duration-200 mt-2 disabled:opacity-50 cursor-pointer"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      {/* Divider */}
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-p-outline-variant/15" />
        </div>
        <div className="relative flex justify-center text-[0.6875rem] uppercase tracking-widest">
          <span className="bg-p-surface-container-highest px-3 text-p-on-surface-variant">
            Or
          </span>
        </div>
      </div>

      {/* Google */}
      <GoogleSignInButton onError={setError} />

      {/* Redirect */}
      <p className="mt-10 text-center text-sm text-p-on-surface-variant">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="text-p-tertiary-dim hover:text-p-tertiary transition-colors font-medium"
        >
          Sign up
        </Link>
      </p>
    </>
  );
}
