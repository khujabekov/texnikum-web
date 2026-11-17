"use client";

import { Images, Inbox, Plus, Trash2 } from "lucide-react";
import { useActionState, useEffect, useRef, useState } from "react";
import type { Gallery } from "@/generated/prisma/client";
import {
  createGalleryItem,
  deleteGalleryItem,
} from "@/app/admin/galereya/actions";
import { IDLE_STATE } from "@/lib/action-state";
import { formatDateUz } from "@/lib/format";
import FileUpload from "@/components/admin/FileUpload";
import {
  Field,
  StatusBanner,
  SubmitButton,
} from "@/components/admin/form-fields";

const GALLERY_CATEGORIES = [
  "Kampus",
  "Laboratoriyalar",
  "Tadbirlar",
  "Sport",
  "Ustaxonalar",
  "Yotoqxona",
];

function GalleryForm({ onDone }: { onDone: () => void }) {
  const [state, formAction, pending] = useActionState(
    createGalleryItem,
    IDLE_STATE
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
      onDone();
    }
  }, [state, onDone]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="space-y-5 overflow-hidden rounded-3xl border border-emerald-200/70 bg-white p-5 shadow-sm sm:p-6"
    >
      <StatusBanner state={state} />
      <Field
        label="Rasm sarlavhasi"
        name="title"
        placeholder="Masalan: Amaliyot mashg'uloti"
        required
      />
      <Field
        label="Kategoriya"
        name="category"
        placeholder="Masalan: Laboratoriyalar"
        required
        suggestions={GALLERY_CATEGORIES}
      />
      <FileUpload name="imageUrl" label="Yangi rasm" />

      <div className="flex justify-end border-t border-slate-100 pt-5">
        <SubmitButton
          pending={pending}
          label="Galereyaga qo'shish"
          pendingLabel="Yuklanmoqda..."
        />
      </div>
    </form>
  );
}

function GalleryCard({ item }: { item: Gallery }) {
  return (
    <figure className="group relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm">
      <div className="flex h-44 items-center justify-center overflow-hidden bg-slate-100 sm:h-48">
        {item.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.imageUrl}
            alt={item.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <Images className="h-8 w-8 text-slate-300" />
        )}
      </div>
      <figcaption className="space-y-1 p-4">
        <span className="rounded-full bg-sky-50 px-2.5 py-0.5 text-[11px] font-bold text-sky-700">
          {item.category}
        </span>
        <h3 className="text-sm font-bold tracking-tight text-navy-900">
          {item.title}
        </h3>
        <p className="text-[11px] font-semibold text-slate-400">
          {formatDateUz(item.createdAt)}
        </p>
      </figcaption>
      <form
        action={deleteGalleryItem}
        onSubmit={(event) => {
          if (
            !window.confirm(
              `"${item.title}" rasmini o'chirishni tasdiqlaysizmi?`
            )
          ) {
            event.preventDefault();
          }
        }}
        className="absolute right-3 top-3"
      >
        <input type="hidden" name="id" value={item.id} />
        <button
          type="submit"
          title="O'chirish"
          aria-label="O'chirish"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-200 bg-white/90 text-red-600 shadow-sm backdrop-blur-sm transition hover:border-red-300 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </form>
    </figure>
  );
}

export default function GalleryManager({ items }: { items: Gallery[] }) {
  const [creating, setCreating] = useState(false);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-extrabold tracking-tight text-navy-900">
          Galereya rasmlari
          <span className="ml-2 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
            {items.length}
          </span>
        </h2>
        <button
          type="button"
          onClick={() => setCreating((open) => !open)}
          className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-sky-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/30 transition duration-300 hover:shadow-emerald-400/40 hover:brightness-110"
        >
          <Plus className="h-4 w-4" />
          {creating ? "Yopish" : "Rasm yuklash"}
        </button>
      </div>

      {creating && (
        <GalleryForm
          onDone={() => {
            setCreating(false);
          }}
        />
      )}

      {items.length === 0 && !creating ? (
        <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-100 text-slate-400">
            <Inbox className="h-6 w-6" />
          </span>
          <p className="text-sm font-bold text-navy-900">
            Galereya hozircha bo&apos;sh
          </p>
          <p className="max-w-sm text-xs font-semibold text-slate-500">
            Birinchi rasmni yuklash uchun tepadagi &quot;Rasm yuklash&quot;
            tugmasini bosing.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <GalleryCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
