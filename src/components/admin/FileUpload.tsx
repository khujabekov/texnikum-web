"use client";

import { FileText, ImagePlus, Loader2, Trash2, UploadCloud } from "lucide-react";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from "react";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const IMAGE_EXTENSION_PATTERN = /\.(jpe?g|png|webp|gif)$/i;

function displayName(url: string): string {
  return decodeURIComponent(url.split("/").pop() ?? url);
}

type FileUploadProps = {
  name: string;
  label: string;
  initialUrl?: string | null;
  accept?: string;
  hint?: string;
};

export default function FileUpload({
  name,
  label,
  initialUrl = "",
  accept = "image/*",
  hint,
}: FileUploadProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState(initialUrl ?? "");
  const [preview, setPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const isDocumentAccept = !accept.includes("image");
  const fallbackHint = isDocumentAccept
    ? "PDF yoki DOCX — maksimal 10 MB"
    : "JPG, PNG, WebP yoki GIF — maksimal 10 MB";
  const resolvedHint = hint ?? fallbackHint;

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const upload = useCallback(async (file: File) => {
    setError("");
    if (file.size === 0) {
      setError("Bo'sh fayl yuklab bo'lmaydi");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError("Fayl hajmi 10 MB dan oshmasligi kerak");
      return;
    }

    if (file.type.startsWith("image/")) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
    } else {
      setPreview(null);
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data: { ok?: boolean; url?: string; error?: string } =
        await response.json().catch(() => ({}));
      if (!response.ok || !data.ok || !data.url) {
        throw new Error(data.error ?? "Fayl yuklashda xatolik yuz berdi");
      }
      setUrl(data.url);
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Fayl yuklashda xatolik yuz berdi"
      );
      setPreview(null);
    } finally {
      setUploading(false);
    }
  }, []);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      const file = files?.[0];
      if (file) void upload(file);
    },
    [upload]
  );

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleFiles(event.target.files);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    handleFiles(event.dataTransfer.files);
  };

  const handleRemove = () => {
    setUrl("");
    setPreview(null);
    setError("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const openPicker = () => {
    if (!uploading) inputRef.current?.click();
  };

  const isImage = preview !== null || IMAGE_EXTENSION_PATTERN.test(url);
  const hasFile = Boolean(preview || url);
  const shownImage = preview || (isImage ? url : null);
  const caption = uploading
    ? "Fayl yuklanmoqda..."
    : url
      ? displayName(url)
      : isDocumentAccept
        ? "Tanlangan hujjat"
        : "Tanlangan rasm";

  return (
    <div>
      <input type="hidden" name={name} value={url} />
      <span className="block text-xs font-bold uppercase tracking-wider text-slate-500">
        {label}
      </span>

      <div className="mt-2">
        {hasFile ? (
          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {shownImage ? (
              <div className="relative flex h-44 items-center justify-center bg-slate-100 sm:h-52">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={shownImage}
                  alt={`${label} oldindan ko'rish`}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            ) : (
              <div className="flex h-28 items-center justify-center gap-3 bg-slate-50 px-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-sky-500 text-white shadow-lg shadow-emerald-500/25">
                  <FileText className="h-5 w-5" />
                </span>
                <span className="min-w-0 truncate text-sm font-bold text-navy-900">
                  {caption}
                </span>
              </div>
            )}
            {uploading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-navy-950/60 text-white backdrop-blur-sm">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="text-xs font-bold">Yuklanmoqda...</span>
              </div>
            )}
            <div className="flex items-center justify-between gap-3 border-t border-slate-200 px-4 py-2.5">
              <span className="min-w-0 truncate text-xs font-semibold text-slate-500">
                {caption}
              </span>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={openPicker}
                  disabled={uploading}
                  className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold text-navy-700 transition hover:border-emerald-300 hover:text-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Almashtirish
                </button>
                <button
                  type="button"
                  onClick={handleRemove}
                  disabled={uploading}
                  className="flex items-center gap-1 rounded-xl border border-red-200 px-3 py-1.5 text-xs font-bold text-red-600 transition hover:border-red-300 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  O&apos;chirish
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div
            role="button"
            tabIndex={0}
            onClick={openPicker}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openPicker();
              }
            }}
            onDragOver={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            aria-disabled={uploading}
            className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-10 text-center transition duration-200 ${
              dragging
                ? "border-emerald-400 bg-emerald-50"
                : "border-slate-300 bg-white hover:border-emerald-300 hover:bg-emerald-50/40"
            }`}
          >
            <span
              className={`flex h-12 w-12 items-center justify-center rounded-2xl transition ${
                dragging
                  ? "bg-emerald-500 text-white"
                  : "bg-gradient-to-br from-emerald-400 to-sky-500 text-white shadow-lg shadow-emerald-500/25"
              }`}
            >
              {uploading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <UploadCloud className="h-5 w-5" />
              )}
            </span>
            <span className="text-sm font-bold text-navy-900">
              {dragging
                ? "Faylni qo'yib yuboring"
                : "Faylni bu yerga tashlang yoki tanlang"}
            </span>
            <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
              {isDocumentAccept ? (
                <FileText className="h-3.5 w-3.5" />
              ) : (
                <ImagePlus className="h-3.5 w-3.5" />
              )}
              {resolvedHint}
            </span>
          </div>
        )}

        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept={accept}
          onChange={handleChange}
          className="hidden"
          tabIndex={-1}
          aria-hidden
        />
      </div>

      {error && (
        <p role="alert" className="mt-2 text-xs font-bold text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
