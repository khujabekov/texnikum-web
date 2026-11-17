"use client";

import {
  Download,
  FileText,
  Inbox,
  Plus,
  Trash2,
} from "lucide-react";
import { useActionState, useEffect, useRef, useState } from "react";
import type { Document } from "@/generated/prisma/client";
import {
  createDocumentItem,
  deleteDocumentItem,
} from "@/app/admin/hujjatlar/actions";
import { IDLE_STATE } from "@/lib/action-state";
import { excerpt, formatDateUz } from "@/lib/format";
import FileUpload from "@/components/admin/FileUpload";
import {
  Field,
  StatusBanner,
  SubmitButton,
  TextareaField,
} from "@/components/admin/form-fields";

const DOCUMENT_CATEGORIES = [
  "Qabul",
  "O'quv jarayoni",
  "Talabalar hayoti",
  "Nizomlar",
  "Hamkorlik",
];

const DOCUMENT_ACCEPT =
  ".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document";

function DocumentForm({ onDone }: { onDone: () => void }) {
  const [state, formAction, pending] = useActionState(
    createDocumentItem,
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
        label="Hujjat sarlavhasi"
        name="title"
        placeholder="Masalan: Qabul qoidalari 2026/2027"
        required
      />
      <Field
        label="Kategoriya"
        name="category"
        placeholder="Masalan: Qabul"
        required
        suggestions={DOCUMENT_CATEGORIES}
      />
      <TextareaField
        label="Qisqa tavsif"
        name="description"
        placeholder="Hujjat mazmuni haqida bir-ikki gapda"
        rows={3}
      />
      <FileUpload
        name="fileUrl"
        label="Hujjat fayli"
        accept={DOCUMENT_ACCEPT}
        hint="PDF yoki DOCX — maksimal 10 MB"
      />

      <div className="flex justify-end border-t border-slate-100 pt-5">
        <SubmitButton
          pending={pending}
          label="Hujjatni qo'shish"
          pendingLabel="Yuklanmoqda..."
        />
      </div>
    </form>
  );
}

function DocumentCard({ item }: { item: Document }) {
  return (
    <article className="flex flex-col gap-4 overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm sm:flex-row">
      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-sky-500 text-white shadow-lg shadow-emerald-500/25">
        <FileText className="h-6 w-6" />
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-sky-50 px-2.5 py-0.5 text-[11px] font-bold text-sky-700">
            {item.category}
          </span>
          <span className="text-[11px] font-semibold text-slate-400">
            {formatDateUz(item.createdAt)}
          </span>
        </div>
        <h3 className="mt-2 text-base font-extrabold tracking-tight text-navy-900">
          {item.title}
        </h3>
        {item.description && (
          <p className="mt-1 text-sm font-medium leading-relaxed text-slate-500">
            {excerpt(item.description, 140)}
          </p>
        )}
        <a
          href={item.fileUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 transition hover:text-emerald-700"
        >
          <Download className="h-3.5 w-3.5" />
          Ochish / yuklab olish
        </a>
      </div>

      <form
        action={deleteDocumentItem}
        onSubmit={(event) => {
          if (
            !window.confirm(
              `"${item.title}" hujjatini o'chirishni tasdiqlaysizmi?`
            )
          ) {
            event.preventDefault();
          }
        }}
        className="shrink-0"
      >
        <input type="hidden" name="id" value={item.id} />
        <button
          type="submit"
          className="flex items-center gap-1 rounded-xl border border-red-200 px-3 py-1.5 text-xs font-bold text-red-600 transition hover:border-red-300 hover:bg-red-50"
        >
          <Trash2 className="h-3.5 w-3.5" />
          O&apos;chirish
        </button>
      </form>
    </article>
  );
}

export default function DocumentManager({
  items,
}: {
  items: Document[];
}) {
  const [creating, setCreating] = useState(false);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-extrabold tracking-tight text-navy-900">
          Hujjatlar ro&apos;yxati
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
          {creating ? "Yopish" : "Hujjat yuklash"}
        </button>
      </div>

      {creating && (
        <DocumentForm
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
            Hozircha hujjatlar yo&apos;q
          </p>
          <p className="max-w-sm text-xs font-semibold text-slate-500">
            Birinchi hujjatni yuklash uchun tepadagi &quot;Hujjat yuklash&quot;
            tugmasini bosing.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <DocumentCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
