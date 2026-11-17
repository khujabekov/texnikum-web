"use client";

import { AlertCircle, Eye, EyeOff, Loader2, Lock, LogIn, User } from "lucide-react";
import { useState, type FormEvent } from "react";

type LoginFormProps = {
  redirectTo?: string;
};

export default function LoginForm({ redirectTo }: LoginFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;

    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });

      const data: { ok?: boolean; error?: string } = await response
        .json()
        .catch(() => ({}));

      if (!response.ok || !data.ok) {
        setError(data.error ?? "Kirishda xatolik yuz berdi");
        setLoading(false);
        return;
      }

      const from = new URLSearchParams(window.location.search).get("from");
      const target =
        from && from.startsWith("/admin") && from !== "/admin/login"
          ? from
          : redirectTo ?? "/admin";
      window.location.assign(target);
    } catch {
      setError("Server bilan aloqa yo'q. Internetni tekshirib, qayta urinib ko'ring");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {error && (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div>
        <label
          htmlFor="username"
          className="block text-xs font-bold uppercase tracking-wider text-slate-300"
        >
          Login
        </label>
        <div className="relative mt-2">
          <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            required
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="Administrator logini"
            className="w-full rounded-2xl border border-white/10 bg-navy-900/60 py-3.5 pl-11 pr-4 text-sm font-semibold text-white placeholder:font-medium placeholder:text-slate-500 outline-none transition focus:border-emerald-400/60 focus:bg-navy-900 focus:ring-2 focus:ring-emerald-400/20"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-xs font-bold uppercase tracking-wider text-slate-300"
        >
          Parol
        </label>
        <div className="relative mt-2">
          <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
            className="w-full rounded-2xl border border-white/10 bg-navy-900/60 py-3.5 pl-11 pr-12 text-sm font-semibold text-white placeholder:font-medium placeholder:text-slate-500 outline-none transition focus:border-emerald-400/60 focus:bg-navy-900 focus:ring-2 focus:ring-emerald-400/20"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Parolni yashirish" : "Parolni ko'rsatish"}
            className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-xl text-slate-400 transition hover:bg-white/5 hover:text-white"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-sky-500 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/30 transition duration-300 hover:shadow-emerald-400/40 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Kirilmoqda...
          </>
        ) : (
          <>
            <LogIn className="h-4 w-4" />
            Kirish
          </>
        )}
      </button>
    </form>
  );
}
