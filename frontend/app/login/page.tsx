"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Could not sign in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="font-display italic text-3xl text-teal-600">Ledger</p>
          <p className="text-sm text-ink/50 mt-2">
            A calm, clear place to track where your money goes.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white/70 border border-ink/10 rounded-sm p-8 space-y-4"
        >
          <h1 className="font-display text-xl text-ink mb-2">Welcome back</h1>

          {error && (
            <p className="text-sm text-rose bg-rose/10 border border-rose/30 rounded-sm px-3 py-2">
              {error}
            </p>
          )}

          <div>
            <label className="block text-xs uppercase tracking-widest text-ink/50 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-ink/15 rounded-sm px-3 py-2 bg-paper focus:border-teal-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-ink/50 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-ink/15 rounded-sm px-3 py-2 bg-paper focus:border-teal-500 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 text-paper py-2.5 rounded-sm text-sm hover:bg-teal-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="text-center text-sm text-ink/50 mt-6">
          New here?{" "}
          <Link href="/register" className="text-teal-600 font-medium hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
