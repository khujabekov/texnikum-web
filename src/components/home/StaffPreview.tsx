"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import SafeImage from "@/components/SafeImage";
import type { StaffItem } from "@/lib/dto";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

export default function StaffPreview({ items }: { items: StaffItem[] }) {
  if (items.length === 0) return null;

  return (
    <section id="rahbariyat" className="relative bg-white py-16 sm:py-20 lg:py-24">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl">
          <SectionHeading
            align="center"
            kicker="Rahbariyat va ustozlar"
            title="Tajribali mutaxassislar jamoasi"
            description="Yo'nalishlarimizni tajribali rahbarlar, o'qituvchilar va usta-murabbiylar boshqaradi."
          />
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((person, index) => (
            <motion.article
              key={person.id}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.55,
                delay: (index % 4) * 0.1,
                ease: "easeOut",
              }}
              className="group overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm transition duration-300 hover:-translate-y-1.5 hover:border-emerald-300/60 hover:shadow-xl hover:shadow-emerald-500/10"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <SafeImage
                  src={person.imageUrl}
                  alt={person.fullName}
                  fallback="initials"
                  fallbackText={person.initials}
                  className="transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 25vw"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-navy-950/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  aria-hidden
                />
              </div>
              <div className="p-5">
                <h3 className="text-base font-bold text-navy-900">
                  {person.fullName}
                </h3>
                <p className="mt-1 text-sm font-semibold text-emerald-600">
                  {person.role}
                </p>
                {person.bio && (
                  <p className="mt-2.5 text-xs leading-relaxed text-slate-500 line-clamp-3">
                    {person.bio}
                  </p>
                )}
              </div>
            </motion.article>
          ))}
        </div>

        <Reveal delay={0.15} className="mt-10 text-center">
          <Link
            href="/rahbariyat"
            className="group inline-flex items-center gap-2 rounded-full border border-slate-300 px-7 py-3.5 text-sm font-bold text-navy-800 transition hover:border-emerald-400 hover:text-emerald-600"
          >
            Barcha xodimlar
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
