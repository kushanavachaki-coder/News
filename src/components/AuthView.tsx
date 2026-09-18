import React, { useState } from "react";
import { Mail, Lock, ShieldAlert, Sparkles, Loader2, ArrowRight } from "lucide-react";
import { supabase } from "../lib/supabase.js";

interface AuthViewProps {
  onAuthSuccess: (session: any) => void;
}

export default function AuthView({ onAuthSuccess }: AuthViewProps) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Simple email regex validation
  const validateEmail = (emailStr: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    // Common validations
    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      if (mode === "signup") {
        if (password !== confirmPassword) {
          setError("Passwords do not match.");
          setLoading(false);
          return;
        }

        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (signUpError) {
          setError(signUpError.message);
        } else if (data?.user && data?.session) {
          // Instantly logged in
          onAuthSuccess(data.session);
        } else if (data?.user) {
          setSuccessMsg("Account created! Please check your email for a confirmation link.");
          // Clear inputs
          setEmail("");
          setPassword("");
          setConfirmPassword("");
        } else {
          setError("An unexpected signup response was returned.");
        }
      } else {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          setError(signInError.message);
        } else if (data?.session) {
          onAuthSuccess(data.session);
        } else {
          setError("Login failed. Please verify your credentials.");
        }
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-slate-50 px-6 py-10 flex flex-col justify-center text-left" id="auth-container">
      <div className="max-w-xs mx-auto w-full space-y-8">
        
        {/* Header Brand Section */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-400 to-indigo-500 text-white font-black text-xl shadow-lg shadow-indigo-500/25 animate-pulse">
            B
          </div>
          <h1 className="text-3xl font-black text-indigo-950 tracking-tight leading-none pt-1">
            BLINK
          </h1>
          <p className="text-xs text-indigo-400/80 font-bold uppercase tracking-widest flex items-center justify-center gap-1">
            <Sparkles className="w-3 h-3 fill-current" /> Read Less, Understand More
          </p>
        </div>

        {/* Heading Statement */}
        <div className="space-y-1.5">
          <h2 className="text-xl font-black text-indigo-950 tracking-tight">
            {mode === "login" ? "Welcome back" : "Create your BLINK account"}
          </h2>
          <p className="text-xs text-slate-500 font-semibold leading-relaxed">
            {mode === "login" 
              ? "Sign in to keep your interests calibrated and custom briefs synced." 
              : "Set up your preferences to personalize your 60-word briefings."}
          </p>
        </div>

        {/* Error / Success Feedback Alerts */}
        {error && (
          <div className="p-4 bg-red-50 rounded-2xl border border-red-100 text-red-700 flex gap-2.5 items-start text-xs font-semibold animate-fade-in" id="auth-error-alert">
            <ShieldAlert className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <div className="leading-relaxed">{error}</div>
          </div>
        )}

        {successMsg && (
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-emerald-800 flex gap-2.5 items-start text-xs font-semibold animate-fade-in" id="auth-success-alert">
            <div className="leading-relaxed">{successMsg}</div>
          </div>
        )}

        {/* Auth form */}
        <form onSubmit={handleSubmit} className="space-y-4" id="auth-form">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-indigo-400 tracking-wider block pl-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                disabled={loading}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-11 pr-4.5 py-3.5 bg-white border border-slate-200 focus:border-indigo-500 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-100/50 transition duration-200"
                id="auth-email-input"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-indigo-400 tracking-wider block pl-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                disabled={loading}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4.5 py-3.5 bg-white border border-slate-200 focus:border-indigo-500 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-100/50 transition duration-200"
                id="auth-password-input"
              />
            </div>
          </div>

          {mode === "signup" && (
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-indigo-400 tracking-wider block pl-1">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  disabled={loading}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4.5 py-3.5 bg-white border border-slate-200 focus:border-indigo-500 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-100/50 transition duration-200"
                  id="auth-confirm-password-input"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-lg shadow-indigo-600/15 active:scale-98 transition duration-200 text-xs tracking-wider uppercase flex items-center justify-center gap-2"
            id="auth-submit-btn"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing...
              </>
            ) : mode === "login" ? (
              <>
                Log In
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* Switch Auth mode control */}
        <div className="text-center pt-2">
          {mode === "login" ? (
            <p className="text-xs text-slate-500 font-semibold">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("signup");
                  setError(null);
                  setSuccessMsg(null);
                }}
                className="text-indigo-600 font-black hover:underline"
                id="switch-to-signup-btn"
              >
                Sign up
              </button>
            </p>
          ) : (
            <p className="text-xs text-slate-500 font-semibold">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setError(null);
                  setSuccessMsg(null);
                }}
                className="text-indigo-600 font-black hover:underline"
                id="switch-to-login-btn"
              >
                Log in
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
