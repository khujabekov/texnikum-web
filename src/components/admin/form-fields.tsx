"use client";

import { AlertCircle, CheckCircle2 } from "lucide-react";
import { useId } from "react";
import type { ActionState } from "@/lib/action-state";

export const inputClass =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-navy-900 placeholder:font-medium placeholder:text-slate-400 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20";

type FieldProps = {
  label: string;
  name: string;
  defaultValue?: string | number;
  placeholder?: string;
  required?: boolean;
  type?: string;
  hint?: string;
  suggestions?: string[];
};

export function Field({
  label,
  name,
  defaultValue = "",
  placeholder,
  required,
  type = "text",
  hint,
  suggestions,
}: FieldProps) {
  const listId = useId();
  return (
    <div>
      <label
        htmlFor={`${name}-${listId}`}
        className="block text-xs font-bold uppercase tracking-wider text-slate-500"
      >
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      <input
        id={`${name}-${listId}`}
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        placeholder={placeholder}
        list={suggestions ? listId : undefined}
        className={`mt-2 ${inputClass}`}
      />
      {suggestions && (
        <datalist id={listId}>
          {suggestions.map((suggestion) => (
            <option key={suggestion} value={suggestion} />
          ))}
        </datalist>
      )}
      {hint && (
        <p className="mt-1.5 text-xs font-medium text-slate-400">{hint}</p>
      )}
    </div>
  );
}

export function TextareaField({
  label,
  name,
  defaultValue = "",
  placeholder,
  required,
  rows = 4,
  hint,
}: FieldProps & { rows?: number }) {
  const id = useId();
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-xs font-bold uppercase tracking-wider text-slate-500"
      >
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      <textarea
        id={id}
        name={name}
        rows={rows}
        required={required}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className={`mt-2 resize-y ${inputClass}`}
      />
      {hint && (
        <p className="mt-1.5 text-xs font-medium text-slate-400">{hint}</p>
      )}
    </div>
  );
}

export function ToggleRow({
  label,
  description,
  name,
  defaultChecked,
}: {
  label: string;
  description: string;
  name: string;
  defaultChecked: boolean;
}) {
  const id = useId();
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-3.5 transition hover:border-emerald-300/60"
    >
      <span className="min-w-0">
        <span className="block text-sm font-bold text-navy-900">{label}</span>
        <span className="mt-0.5 block text-xs font-medium text-slate-500">
          {description}
        </span>
      </span>
      <span className="relative inline-flex shrink-0">
        <input
          id={id}
          name={name}
          type="checkbox"
          defaultChecked={defaultChecked}
          className="peer sr-only"
        />
        <span className="h-6 w-11 rounded-full bg-slate-300 transition-colors duration-200 peer-checked:bg-emerald-500 peer-focus-visible:ring-2 peer-focus-visible:ring-emerald-400/40" />
        <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 peer-checked:translate-x-5" />
      </span>
    </label>
  );
}

export function StatusBanner({ state }: { state: ActionState }) {
  if (state.status === "idle" || !state.message) return null;
  return (
    <div
      role="status"
      className={`flex items-start gap-2.5 rounded-2xl border px-4 py-3.5 text-sm font-bold ${
        state.status === "success"
          ? "border-emerald-300/60 bg-emerald-50 text-emerald-700"
          : "border-red-300/60 bg-red-50 text-red-700"
      }`}
    >
      {state.status === "success" ? (
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
      ) : (
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
      )}
      <span>{state.message}</span>
    </div>
  );
}

export function SubmitButton({
  pending,
  label,
  pendingLabel,
}: {
  pending: boolean;
  label: string;
  pendingLabel: string;
}) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-sky-500 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/30 transition duration-300 hover:shadow-emerald-400/40 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          {pendingLabel}
        </>
      ) : (
        label
      )}
    </button>
  );
}
