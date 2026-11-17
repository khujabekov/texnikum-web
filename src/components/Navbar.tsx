"use client";

import { AnimatePresence, motion, type Variants } from "framer-motion";
import { ArrowUpRight, GraduationCap, Menu, Phone, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV_LINKS } from "@/lib/nav";
import SafeImage from "./SafeImage";
import {
  InstagramIcon,
  TelegramIcon,
  YoutubeIcon,
} from "./SocialIcons";

type SocialUrls = {
  telegram?: string;
  instagram?: string;
  youtube?: string;
};

const drawerList: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.055, delayChildren: 0.12 } },
};

const drawerItem: Variants = {
  hidden: { opacity: 0, x: 28 },
  show: { opacity: 1, x: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

type NavbarProps = {
  siteName: string;
  logoUrl: string;
  socials?: SocialUrls;
};

export default function Navbar({ siteName, logoUrl, socials }: NavbarProps) {
  const socialLinks = [
    { href: socials?.telegram, label: "Telegram", Icon: TelegramIcon },
    { href: socials?.instagram, label: "Instagram", Icon: InstagramIcon },
    { href: socials?.youtube, label: "YouTube", Icon: YoutubeIcon },
  ].filter((s): s is { href: string; label: string; Icon: typeof TelegramIcon } =>
    Boolean(s.href)
  );
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const [prevPathname, setPrevPathname] = useState(pathname);

  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header
        className={`sticky top-0 z-50 border-b transition-all duration-300 ${
          scrolled
            ? "border-white/10 bg-navy-950/85 shadow-lg shadow-navy-950/40 backdrop-blur-xl"
            : "border-transparent bg-navy-950/45 backdrop-blur-md"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 md:h-[4.75rem] lg:px-8">
          <Link href="/" className="group flex min-w-0 items-center gap-3">
            <span className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-400 to-sky-500 shadow-lg shadow-emerald-500/25 transition-transform duration-300 group-hover:scale-105">
              {logoUrl ? (
                <SafeImage
                  src={logoUrl}
                  alt={siteName}
                  fallback="icon"
                  fallbackIcon="graduation"
                  sizes="44px"
                />
              ) : (
                <GraduationCap className="h-6 w-6 text-white" />
              )}
            </span>
            <span className="min-w-0 leading-tight">
              <span className="block truncate text-sm font-extrabold tracking-tight text-white sm:text-[0.95rem]">
                {siteName}
              </span>
              <span className="block text-[11px] font-semibold text-emerald-300/90">
                Rasmiy veb-sayt
              </span>
            </span>
          </Link>

          <nav
            aria-label="Asosiy navigatsiya"
            className="hidden items-center gap-1 lg:flex"
          >
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`group relative px-3 py-2 text-sm font-semibold transition-colors ${
                    active ? "text-emerald-300" : "text-slate-200 hover:text-white"
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute inset-x-3 -bottom-0.5 h-0.5 origin-left rounded-full bg-gradient-to-r from-emerald-400 to-sky-400 transition-transform duration-300 ${
                      active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/aloqa"
              className="hidden items-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-sky-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/30 transition duration-300 hover:shadow-emerald-400/40 hover:brightness-110 lg:inline-flex"
            >
              Qabul
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <button
              type="button"
              onClick={() => setOpen((prev) => !prev)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Menyuni yopish" : "Menyuni ochish"}
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 bg-white/5 text-white backdrop-blur transition hover:border-emerald-300/40 hover:bg-white/10 lg:hidden"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={open ? "close" : "menu"}
                  initial={{ rotate: -60, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 60, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="flex"
                >
                  {open ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </div>
      </header>

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
              id="mobile-menu"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 right-0 z-50 flex w-[86%] max-w-sm flex-col border-l border-white/10 bg-navy-900 text-white shadow-2xl lg:hidden"
            >
              <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
                <span className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-sky-500">
                    <GraduationCap className="h-5 w-5 text-white" />
                  </span>
                  <span className="text-sm font-extrabold tracking-tight">
                    {siteName}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Menyuni yopish"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <motion.nav
                variants={drawerList}
                initial="hidden"
                animate="show"
                aria-label="Mobil navigatsiya"
                className="flex-1 overflow-y-auto px-4 py-4"
              >
                {NAV_LINKS.map((link) => {
                  const active = isActive(link.href);
                  return (
                    <motion.div key={link.href} variants={drawerItem}>
                      <Link
                        href={link.href}
                        className={`flex items-center justify-between border-b border-white/5 py-3.5 pl-3 pr-2 text-base font-bold transition-colors ${
                          active
                            ? "text-emerald-300"
                            : "text-slate-200 hover:text-white"
                        }`}
                      >
                        {link.label}
                        <ArrowUpRight
                          className={`h-4 w-4 transition-opacity ${
                            active ? "opacity-100" : "opacity-30"
                          }`}
                        />
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.nav>

              <div className="space-y-5 border-t border-white/10 px-6 py-6">
                <Link
                  href="/aloqa"
                  className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-sky-500 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/30"
                >
                  <Phone className="h-4 w-4" />
                  Qabul haqida ma&rsquo;lumot
                </Link>
                <div className="flex items-center justify-center gap-3">
                  {socialLinks.map(({ href, label, Icon }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition hover:border-emerald-300/40 hover:bg-emerald-400/10 hover:text-emerald-300"
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  ))}
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
