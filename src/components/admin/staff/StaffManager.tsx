"use client";

import {
  ChevronDown,
  ChevronUp,
  Inbox,
  Pencil,
  Plus,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import { useActionState, useEffect, useRef, useState } from "react";
import type { Staff } from "@/generated/prisma/client";
import {
  createStaffItem,
  deleteStaffItem,
  moveStaff,
  updateStaffItem,
} from "@/app/admin/rahbariyat/actions";
import { IDLE_STATE } from "@/lib/action-state";
import { excerpt } from "@/lib/format";
import FileUpload from "@/components/admin/FileUpload";
import {
  Field,
  StatusBanner,
  SubmitButton,
  TextareaField,
} from "@/components/admin/form-fields";

const smallButtonClass =
  "flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-50";

function StaffForm({ item, onDone }: { item?: Staff; onDone: () => void }) {
  const isEdit = Boolean(item);
  const [state, formAction, pending] = useActionState(
    isEdit ? updateStaffItem : createStaffItem,
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
        label="F.I.Sh."
        name="fullName"
        defaultValue={item?.fullName}
        placeholder="Xodimning to'liq ismi"
        required
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Lavozim"
          name="role"
          defaultValue={item?.role}
          placeholder="Masalan: Direktor"
          required
        />
        <Field
          label="Bo'lim"
          name="department"
          defaultValue={item?.department}
          placeholder="Masalan: O'quv ishlari"
          required
        />
      </div>
      <TextareaField
        label="Qisqa ma'lumot"
        name="bio"
        defaultValue={item?.bio}
        placeholder="Xodim haqida qisqa ma'lumot"
        rows={4}
      />
      <Field
        label="Tartib raqami"
        name="order"
        defaultValue={item ? item.order : ""}
        type="number"
        hint="Bo'sh qoldirilsa oxiriga qo'shiladi"
      />
      <FileUpload
        name="imageUrl"
        label="Xodim rasmi"
        initialUrl={item?.imageUrl}
        hint="Kvadrat formatda tavsiya etiladi"
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

function StaffCard({
  item,
  onEdit,
  isFirst,
  isLast,
}: {
  item: Staff;
  onEdit: () => void;
  isFirst: boolean;
  isLast: boolean;
}) {
  return (
    <article className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm">
      <div className="flex flex-col gap-4 p-5 sm:flex-row">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 to-sky-50">
          {item.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.imageUrl}
              alt={item.fullName}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center">
              <UserRound className="h-9 w-9 text-emerald-300" />
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700">
              {item.order}-o&apos;rin
            </span>
            <span className="rounded-full bg-sky-50 px-2.5 py-0.5 text-[11px] font-bold text-sky-700">
              {item.department}
            </span>
          </div>
          <h3 className="mt-2 text-base font-extrabold tracking-tight text-navy-900">
            {item.fullName}
          </h3>
          <p className="text-xs font-bold text-slate-500">{item.role}</p>
          {item.bio && (
            <p className="mt-2 text-sm font-medium leading-relaxed text-slate-500">
              {excerpt(item.bio, 160)}
            </p>
          )}
        </div>

        <div className="flex shrink-0 flex-row flex-wrap items-start gap-2 sm:flex-col">
          <div className="flex gap-1">
            <form action={moveStaff}>
              <input type="hidden" name="id" value={item.id} />
              <input type="hidden" name="dir" value="up" />
              <button
                type="submit"
                disabled={isFirst}
                title="Yuqoriga surish"
                aria-label="Yuqoriga surish"
                className={`${smallButtonClass} text-navy-700 hover:border-emerald-300 hover:text-emerald-600`}
              >
                <ChevronUp className="h-3.5 w-3.5" />
              </button>
            </form>
            <form action={moveStaff}>
              <input type="hidden" name="id" value={item.id} />
              <input type="hidden" name="dir" value="down" />
              <button
                type="submit"
                disabled={isLast}
                title="Pastga surish"
                aria-label="Pastga surish"
                className={`${smallButtonClass} text-navy-700 hover:border-emerald-300 hover:text-emerald-600`}
              >
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>
          <button
            type="button"
            onClick={onEdit}
            className={`${smallButtonClass} text-navy-700 hover:border-emerald-300 hover:text-emerald-600`}
          >
            <Pencil className="h-3.5 w-3.5" />
            Tahrirlash
          </button>
          <form
            action={deleteStaffItem}
            onSubmit={(event) => {
              if (
                !window.confirm(
                  `"${item.fullName}" xodimini o'chirishni tasdiqlaysizmi?`
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

export default function StaffManager({ items }: { items: Staff[] }) {
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const editing = items.find((item) => item.id === editingId) ?? null;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-extrabold tracking-tight text-navy-900">
          Rahbariyat ro&apos;yxati
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
          {creating ? "Yopish" : "Xodim qo'shish"}
        </button>
      </div>

      {creating && (
        <StaffForm
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
            Hozircha xodimlar yo&apos;q
          </p>
          <p className="max-w-sm text-xs font-semibold text-slate-500">
            Birinchi xodimni qo&apos;shish uchun tepadagi tugmani bosing.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={item.id}>
              {editingId === item.id ? (
                <StaffForm
                  item={item}
                  onDone={() => {
                    setEditingId(null);
                  }}
                />
              ) : (
                <StaffCard
                  item={item}
                  onEdit={() => setEditingId(item.id)}
                  isFirst={index === 0}
                  isLast={index === items.length - 1}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
