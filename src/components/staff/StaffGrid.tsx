"use client";

import { motion } from "framer-motion";
import { Building2 } from "lucide-react";
import SafeImage from "@/components/SafeImage";
import type { StaffItem } from "@/lib/dto";

export default function StaffGrid({ items }: { items: StaffItem[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
              sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, (max-width:1280px) 33vw, 25vw"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-navy-950/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              aria-hidden
            />
          </div>
          <div className="p-5">
            {person.department && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-[11px] font-bold text-sky-700">
                <Building2 className="h-3 w-3" />
                {person.department}
              </span>
            )}
            <h2 className="mt-3 text-base font-bold text-navy-900">
              {person.fullName}
            </h2>
            <p className="mt-1 text-sm font-semibold text-emerald-600">
              {person.role}
            </p>
            {person.bio && (
              <p className="mt-2.5 text-xs leading-relaxed text-slate-500">
                {person.bio}
              </p>
            )}
          </div>
        </motion.article>
      ))}
    </div>
  );
}
