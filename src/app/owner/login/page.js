// src/app/owner/login/page.js
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiMail, FiLock, FiEye, FiEyeOff, FiLoader } from "react-icons/fi";
import toast from "react-hot-toast";
import { useOwnerAuth } from "@/context/OwnerAuthContext";

export default function OwnerLoginPage() {
  const router = useRouter();
  const { owner, loading, login } = useOwnerAuth(); // ⬅️ pull owner + loading too
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // NEW: redirect away if already logged in as an owner
  useEffect(() => {
    if (!loading && owner) {
      router.replace("/owner/dashboard");
    }
  }, [loading, owner, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await login(email.trim(), password);
      toast.success("Welcome back!");
      router.push("/owner/dashboard");
    } catch (err) {
      console.error("Login error:", err.code);
      setError("Incorrect email or password");
    } finally {
      setIsSubmitting(false);
    }
  };

  // NEW: while auth state is resolving, or once we know they're logged in and about to redirect,
  // show a loader instead of flashing the login form
  if (loading || owner) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <FiLoader className="animate-spin text-3xl text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="font-display font-bold text-2xl text-primary">
            Stay<span className="text-accent-dark">Finder</span>
          </Link>
          <p className="text-gray-400 text-sm mt-2">Partner Portal</p>
        </div>

        <div className="card p-8">
          <h1 className="font-display font-bold text-2xl text-primary text-center">Owner Login</h1>
          <p className="text-gray-400 text-sm text-center mt-2 mb-8">
            Sign in to manage your property applications
          </p>

          {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-5">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-secondary text-sm outline-none" />
            </div>
            <div className="relative">
              <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 focus:border-secondary text-sm outline-none" />
              <button type="button" onClick={() => setShowPassword((p) => !p)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            <button type="submit" disabled={isSubmitting} className="btn-primary w-full disabled:opacity-60">
              {isSubmitting ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            New partner? <Link href="/owner/signup" className="text-secondary font-medium hover:underline">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}