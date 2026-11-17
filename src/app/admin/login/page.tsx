import { GraduationCap, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import LoginForm from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Kirish",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <section className="relative flex flex-1 items-center justify-center overflow-hidden bg-navy-950 px-4 py-12 sm:py-16">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-sky-500/15 blur-3xl" />
        <div className="bg-grid-white absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_75%_65%_at_50%_40%,black,transparent)]" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl shadow-navy-950/60 backdrop-blur-xl">
          <div className="px-6 pb-2 pt-10 text-center sm:px-10">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-400 to-sky-500 shadow-lg shadow-emerald-500/30">
              <GraduationCap className="h-8 w-8 text-white" />
            </span>
            <h1 className="mt-6 text-xl font-extrabold tracking-tight text-white sm:text-2xl">
              Boshqaruv paneliga kirish
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              Sayt ma&rsquo;lumotlarini boshqarish uchun administrator hisobingiz
              bilan kiring
            </p>
          </div>

          <div className="p-6 sm:p-10">
            <LoginForm />
          </div>
        </div>

        <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-xs font-semibold text-slate-400">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400/80" />
          Faqat administratorlar uchun
        </p>
      </div>
    </section>
  );
}
