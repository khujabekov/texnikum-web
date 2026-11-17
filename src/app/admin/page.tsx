import {
  ArrowRight,
  Compass,
  ExternalLink,
  FileText,
  Images,
  Newspaper,
  Users,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { requireAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Boshqaruv paneli",
  robots: { index: false, follow: false },
};

type StatCard = {
  label: string;
  href: string;
  icon: typeof Newspaper;
  count: number;
  accent: string;
};

function StatsSkeleton() {
  return (
    <div className="space-y-8">
      <div className="h-9 w-64 animate-pulse rounded-2xl bg-slate-200" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="h-36 animate-pulse rounded-3xl border border-slate-200 bg-white"
          />
        ))}
      </div>
      <div className="h-9 w-56 animate-pulse rounded-2xl bg-slate-200" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-20 animate-pulse rounded-3xl border border-slate-200 bg-white"
          />
        ))}
      </div>
    </div>
  );
}

async function DashboardContent() {
  const session = await requireAdminSession();

  const [newsCount, directionCount, staffCount, galleryCount, documentCount] =
    await Promise.all([
      prisma.news.count(),
      prisma.direction.count(),
      prisma.staff.count(),
      prisma.gallery.count(),
      prisma.document.count(),
    ]);

  const stats: StatCard[] = [
    {
      label: "Yangiliklar",
      href: "/admin/yangiliklar",
      icon: Newspaper,
      count: newsCount,
      accent: "from-emerald-400 to-teal-500",
    },
    {
      label: "Yo'nalishlar",
      href: "/admin/yonalishlar",
      icon: Compass,
      count: directionCount,
      accent: "from-sky-400 to-blue-500",
    },
    {
      label: "Rahbariyat",
      href: "/admin/rahbariyat",
      icon: Users,
      count: staffCount,
      accent: "from-violet-400 to-purple-500",
    },
    {
      label: "Galereya",
      href: "/admin/galereya",
      icon: Images,
      count: galleryCount,
      accent: "from-amber-400 to-orange-500",
    },
    {
      label: "Hujjatlar",
      href: "/admin/hujjatlar",
      icon: FileText,
      count: documentCount,
      accent: "from-rose-400 to-red-500",
    },
  ];

  const quickActions = [
    { label: "Yangilik qo'shish", href: "/admin/yangiliklar" },
    { label: "Yo'nalish qo'shish", href: "/admin/yonalishlar" },
    { label: "Xodim qo'shish", href: "/admin/rahbariyat" },
    { label: "Galereyaga rasm yuklash", href: "/admin/galereya" },
    { label: "Hujjat yuklash", href: "/admin/hujjatlar" },
    { label: "Sayt sozlamalari", href: "/admin/sozlamalar" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">
          Boshqaruv paneli
        </p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-navy-900 sm:text-3xl">
          Xush kelibsiz, {session.username}!
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">
          Saytingizdagi barcha bo&apos;limlarni shu paneldan boshqarishingiz
          mumkin.
        </p>
      </div>

      <section aria-label="Statistika">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Link
                key={stat.href}
                href={stat.href}
                className="group relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-300/60 hover:shadow-xl hover:shadow-emerald-500/10"
              >
                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${stat.accent} text-white shadow-lg`}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <p className="mt-4 text-3xl font-extrabold tracking-tight text-navy-900">
                  {stat.count}
                </p>
                <p className="mt-1 text-sm font-bold text-slate-500">
                  {stat.label}
                </p>
                <span className="mt-3 flex items-center gap-1 text-xs font-bold text-emerald-600 opacity-0 transition group-hover:opacity-100">
                  Boshqarish
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section aria-label="Tezkor amallar">
        <h2 className="text-lg font-extrabold tracking-tight text-navy-900">
          Tezkor amallar
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quickActions.map((action) => (
            <Link
              key={action.href + action.label}
              href={action.href}
              className="group flex items-center justify-between gap-3 rounded-3xl border border-slate-200/80 bg-white px-5 py-4 shadow-sm transition duration-300 hover:border-emerald-300/60 hover:shadow-lg hover:shadow-emerald-500/10"
            >
              <span className="text-sm font-bold text-navy-900">
                {action.label}
              </span>
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition group-hover:bg-gradient-to-br group-hover:from-emerald-400 group-hover:to-sky-500 group-hover:text-white">
                <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section aria-label="Sayt havolasi">
        <Link
          href="/"
          target="_blank"
          className="group flex items-center justify-between gap-4 overflow-hidden rounded-3xl bg-navy-900 px-6 py-5 text-white shadow-xl shadow-navy-900/20 transition duration-300 hover:shadow-2xl"
        >
          <div>
            <p className="text-sm font-extrabold">Saytni yangi oynada ochish</p>
            <p className="mt-1 text-xs font-semibold text-slate-300">
              O&apos;zgarishlar saytda qanday ko&apos;rinishini tekshirib
              ko&apos;ring
            </p>
          </div>
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/5 text-emerald-300 transition group-hover:bg-white/10">
            <ExternalLink className="h-5 w-5" />
          </span>
        </Link>
      </section>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={<StatsSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}
