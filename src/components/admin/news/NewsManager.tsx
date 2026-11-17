"use client";

import {
  ChevronUp,
  Eye,
  EyeOff,
  Inbox,
  Newspaper,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import {
  useActionState,
  useEffect,
  useRef,
  useState,
} from "react";
import type { News } from "@/generated/prisma/client";
import {
  createNewsItem,
  deleteNewsItem,
  toggleNewsPublished,
  updateNewsItem,
} from "@/app/admin/yangiliklar/actions";
import { IDLE_STATE } from "@/lib/action-state";
import { excerpt, formatDateUz } from "@/lib/format";
import FileUpload from "@/components/admin/FileUpload";
import {
  Field,
  StatusBanner,
  SubmitButton,
  TextareaField,
  ToggleRow,
} from "@/components/admin/form-fields";

const NEWS_CATEGORIES = [
  "E'lon",
  "Yangilik",
  "Tadbir",
  "Tanlov",
  "Hamkorlik",
  "Mehnat bozori",
];

const smallButtonClass =
  "flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-50";

function NewsForm({
  item,
  onDone,
}: {
  item?: News;
  onDone: () => void;
}) {
  const isEdit = Boolean(item);
  const [state, formAction, pending] = useActionState(
    isEdit ? updateNewsItem : createNewsItem,
    IDLE_STATE
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") {
      if (!isEdit) formRef.current?.reset();
      onDone();
    }
  }, [state, isEdit, onDone]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="space-y-5 overflow-hidden rounded-3xl border border-emerald-200/70 bg-white p-5 shadow-sm sm:p-6"
    >
      {isEdit && <input type="hidden" name="id" value={item?.id} />}
      <StatusBanner state={state} />

      <Field
        label="Sarlavha"
        name="title"
        defaultValue={item?.title}
        placeholder="Yangilik sarlavhasi"
        required
      />
      <Field
        label="Kategoriya"
        name="category"
        defaultValue={item?.category}
        placeholder="Masalan: Tadbir"
        required
        suggestions={NEWS_CATEGORIES}
      />
      <TextareaField
        label="Yangilik matni"
        name="content"
        defaultValue={item?.content}
        placeholder="Yangilikning to'liq matni"
        required
        rows={8}
      />
      <FileUpload
        name="imageUrl"
        label="Yangilik rasmi"
        initialUrl={item?.imageUrl}
      />
      <ToggleRow
        name="published"
        label="Nashr qilingan"
        description="Saytda ko'rinadi"
        defaultChecked={item ? item.published : true}
      />

      <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
        {isEdit && (
          <button
            type="button"
            onClick={onDone}
            className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-6 py-3.5 text-sm font-bold text-slate-500 transition hover:border-red-200 hover:text-red-600"
          >
            <X className="h-4 w-4" />
            Bekor qilish
          </button>
        )}
        <SubmitButton
          pending={pending}
          label={isEdit ? "Saqlash" : "Qo'shish"}
          pendingLabel="Saqlanmoqda..."
        />
      </div>
    </form>
  );
}

function NewsCard({
  item,
  onEdit,
}: {
  item: News;
  onEdit: () => void;
}) {
  return (
    <article className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm">
      <div className="flex flex-col gap-4 p-5 sm:flex-row">
        <div className="flex h-24 w-32 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-slate-100">
          {item.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.imageUrl}
              alt={item.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <Newspaper className="h-7 w-7 text-slate-300" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                item.published
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {item.published ? "Nashr qilingan" : "Yashirin"}
            </span>
            <span className="rounded-full bg-sky-50 px-2.5 py-0.5 text-[11px] font-bold text-sky-700">
              {item.category}
            </span>
          </div>
          <h3 className="mt-2 text-base font-extrabold tracking-tight text-navy-900">
            {item.title}
          </h3>
          <p className="mt-1 text-xs font-semibold text-slate-400">
            {formatDateUz(item.createdAt)} • {item.views} marta o&apos;qilgan
          </p>
          <p className="mt-2 text-sm font-medium leading-relaxed text-slate-500">
            {excerpt(item.content, 160)}
          </p>
        </div>

        <div className="flex shrink-0 flex-row flex-wrap items-start gap-2 sm:flex-col">
          <form action={toggleNewsPublished}>
            <input type="hidden" name="id" value={item.id} />
            <button
              type="submit"
              title={item.published ? "Nashrdan olish" : "Nashrlash"}
              className={`${smallButtonClass} text-navy-700 hover:border-amber-300 hover:text-amber-600`}
            >
              {item.published ? (
                <>
                  <EyeOff className="h-3.5 w-3.5" />
                  Yashirish
                </>
              ) : (
                <>
                  <Eye className="h-3.5 w-3.5" />
                  Nashrlash
                </>
              )}
            </button>
          </form>
          <button
            type="button"
            onClick={onEdit}
            className={`${smallButtonClass} text-navy-700 hover:border-emerald-300 hover:text-emerald-600`}
          >
            <Pencil className="h-3.5 w-3.5" />
            Tahrirlash
          </button>
          <form
            action={deleteNewsItem}
            onSubmit={(event) => {
              if (
                !window.confirm(
                  `"${item.title}" yangiligini o'chirishni tasdiqlaysizmi?`
                )
              ) {
                event.preventDefault();
              }
            }}
          >
            <input type="hidden" name="id" value={item.id} />
            <button
              type="submit"
              className={`${smallButtonClass} border-red-200 text-red-600 hover:border-red-300 hover:bg-red-50`}
            >
              <Trash2 className="h-3.5 w-3.5" />
              O&apos;chirish
            </button>
          </form>
        </div>
      </div>
    </article>
  );
}

export default function NewsManager({ items }: { items: News[] }) {
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const editing = items.find((item) => item.id === editingId) ?? null;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-extrabold tracking-tight text-navy-900">
          Yangiliklar ro&apos;yxati
          <span className="ml-2 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
            {items.length}
          </span>
        </h2>
        <button
          type="button"
          onClick={() => {
            setEditingId(null);
            setCreating((open) => !open);
          }}
          className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-sky-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/30 transition duration-300 hover:shadow-emerald-400/40 hover:brightness-110"
        >
          <Plus className="h-4 w-4" />
          {creating ? "Yopish" : "Yangilik qo'shish"}
        </button>
      </div>

      {creating && (
        <NewsForm
          onDone={() => {
            setCreating(false);
          }}
        />
      )}

      {items.length === 0 && !creating && !editing ? (
        <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-100 text-slate-400">
            <Inbox className="h-6 w-6" />
          </span>
          <p className="text-sm font-bold text-navy-900">
            Hozircha yangiliklar yo&apos;q
          </p>
          <p className="max-w-sm text-xs font-semibold text-slate-500">
            Birinchi yangilikni qo&apos;shish uchun tepadagi &quot;Yangilik
            qo&apos;shish&quot; tugmasini bosing.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {editing && (
            <p className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-slate-400">
              <ChevronUp className="h-3.5 w-3.5" />
              Tahrirlanmoqda
            </p>
          )}
          {items.map((item) => (
            <div key={item.id}>
              {editingId === item.id ? (
                <NewsForm
                  item={item}
                  onDone={() => {
                    setEditingId(null);
                  }}
                />
              ) : (
                <NewsCard item={item} onEdit={() => setEditingId(item.id)} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
