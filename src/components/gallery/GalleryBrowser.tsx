"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  X,
  ZoomIn,
} from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import SafeImage from "@/components/SafeImage";
import type { GalleryPhoto } from "@/lib/dto";

const ASPECTS = [
  "aspect-[4/3]",
  "aspect-[3/4]",
  "aspect-square",
  "aspect-[4/5]",
];

export default function GalleryBrowser({ items }: { items: GalleryPhoto[] }) {
  const categories = useMemo(() => {
    const seen = new Set<string>();
    return items
      .map((photo) => photo.category)
      .filter((category) => {
        if (!category || seen.has(category)) return false;
        seen.add(category);
        return true;
      });
  }, [items]);

  const [active, setActive] = useState<string>("");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const filtered = useMemo(
    () =>
      active ? items.filter((photo) => photo.category === active) : items,
    [items, active]
  );

  const close = useCallback(() => setOpenIndex(null), []);
  const show = useCallback(
    (index: number) => setOpenIndex(Math.max(0, Math.min(index, filtered.length - 1))),
    [filtered.length]
  );
  const prev = useCallback(
    () =>
      setOpenIndex((current) =>
        current === null ? null : (current - 1 + filtered.length) % filtered.length
      ),
    [filtered.length]
  );
  const next = useCallback(
    () =>
      setOpenIndex((current) =>
        current === null ? null : (current + 1) % filtered.length
      ),
    [filtered.length]
  );

  const open = openIndex !== null;
  const current = open ? filtered[openIndex] : null;

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") prev();
      if (event.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close, prev, next]);

  const tabs = [
    { value: "", label: "Barchasi" },
    ...categories.map((category) => ({ value: category, label: category })),
  ];

  return (
    <div>
      <div
        role="tablist"
        aria-label="Galereya kategoriyalari"
        className="-mx-4 flex snap-x gap-2.5 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0"
      >
        {tabs.map((tab) => {
          const isActive = active === tab.value;
          return (
            <button
              key={tab.value || "__all__"}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => {
                setActive(tab.value);
                close();
              }}
              className={`shrink-0 snap-start rounded-full border px-5 py-2.5 text-sm font-bold transition duration-300 ${
                isActive
                  ? "border-transparent bg-gradient-to-r from-emerald-500 to-sky-500 text-white shadow-lg shadow-emerald-500/25"
                  : "border-slate-300 bg-white text-navy-800 hover:border-emerald-400 hover:text-emerald-600"
              }`}
            >
              {tab.label}
              <span
                className={`ml-2 text-xs font-semibold ${
                  isActive ? "text-emerald-100" : "text-slate-400"
                }`}
              >
                {tab.value
                  ? items.filter((photo) => photo.category === tab.value).length
                  : items.length}
              </span>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="mt-12 flex flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-500">
            <ImageIcon className="h-7 w-7" />
          </span>
          <p className="text-sm font-semibold text-slate-500">
            Bu kategoriyada hozircha rasmlar yo&rsquo;q
          </p>
        </div>
      ) : (
        <div className="mt-8 columns-2 gap-4 sm:columns-3 lg:columns-4 [&>*]:mb-4">
          {filtered.map((photo, index) => (
            <motion.button
              key={photo.id}
              type="button"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.5,
                delay: (index % 4) * 0.07,
                ease: "easeOut",
              }}
              onClick={() => show(index)}
              className={`group relative block w-full break-inside-avoid overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/10 ${
                ASPECTS[index % ASPECTS.length]
              }`}
              aria-label={`${photo.title} rasmini kattalashtirish`}
            >
              <SafeImage
                src={photo.imageUrl}
                alt={photo.title}
                fallback="icon"
                fallbackIcon="image"
                className="transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width:640px) 50vw, 25vw"
              />
              <span
                className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-950/20 to-transparent opacity-0 transition duration-300 group-hover:opacity-100"
                aria-hidden
              />
              <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white opacity-0 backdrop-blur transition duration-300 group-hover:opacity-100">
                <ZoomIn className="h-4 w-4" />
              </span>
              <span className="absolute inset-x-0 bottom-0 flex flex-col items-start p-4 text-left opacity-0 transition duration-300 group-hover:opacity-100">
                <span className="w-max rounded-full bg-emerald-400/25 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-200">
                  {photo.category}
                </span>
                <span className="mt-1.5 text-sm font-bold text-white">
                  {photo.title}
                </span>
              </span>
            </motion.button>
          ))}
        </div>
      )}

      <AnimatePresence>
        {open && current && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={close}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-navy-950/90 p-4 backdrop-blur-sm sm:p-8"
            role="dialog"
            aria-modal="true"
            aria-label={`${current.title} — galereya rasmi`}
          >
            <button
              type="button"
              onClick={close}
              aria-label="Yopish"
              className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-white transition hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </button>

            {filtered.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    prev();
                  }}
                  aria-label="Oldingi rasm"
                  className="absolute left-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-white transition hover:bg-white/20 sm:left-6 sm:h-12 sm:w-12"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    next();
                  }}
                  aria-label="Keyingi rasm"
                  className="absolute right-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-white transition hover:bg-white/20 sm:right-6 sm:h-12 sm:w-12"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}

            <motion.figure
              key={current.id}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              onClick={(event) => event.stopPropagation()}
              drag={filtered.length > 1 ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.6}
              onDragEnd={(_, info) => {
                if (info.offset.x < -70) next();
                else if (info.offset.x > 70) prev();
              }}
              className="relative flex w-full max-w-5xl flex-col"
            >
              <div className="relative h-[60vh] w-full overflow-hidden rounded-3xl border border-white/10 bg-navy-900 shadow-2xl sm:h-[68vh]">
                <Image
                  src={current.imageUrl}
                  alt={current.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 1024px"
                  unoptimized={/^https?:\/\//i.test(current.imageUrl)}
                  className="object-contain"
                  priority
                />
              </div>
              <figcaption className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <span className="w-max rounded-full bg-emerald-400/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-300">
                    {current.category}
                  </span>
                  <p className="mt-1.5 truncate text-sm font-bold text-white sm:text-base">
                    {current.title}
                  </p>
                </div>
                <span className="shrink-0 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-bold text-slate-300">
                  {(openIndex ?? 0) + 1} / {filtered.length}
                </span>
              </figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
