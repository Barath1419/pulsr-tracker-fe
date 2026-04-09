"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signupUser, loginUser, storeToken, validateSignup } from "@/lib/api/auth";

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.64 9.20455C17.64 8.56636 17.5827 7.95273 17.4764 7.36364H9V10.845H13.8436C13.635 11.97 13.0009 12.9232 12.0477 13.5614V15.8195H14.9564C16.6582 14.2527 17.64 11.9455 17.64 9.20455Z" fill="#4285F4"/>
    <path d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5614C11.2418 14.1014 10.2109 14.4205 9 14.4205C6.65591 14.4205 4.67182 12.8373 3.96409 10.71H0.957275V13.0418C2.43818 15.9832 5.48182 18 9 18Z" fill="#34A853"/>
    <path d="M3.96409 10.71C3.78409 10.17 3.68182 9.59318 3.68182 9C3.68182 8.40682 3.78409 7.83 3.96409 7.29V4.95818H0.957275C0.347727 6.17318 0 7.54773 0 9C0 10.4523 0.347727 11.8268 0.957275 13.0418L3.96409 10.71Z" fill="#FBBC05"/>
    <path d="M9 3.57955C10.3214 3.57955 11.5077 4.03364 12.4405 4.92545L15.0218 2.34409C13.4632 0.891818 11.4259 0 9 0C5.48182 0 2.43818 2.01682 0.957275 4.95818L3.96409 7.29C4.67182 5.16273 6.65591 3.57955 9 3.57955Z" fill="#EA4335"/>
  </svg>
);

const inputClass =
  "w-full bg-transparent border-none focus:ring-0 px-4 py-3 text-sm text-p-on-surface placeholder:text-p-outline-variant/60 outline-none";

const labelClass =
  "block text-[0.6875rem] uppercase tracking-[0.05em] font-medium text-p-on-surface-variant px-1";

export default function SignupForm() {
  const router = useRouter();
  const submitting = useRef(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting.current) return;

    const trimmedEmail = email.trim();
    const validationError = validateSignup(trimmedEmail, password, confirm);
    if (validationError) {
      setError(validationError);
      return;
    }

    submitting.current = true;
    setError("");
    setLoading(true);

    try {
      await signupUser({ email: trimmedEmail, password });
      const { access_token } = await loginUser({ email: trimmedEmail, password });
      storeToken(access_token);
      router.push("/app");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Signup failed. Please try again.");
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
          <label className={labelClass}>Email</label>
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
          <label className={labelClass}>Password</label>
          <div className="ghost-border bg-p-surface-container-lowest rounded-xl transition-all duration-300">
            <input
              className={inputClass}
              type="password"
              placeholder="••••••••"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <label className={labelClass}>Confirm Password</label>
          <div className="ghost-border bg-p-surface-container-lowest rounded-xl transition-all duration-300">
            <input
              className={inputClass}
              type="password"
              placeholder="••••••••"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>
        </div>

        {error && <p className="text-p-error text-xs px-1">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-p-primary text-p-on-primary font-medium py-3 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all duration-200 mt-2 disabled:opacity-50 cursor-pointer"
        >
          {loading ? "Creating account..." : "Sign up"}
        </button>
      </form>

      {/* Divider */}
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-p-outline-variant/15" />
        </div>
        <div className="relative flex justify-center text-[0.6875rem] uppercase tracking-widest">
          <span className="bg-p-surface-container-highest px-3 text-p-on-surface-variant">
            or
          </span>
        </div>
      </div>

      {/* Google */}
      <button className="w-full bg-p-surface-container-high hover:bg-p-surface-bright text-p-on-surface text-sm font-medium py-3 rounded-xl flex items-center justify-center gap-3 transition-colors duration-200 ghost-border cursor-pointer">
        <GoogleIcon />
        Continue with Google
      </button>

      {/* Redirect */}
      <footer className="mt-10 text-center">
        <p className="text-p-on-surface-variant text-sm">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-p-tertiary-dim hover:text-p-tertiary transition-colors font-medium"
          >
            Log in
          </Link>
        </p>
      </footer>
    </>
  );
}
