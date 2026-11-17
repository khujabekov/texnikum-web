"use client";

import { motion } from "framer-motion";
import {
  Compass,
  GraduationCap,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { StatItem } from "@/lib/dto";
import CountUp from "./CountUp";

const ICONS: LucideIcon[] = [Users, GraduationCap, Compass, TrendingUp];

const SPANS = [
  "sm:col-span-2 lg:col-span-4",
  "lg:col-span-2",
  "lg:col-span-2",
  "sm:col-span-2 lg:col-span-4",
];

function StatCard({
  stat,
  index,
}: {
  stat: StatItem;
  index: number;
}) {
  const Icon = ICONS[index % ICONS.length];
  const accent = index === 0;
  const secondary = index === 3;

  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
      whileHover={{ y: -6 }}
      className={`group relative overflow-hidden rounded-3xl border p-7 sm:p-8 ${SPANS[index] ?? ""} ${
        accent
          ? "border-emerald-400/40 bg-gradient-to-br from-emerald-500 to-teal-600 shadow-2xl shadow-emerald-500/25"
          : secondary
            ? "border-sky-400/30 bg-gradient-to-br from-sky-600 to-blue-700 shadow-2xl shadow-sky-600/20"
            : "border-white/10 bg-white/[0.04] backdrop-blur"
      }`}
    >
      <Icon
        className="pointer-events-none absolute -bottom-6 -right-6 h-32 w-32 opacity-10 transition-transform duration-500 group-hover:scale-110"
        aria-hidden
      />
      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p
            className={`text-4xl font-extrabold tracking-tight sm:text-5xl ${
              accent || secondary ? "text-white" : "text-gradient"
            }`}
          >
            <CountUp value={stat.value} />
          </p>
          <p
            className={`mt-2.5 text-sm font-semibold leading-snug ${
              accent
                ? "text-emerald-50/90"
                : secondary
                  ? "text-sky-50/90"
                  : "text-slate-300"
            }`}
          >
            {stat.label}
          </p>
        </div>
        <span
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
            accent || secondary
              ? "bg-white/15 text-white"
              : "bg-emerald-400/10 text-emerald-300"
          }`}
        >
          <Icon className="h-6 w-6" />
        </span>
      </div>
      <div
        className={`absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r transition-opacity duration-300 ${
          secondary ? "from-sky-300 to-blue-300" : "from-emerald-400 to-sky-400"
        } ${accent || secondary ? "opacity-80" : "opacity-0 group-hover:opacity-100"}`}
      />
    </motion.article>
  );
}

export default function Stats({ stats }: { stats: StatItem[] }) {
  return (
    <section id="stats" className="relative bg-navy-950 py-16 text-white sm:py-20 lg:py-24">
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-64 w-[42rem] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl"
        aria-hidden
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center text-xs font-bold uppercase tracking-[0.3em] text-emerald-300/80"
        >
          Raqamlarda texnikum
        </motion.p>
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-6">
          {stats.slice(0, 4).map((stat, index) => (
            <StatCard key={stat.label} stat={stat} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
