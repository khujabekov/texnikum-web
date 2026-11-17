"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Compass,
  ExternalLink,
  FileText,
  GraduationCap,
  Images,
  LayoutDashboard,
  Loader2,
  LogOut,
  Menu,
  Newspaper,
  Settings,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ComponentType, type ReactNode } from "react";

type NavItem = {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
};

const NAV_ITEMS: NavItem[] = [
  { href: "/admin", label: "Boshqaruv paneli", icon: LayoutDashboard },
  { href: "/admin/sozlamalar", label: "Sayt sozlamalari", icon: Settings },
  { href: "/admin/yangiliklar", label: "Yangiliklar", icon: Newspaper },
  { href: "/admin/yonalishlar", label: "Yo'nalishlar", icon: Compass },
  { href: "/admin/rahbariyat", label: "Rahbariyat", icon: Users },
  { href: "/admin/galereya", label: "Galereya", icon: Images },
  { href: "/admin/hujjatlar", label: "Hujjatlar", icon: FileText },
];

function isActive(pathname: string, href: string) {
  return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
}

function SidebarContent({
  pathname,
  loggingOut,
  onLogout,
  onNavigate,
}: {
  pathname: string;
  loggingOut: boolean;
  onLogout: () => void;
  onNavigate?: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b border-white/10 px-5 py-5">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-sky-500 shadow-lg shadow-emerald-500/25">
          <GraduationCap className="h-6 w-6 text-white" />
        </span>
        <span className="min-w-0 leading-tight">
          <span className="block truncate text-sm font-extrabold tracking-tight text-white">
            Boshqaruv paneli
          </span>
          <span className="block text-[11px] font-semibold text-emerald-300/90">
            Administrator
          </span>
        </span>
      </div>

      <nav
        aria-label="Admin navigatsiya"
        className="flex-1 space-y-1 overflow-y-auto px-3 py-4"
      >
        {NAV_ITEMS.map((item) => {
          const active = isActive(pathname, item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={`group flex items-center gap-3 rounded-2xl px-3.5 py-3 text-sm font-bold transition duration-200 ${
                active
                  ? "bg-gradient-to-r from-emerald-500/20 to-sky-500/10 text-emerald-300 shadow-inner"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition ${
                  active
                    ? "bg-emerald-400/15 text-emerald-300"
                    : "bg-white/5 text-slate-400 group-hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
              </span>
              <span className="truncate">{item.label}</span>
              {active && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-400" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-white/10 px-3 py-4">
        <Link
          href="/"
          onClick={onNavigate}
          className="group flex items-center gap-3 rounded-2xl px-3.5 py-3 text-sm font-bold text-slate-300 transition hover:bg-white/5 hover:text-white"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/5 text-slate-400 group-hover:text-white">
            <ExternalLink className="h-4 w-4" />
          </span>
          Saytni ko&apos;rish
        </Link>
        <button
          type="button"
          onClick={onLogout}
          disabled={loggingOut}
          className="flex w-full items-center gap-3 rounded-2xl px-3.5 py-3 text-sm font-bold text-red-300 transition hover:bg-red-500/10 hover:text-red-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-red-500/10">
            {loggingOut ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <LogOut className="h-4 w-4" />
            )}
          </span>
          {loggingOut ? "Chiqilmoqda..." : "Chiqish"}
        </button>
      </div>
    </div>
  );
}

export default function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);

  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  async function handleLogout() {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      setLoggingOut(false);
      return;
    }
    // Full navigation clears cached admin data from the client router
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.assign("/admin/login");
  }

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <aside
        className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-white/10 bg-navy-950 lg:flex lg:flex-col"
        aria-label="Admin yon panel"
      >
        <SidebarContent
          pathname={pathname}
          loggingOut={loggingOut}
          onLogout={handleLogout}
        />
      </aside>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-navy-950/60 backdrop-blur-sm lg:hidden"
              aria-hidden
            />
            <motion.aside
              key="drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-50 flex w-[82%] max-w-xs flex-col border-r border-white/10 bg-navy-950 shadow-2xl lg:hidden"
            >
              <SidebarContent
                pathname={pathname}
                loggingOut={loggingOut}
                onLogout={handleLogout}
                onNavigate={() => setOpen(false)}
              />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Menyuni yopish"
                className="absolute right-3 top-4 flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex min-h-screen flex-col lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur-md sm:px-6 lg:hidden">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-sky-500 shadow-md shadow-emerald-500/25">
              <GraduationCap className="h-5 w-5 text-white" />
            </span>
            <span className="text-sm font-extrabold tracking-tight text-navy-900">
              Boshqaruv paneli
            </span>
          </div>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Menyuni ochish"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-navy-700 shadow-sm transition hover:border-emerald-300 hover:text-emerald-600"
          >
            <Menu className="h-5 w-5" />
          </button>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
          <div className="mx-auto w-full max-w-5xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
