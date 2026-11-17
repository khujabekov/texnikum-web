import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";

type PageHeaderProps = {
  kicker: string;
  title: string;
  description?: string;
  breadcrumb: string;
};

export default function PageHeader({
  kicker,
  title,
  description,
  breadcrumb,
}: PageHeaderProps) {
  return (
    <section className="relative overflow-hidden bg-navy-900 text-white">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute -right-32 top-8 h-80 w-80 rounded-full bg-sky-500/15 blur-3xl" />
        <div className="bg-grid-white absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_75%_65%_at_50%_35%,black,transparent)]" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-navy-950" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-10 sm:px-6 sm:pb-16 sm:pt-12 lg:px-8 lg:pb-20 lg:pt-16">
        <nav
          aria-label="Sayt xaritasi"
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 sm:text-sm"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 transition hover:text-emerald-300"
          >
            <Home className="h-3.5 w-3.5" />
            Bosh sahifa
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-slate-600" aria-hidden />
          <span className="text-emerald-300">{breadcrumb}</span>
        </nav>

        <span className="mt-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-300">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          {kicker}
        </span>

        <h1 className="mt-4 max-w-3xl text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
          {title}
        </h1>

        {description && (
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
