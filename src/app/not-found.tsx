import { ArrowLeft, Compass, Home } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <section className="relative flex flex-1 items-center overflow-hidden bg-navy-900 text-white">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-sky-500/15 blur-3xl" />
        <div className="bg-grid-white absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_75%_65%_at_50%_40%,black,transparent)]" />
      </div>

      <div className="relative mx-auto w-full max-w-2xl px-4 py-24 text-center sm:px-6">
        <span className="flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-400/10 text-emerald-300 mx-auto">
          <Compass className="h-10 w-10" />
        </span>
        <p className="text-gradient mt-8 text-7xl font-extrabold tracking-tight sm:text-8xl">
          404
        </p>
        <h1 className="mt-4 text-2xl font-extrabold tracking-tight sm:text-3xl">
          Sahifa topilmadi
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-slate-300 sm:text-base">
          Siz izlagan sahifa o&rsquo;chirilgan, ko&rsquo;chirilgan yoki hech
          qachon mavjud bo&rsquo;lmagan bo&rsquo;lishi mumkin.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-7 py-3.5 text-sm font-bold text-white shadow-xl shadow-emerald-500/30 transition duration-300 hover:shadow-emerald-400/40 hover:brightness-110"
          >
            <Home className="h-4 w-4" />
            Bosh sahifaga qaytish
          </Link>
          <Link
            href="/yonalishlar"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-7 py-3.5 text-sm font-bold text-white backdrop-blur transition hover:border-emerald-300/40 hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4" />
            Yo&rsquo;nalishlarni ko&rsquo;rish
          </Link>
        </div>
      </div>
    </section>
  );
}
