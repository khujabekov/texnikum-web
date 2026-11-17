"use client";

import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Clock, Compass } from "lucide-react";
import Link from "next/link";
import SafeImage from "@/components/SafeImage";
import type { DirectionItem } from "@/lib/dto";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

export default function Directions({ items }: { items: DirectionItem[] }) {
  return (
    <section id="yonalishlar" className="relative bg-white py-16 sm:py-20 lg:py-24">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal>
            <SectionHeading
              kicker="Ta'lim yo'nalishlari"
              title="Kelajak kasbingizni tanlang"
              description={`${items.length} ta zamonaviy ta'lim yo'nalishi — IT-dan qurilishgacha. O'zingizga mos kasbni tanlang va kelajagingizni bugundan boshlang.`}
            />
          </Reveal>
          <Reveal delay={0.15}>
            <Link
              href="/yonalishlar"
              className="group hidden items-center gap-2 text-sm font-bold text-navy-700 transition hover:text-emerald-600 sm:inline-flex"
            >
              Barcha yo&rsquo;nalishlar
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((direction, index) => (
            <motion.article
              key={direction.id}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.55,
                delay: (index % 3) * 0.1,
                ease: "easeOut",
              }}
              className="group relative flex flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm transition duration-300 hover:-translate-y-1.5 hover:border-emerald-300/60 hover:shadow-xl hover:shadow-emerald-500/10"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <SafeImage
                  src={direction.imageUrl}
                  alt={direction.title}
                  fallback="icon"
                  fallbackIcon={Compass}
                  className="transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-navy-950/10 to-transparent"
                  aria-hidden
                />
                <div className="absolute inset-x-4 bottom-4 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-navy-950/60 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
                    <Clock className="h-3 w-3 text-emerald-300" />
                    {direction.duration}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-navy-950/60 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
                    <BookOpen className="h-3 w-3 text-emerald-300" />
                    {direction.eduForm}
                  </span>
                </div>
              </div>

              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-lg font-bold text-navy-900 transition-colors group-hover:text-emerald-700">
                  {direction.title}
                </h3>
                <p className="mt-2.5 flex-1 text-sm leading-relaxed text-slate-600 line-clamp-3">
                  {direction.shortDesc}
                </p>
                <Link
                  href={`/yonalishlar/${direction.slug}`}
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-emerald-600 transition hover:text-emerald-700"
                >
                  Batafsil
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-10 text-center sm:hidden">
          <Link
            href="/yonalishlar"
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-6 py-3 text-sm font-bold text-navy-800 transition hover:border-emerald-400 hover:text-emerald-600"
          >
            Barcha yo&rsquo;nalishlar
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
