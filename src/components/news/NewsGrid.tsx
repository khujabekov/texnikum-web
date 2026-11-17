"use client";

import { motion } from "framer-motion";
import { ArrowRight, CalendarDays, Eye, Newspaper } from "lucide-react";
import Link from "next/link";
import SafeImage from "@/components/SafeImage";
import type { NewsItem } from "@/lib/dto";

const BADGES = [
  "border-emerald-200 bg-emerald-50 text-emerald-700",
  "border-sky-200 bg-sky-50 text-sky-700",
  "border-amber-200 bg-amber-50 text-amber-700",
];

export default function NewsGrid({ items }: { items: NewsItem[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, index) => (
        <motion.article
          key={item.id}
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{
            duration: 0.55,
            delay: (index % 3) * 0.1,
            ease: "easeOut",
          }}
          className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm transition duration-300 hover:-translate-y-1.5 hover:border-emerald-300/60 hover:shadow-xl hover:shadow-emerald-500/10"
        >
          <div className="relative aspect-[16/10] overflow-hidden">
            <SafeImage
              src={item.imageUrl}
              alt={item.title}
              fallback="icon"
              fallbackIcon={Newspaper}
              className="transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
            />
          </div>
          <div className="flex flex-1 flex-col p-6">
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
            <h2 className="mt-4 text-lg font-bold leading-snug text-navy-900 transition-colors group-hover:text-emerald-700 line-clamp-2">
              <Link href={`/yangiliklar/${item.slug}`}>{item.title}</Link>
            </h2>
            <p className="mt-2.5 flex-1 text-sm leading-relaxed text-slate-600 line-clamp-3">
              {item.excerpt}
            </p>
            <Link
              href={`/yangiliklar/${item.slug}`}
              className="group/link mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-emerald-600 transition hover:text-emerald-700"
            >
              Batafsil o&rsquo;qish
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-1" />
            </Link>
          </div>
        </motion.article>
      ))}
    </div>
  );
}
