"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Eye,
  Newspaper,
} from "lucide-react";
import Link from "next/link";
import SafeImage from "@/components/SafeImage";
import type { NewsItem } from "@/lib/dto";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

const BADGES = [
  "border-emerald-200 bg-emerald-50 text-emerald-700",
  "border-sky-200 bg-sky-50 text-sky-700",
  "border-amber-200 bg-amber-50 text-amber-700",
];

function Meta({ item, index }: { item: NewsItem; index: number }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold text-slate-500">
      <span
        className={`rounded-full border px-3 py-1 font-bold ${BADGES[index % BADGES.length]}`}
      >
        {item.category}
      </span>
      {item.dateLabel && (
        <span className="inline-flex items-center gap-1.5">
          <CalendarDays className="h-3.5 w-3.5 text-emerald-500" />
          {item.dateLabel}
        </span>
      )}
      <span className="inline-flex items-center gap-1.5">
        <Eye className="h-3.5 w-3.5 text-sky-500" />
        {item.views}
      </span>
    </div>
  );
}

function NewsLink({ slug }: { slug: string }) {
  return (
    <Link
      href={`/yangiliklar/${slug}`}
      className="group/link mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-emerald-600 transition hover:text-emerald-700"
    >
      Batafsil o&rsquo;qish
      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-1" />
    </Link>
  );
}

export default function NewsSection({ items }: { items: NewsItem[] }) {
  if (items.length === 0) return null;
  const [featured, ...rest] = items;
  const promoSpan = items.length >= 3 ? "lg:col-span-2" : "lg:col-span-1";

  return (
    <section
      id="yangiliklar"
      className="relative bg-slate-50 py-16 sm:py-20 lg:py-24"
    >
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal>
            <SectionHeading
              kicker="Yangiliklar"
              title="So'nggi yangiliklar va e'lonlar"
              description="Texnikum hayotidagi eng dolzarb yangiliklar, tadbirlar va rasmiy e'lonlar."
            />
          </Reveal>
          <Reveal delay={0.15}>
            <Link
              href="/yangiliklar"
              className="group hidden items-center gap-2 text-sm font-bold text-navy-700 transition hover:text-emerald-600 sm:inline-flex"
            >
              Barcha yangiliklar
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          <motion.article
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm transition duration-300 hover:-translate-y-1.5 hover:border-emerald-300/60 hover:shadow-xl hover:shadow-emerald-500/10 sm:flex-row lg:col-span-2"
          >
            <div className="relative aspect-[16/10] overflow-hidden sm:aspect-auto sm:w-[45%]">
              <SafeImage
                src={featured.imageUrl}
                alt={featured.title}
                fallback="icon"
                fallbackIcon={Newspaper}
                className="transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width:640px) 100vw, 45vw"
              />
            </div>
            <div className="flex flex-1 flex-col p-6 sm:p-7">
              <Meta item={featured} index={0} />
              <h3 className="mt-4 text-xl font-bold leading-snug text-navy-900 transition-colors group-hover:text-emerald-700 sm:text-2xl">
                {featured.title}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600 line-clamp-4 sm:line-clamp-3">
                {featured.excerpt}
              </p>
              <NewsLink slug={featured.slug} />
            </div>
          </motion.article>

          {rest.slice(0, 2).map((item, index) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: (index + 1) * 0.1, ease: "easeOut" }}
              className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm transition duration-300 hover:-translate-y-1.5 hover:border-emerald-300/60 hover:shadow-xl hover:shadow-emerald-500/10"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <SafeImage
                  src={item.imageUrl}
                  alt={item.title}
                  fallback="icon"
                  fallbackIcon={Newspaper}
                  className="transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width:1024px) 100vw, 33vw"
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <Meta item={item} index={index + 1} />
                <h3 className="mt-4 text-lg font-bold leading-snug text-navy-900 transition-colors group-hover:text-emerald-700 line-clamp-2">
                  {item.title}
                </h3>
                <p className="mt-2.5 flex-1 text-sm leading-relaxed text-slate-600 line-clamp-2">
                  {item.excerpt}
                </p>
                <NewsLink slug={item.slug} />
              </div>
            </motion.article>
          ))}

          <Reveal delay={0.2} className={`${promoSpan} h-full`}>
            <Link
              href="/yangiliklar"
              className="group relative flex h-full min-h-[10rem] items-center justify-between gap-6 overflow-hidden rounded-3xl bg-navy-900 p-8 text-white shadow-xl shadow-navy-900/20 transition duration-300 hover:shadow-2xl"
            >
              <div className="bg-grid-white absolute inset-0 opacity-40" aria-hidden />
              <div
                className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-emerald-500/25 opacity-70 blur-3xl transition-opacity duration-300 group-hover:opacity-100"
                aria-hidden
              />
              <div className="relative">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-300">
                  <Newspaper className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-xl font-extrabold tracking-tight sm:text-2xl">
                  Barcha yangiliklar va e&rsquo;lonlar
                </h3>
                <p className="mt-2 text-sm text-slate-300">
                  Eng so&rsquo;nggi yangiliklarni kuzatib boring
                </p>
              </div>
              <span className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-sky-500 shadow-lg shadow-emerald-500/30 transition-transform duration-300 group-hover:rotate-45">
                <ArrowUpRight className="h-6 w-6 text-white" />
              </span>
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
