"use client";

import {
  motion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import { ArrowRight, ChevronDown, GraduationCap, Phone, Sparkles } from "lucide-react";
import Link from "next/link";
import SafeImage from "@/components/SafeImage";
import type { StatItem } from "@/lib/dto";

type HeroProps = {
  badge: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  imageAlt: string;
  chips: StatItem[];
  marqueeItems: string[];
  scrollTarget: string;
};

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

function splitTitle(title: string): [string, string] {
  const words = title.trim().split(/\s+/);
  if (words.length < 3) return [title, ""];
  const cut = Math.max(2, Math.ceil(words.length * 0.6));
  if (cut >= words.length) return [title, ""];
  return [words.slice(0, cut).join(" "), words.slice(cut).join(" ")];
}

export default function Hero({
  badge,
  title,
  subtitle,
  imageUrl,
  imageAlt,
  chips,
  marqueeItems,
  scrollTarget,
}: HeroProps) {
  const { scrollY } = useScroll();
  const imageY = useTransform(scrollY, [0, 700], [0, 70]);
  const glowY = useTransform(scrollY, [0, 700], [0, -60]);
  const [head, tail] = splitTitle(title);

  return (
    <section className="relative overflow-hidden bg-navy-900 text-white">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <motion.div
          style={{ y: glowY }}
          className="absolute -left-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-emerald-500/25 blur-3xl"
        >
          <div className="animate-float h-full w-full" />
        </motion.div>
        <motion.div
          style={{ y: imageY }}
          className="absolute -right-32 top-24 h-[26rem] w-[26rem] rounded-full bg-sky-500/20 blur-3xl"
        >
          <div className="animate-float-slow h-full w-full" />
        </motion.div>
        <div className="bg-grid-white absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_75%_65%_at_50%_35%,black,transparent)]" />
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-b from-transparent to-navy-950" />
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 pb-20 pt-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:px-8 lg:pb-28 lg:pt-20">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-2xl"
        >
          {badge && (
            <motion.span
              variants={item}
              className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-300"
            >
              <Sparkles className="h-3.5 w-3.5" />
              {badge}
            </motion.span>
          )}

          <motion.h1
            variants={item}
            className="mt-6 text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.4rem]"
          >
            {head}
            {tail && (
              <>
                {" "}
                <span className="text-gradient">{tail}</span>
              </>
            )}
          </motion.h1>

          {subtitle && (
            <motion.p
              variants={item}
              className="mt-6 text-base leading-relaxed text-slate-300 sm:text-lg"
            >
              {subtitle}
            </motion.p>
          )}

          <motion.div
            variants={item}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <Link
              href="/yonalishlar"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-7 py-3.5 text-sm font-bold text-white shadow-xl shadow-emerald-500/30 transition duration-300 hover:shadow-emerald-400/40 hover:brightness-110"
            >
              Yo&rsquo;nalishlarni ko&rsquo;rish
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              href="/aloqa"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-7 py-3.5 text-sm font-bold text-white backdrop-blur transition hover:border-emerald-300/40 hover:bg-white/10"
            >
              <Phone className="h-4 w-4 text-emerald-300" />
              Biz bilan aloqa
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.3, ease: "easeOut" }}
          className="relative"
        >
          <motion.div style={{ y: imageY }} className="relative">
            <div
              className="absolute -inset-3 rotate-2 rounded-[2.5rem] bg-gradient-to-br from-emerald-400/30 via-transparent to-sky-400/30 blur-sm"
              aria-hidden
            />
            <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl shadow-navy-950/60">
              <SafeImage
                src={imageUrl}
                alt={imageAlt}
                fallback="icon"
                fallbackIcon={GraduationCap}
                sizes="(max-width:1024px) 100vw, 50vw"
                priority
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-navy-950/50 via-transparent to-transparent"
                aria-hidden
              />
            </div>

            {chips[0] && (
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -right-3 -top-6 rounded-2xl border border-white/10 bg-navy-950/70 px-5 py-4 shadow-xl backdrop-blur-xl sm:-right-6"
              >
                <p className="text-gradient text-2xl font-extrabold tracking-tight">
                  {chips[0].value}
                </p>
                <p className="mt-0.5 max-w-[10rem] text-[11px] font-semibold leading-snug text-slate-300">
                  {chips[0].label}
                </p>
              </motion.div>
            )}
            {chips[1] && (
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
                className="absolute -bottom-6 -left-3 rounded-2xl border border-white/10 bg-navy-950/70 px-5 py-4 shadow-xl backdrop-blur-xl sm:-left-6"
              >
                <p className="text-gradient text-2xl font-extrabold tracking-tight">
                  {chips[1].value}
                </p>
                <p className="mt-0.5 max-w-[10rem] text-[11px] font-semibold leading-snug text-slate-300">
                  {chips[1].label}
                </p>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </div>

      {scrollTarget && (
        <motion.a
          href={`#${scrollTarget}`}
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[5.5rem] left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1.5 text-slate-400 transition-colors hover:text-emerald-300 lg:flex"
          aria-label="Pastga suring"
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.3em]">
            Pastga
          </span>
          <ChevronDown className="h-5 w-5" />
        </motion.a>
      )}

      {marqueeItems.length > 0 && (
        <div className="relative overflow-hidden border-t border-white/10 bg-navy-950 py-4">
          <div className="flex w-max animate-marquee">
            {[0, 1].map((copy) => (
              <div
                key={copy}
                className="flex items-center gap-10 pr-10"
                aria-hidden={copy === 1}
              >
                {marqueeItems.map((label) => (
                  <span
                    key={`${copy}-${label}`}
                    className="flex items-center gap-3 whitespace-nowrap text-sm font-semibold tracking-wide text-slate-300"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    {label}
                  </span>
                ))}
              </div>
            ))}
          </div>
          <div
            className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-navy-950 to-transparent"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-navy-950 to-transparent"
            aria-hidden
          />
        </div>
      )}
    </section>
  );
}
