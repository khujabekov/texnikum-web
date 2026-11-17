"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Clock,
  Image as ImageIcon,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import Link from "next/link";
import SafeImage from "@/components/SafeImage";
import type { ContactInfo, GalleryPhoto } from "@/lib/dto";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

const ASPECTS = [
  "aspect-[4/3]",
  "aspect-[3/4]",
  "aspect-square",
  "aspect-[4/5]",
];

function ContactCard({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof MapPin;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur transition hover:border-emerald-300/30">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          {label}
        </p>
        <div className="mt-1 text-sm font-semibold leading-relaxed text-white">
          {children}
        </div>
      </div>
    </li>
  );
}

export default function GalleryContact({
  items,
  contact,
}: {
  items: GalleryPhoto[];
  contact: ContactInfo;
}) {
  const hasContact =
    contact.address ||
    contact.phones.length > 0 ||
    contact.email ||
    contact.workHours;

  return (
    <section
      id="galereya"
      className="relative overflow-hidden bg-navy-900 py-16 text-white sm:py-20 lg:py-24"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -left-32 bottom-0 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute -right-32 top-0 h-96 w-96 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="bg-grid-white absolute inset-0 opacity-30 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,black,transparent)]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {items.length > 0 && (
          <>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <Reveal>
                <SectionHeading
                  dark
                  kicker="Galereya"
                  title="Kampus hayoti lavhalarda"
                />
              </Reveal>
              <Reveal delay={0.15}>
                <Link
                  href="/galereya"
                  className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-bold text-white backdrop-blur transition hover:border-emerald-300/40 hover:bg-white/10"
                >
                  Barcha rasmlar
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Reveal>
            </div>

            <div className="mt-12 columns-2 gap-4 sm:columns-3 lg:columns-4 [&>*]:mb-4">
              {items.map((photo, index) => (
                <motion.figure
                  key={photo.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{
                    duration: 0.5,
                    delay: (index % 4) * 0.07,
                    ease: "easeOut",
                  }}
                  className={`group relative break-inside-avoid overflow-hidden rounded-2xl border border-white/10 ${
                    ASPECTS[index % ASPECTS.length]
                  }`}
                >
                  <SafeImage
                    src={photo.imageUrl}
                    alt={photo.title}
                    fallback="icon"
                    fallbackIcon={ImageIcon}
                    className="transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width:640px) 50vw, 25vw"
                  />
                  <figcaption className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-navy-950/85 via-navy-950/20 to-transparent p-4 opacity-0 transition duration-300 group-hover:opacity-100">
                    <span className="w-max rounded-full bg-emerald-400/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-300">
                      {photo.category}
                    </span>
                    <p className="mt-1.5 text-sm font-bold text-white">
                      {photo.title}
                    </p>
                  </figcaption>
                </motion.figure>
              ))}
            </div>
          </>
        )}

        {hasContact && (
          <div
            className={`grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-10 ${
              items.length > 0 ? "mt-16" : ""
            }`}
          >
            <Reveal delay={items.length > 0 ? 0.1 : 0}>
              <SectionHeading
                dark
                kicker="Aloqa"
                title="Manzil va aloqa"
                description="Qabul, hamkorlik va boshqa savollaringiz bo'yicha biz bilan bog'laning."
              />
              <ul className="mt-8 space-y-4">
                {contact.address && (
                  <ContactCard icon={MapPin} label="Manzil">
                    {contact.address}
                  </ContactCard>
                )}
                {contact.phones.length > 0 && (
                  <ContactCard icon={Phone} label="Telefon">
                    <span className="flex flex-col gap-1">
                      {contact.phones.map((phone) => (
                        <a
                          key={phone}
                          href={`tel:${phone.replace(/[^\d+]/g, "")}`}
                          className="transition hover:text-emerald-300"
                        >
                          {phone}
                        </a>
                      ))}
                    </span>
                  </ContactCard>
                )}
                {contact.email && (
                  <ContactCard icon={Mail} label="Elektron pochta">
                    <a
                      href={`mailto:${contact.email}`}
                      className="transition hover:text-emerald-300"
                    >
                      {contact.email}
                    </a>
                  </ContactCard>
                )}
                {contact.workHours && (
                  <ContactCard icon={Clock} label="Ish vaqti">
                    {contact.workHours}
                  </ContactCard>
                )}
              </ul>
            </Reveal>

            <Reveal delay={0.2} className="h-full">
              <div className="h-full overflow-hidden rounded-3xl border border-white/10 bg-navy-800 shadow-2xl">
                {contact.mapEmbedUrl ? (
                  <iframe
                    src={contact.mapEmbedUrl}
                    title="Texnikum xaritada"
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    className="h-full min-h-[420px] w-full border-0"
                  />
                ) : (
                  <div className="flex h-full min-h-[420px] w-full flex-col items-center justify-center gap-4 bg-gradient-to-br from-navy-800 to-navy-950 text-center">
                    <span className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-300">
                      <MapPin className="h-8 w-8" />
                    </span>
                    <p className="text-sm font-semibold text-slate-300">
                      Xarita tez orada qo&rsquo;shiladi
                    </p>
                  </div>
                )}
              </div>
            </Reveal>
          </div>
        )}
      </div>
    </section>
  );
}
