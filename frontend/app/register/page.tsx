"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 8 || !/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/\d/.test(password)) {
      setError("Password must be at least 8 characters, with an uppercase letter, a lowercase letter, and a number.");
      return;
    }
    setLoading(true);
    try {
      await register(name, email, password);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Could not create account.");
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
          <h1 className="font-display text-xl text-ink mb-2">Create your account</h1>

          {error && (
            <p className="text-sm text-rose bg-rose/10 border border-rose/30 rounded-sm px-3 py-2">
              {error}
            </p>
          )}

          <div>
            <label htmlFor="name" className="block text-xs uppercase tracking-widest text-ink/50 mb-1">
              Name
            </label>
            <input
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-ink/15 rounded-sm px-3 py-2 bg-paper focus:border-teal-500 outline-none"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-xs uppercase tracking-widest text-ink/50 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-ink/15 rounded-sm px-3 py-2 bg-paper focus:border-teal-500 outline-none"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs uppercase tracking-widest text-ink/50 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-ink/15 rounded-sm px-3 py-2 bg-paper focus:border-teal-500 outline-none"
            />
            <p className="text-xs text-ink/40 mt-1">
              At least 8 characters, with an uppercase letter, a lowercase letter, and a number.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 text-paper py-2.5 rounded-sm text-sm hover:bg-teal-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="text-center text-sm text-ink/50 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-teal-600 font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
