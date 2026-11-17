import {
  CalendarDays,
  Download,
  File,
  FileText,
  FileType,
  FolderOpen,
  Image as ImageIcon,
  Presentation,
  Sheet,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import type { ComponentType } from "react";
import PageHeader from "@/components/PageHeader";
import { formatDateUz } from "@/lib/format";
import { getPublicDocuments } from "@/lib/public-data";

export const metadata: Metadata = {
  title: "Hujjatlar",
  description:
    "Qabul qoidalari, o'quv rejalari, nizomlar va rasmiy hujjatlarni yuklab oling.",
};

type FileTypeInfo = {
  icon: ComponentType<{ className?: string }>;
  label: string;
  classes: string;
};

function fileTypeInfo(fileUrl: string): FileTypeInfo {
  const extension = fileUrl.match(/\.([a-zA-Z0-9]+)(?:[?#].*)?$/)?.[1]?.toLowerCase() ?? "";

  switch (extension) {
    case "pdf":
      return {
        icon: FileText,
        label: "PDF",
        classes: "bg-red-50 text-red-600 border-red-200",
      };
    case "doc":
    case "docx":
      return {
        icon: FileType,
        label: "DOCX",
        classes: "bg-sky-50 text-sky-600 border-sky-200",
      };
    case "xls":
    case "xlsx":
    case "csv":
      return {
        icon: Sheet,
        label: extension.toUpperCase(),
        classes: "bg-emerald-50 text-emerald-600 border-emerald-200",
      };
    case "ppt":
    case "pptx":
      return {
        icon: Presentation,
        label: extension.toUpperCase(),
        classes: "bg-amber-50 text-amber-600 border-amber-200",
      };
    case "jpg":
    case "jpeg":
    case "png":
    case "webp":
    case "gif":
      return {
        icon: ImageIcon,
        label: extension.toUpperCase(),
        classes: "bg-violet-50 text-violet-600 border-violet-200",
      };
    default:
      return {
        icon: File,
        label: extension ? extension.toUpperCase() : "FAYL",
        classes: "bg-slate-100 text-slate-600 border-slate-200",
      };
  }
}

export default async function HujjatlarPage() {
  const documents = await getPublicDocuments();

  const categories: string[] = [];
  for (const document of documents) {
    if (document.category && !categories.includes(document.category)) {
      categories.push(document.category);
    }
  }

  return (
    <>
      <PageHeader
        kicker="Rasmiy hujjatlar"
        title="Hujjatlar bazasi"
        description="Qabul qoidalari, o'quv rejalari, nizomlar va boshqa rasmiy hujjatlarni yuklab oling."
        breadcrumb="Hujjatlar"
      />

      <section className="bg-slate-50 py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {documents.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-500">
                <FolderOpen className="h-7 w-7" />
              </span>
              <p className="text-sm font-semibold text-slate-500">
                Hozircha hujjatlar qo&rsquo;shilmagan
              </p>
              <Link
                href="/aloqa"
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-6 py-3 text-sm font-bold text-navy-800 transition hover:border-emerald-400 hover:text-emerald-600"
              >
                Ma&rsquo;lumot uchun murojaat qiling
              </Link>
            </div>
          ) : (
            <div className="space-y-12">
              {categories.map((category) => {
                const categoryDocuments = documents.filter(
                  (document) => document.category === category
                );
                return (
                  <section key={category} aria-labelledby={`category-${category}`}>
                    <div className="flex items-center gap-4">
                      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-sky-500 text-white shadow-lg shadow-emerald-500/25">
                        <FolderOpen className="h-5 w-5" />
                      </span>
                      <div>
                        <h2
                          id={`category-${category}`}
                          className="text-xl font-extrabold tracking-tight text-navy-900 sm:text-2xl"
                        >
                          {category}
                        </h2>
                        <p className="text-xs font-semibold text-slate-500">
                          {categoryDocuments.length} ta hujjat
                        </p>
                      </div>
                    </div>

                    <ul className="mt-6 space-y-4">
                      {categoryDocuments.map((document) => {
                        const info = fileTypeInfo(document.fileUrl);
                        const Icon = info.icon;
                        return (
                          <li
                            key={document.id}
                            className="group flex flex-col gap-4 rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm transition duration-300 hover:border-emerald-300/60 hover:shadow-lg hover:shadow-emerald-500/10 sm:flex-row sm:items-center sm:gap-5 sm:p-6"
                          >
                            <span
                              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${info.classes}`}
                            >
                              <Icon className="h-6 w-6" />
                            </span>

                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2.5">
                                <h3 className="text-base font-bold text-navy-900 transition-colors group-hover:text-emerald-700">
                                  {document.title}
                                </h3>
                                <span
                                  className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold tracking-wide ${info.classes}`}
                                >
                                  {info.label}
                                </span>
                              </div>
                              {document.description && (
                                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                                  {document.description}
                                </p>
                              )}
                              <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                                <CalendarDays className="h-3.5 w-3.5" />
                                {formatDateUz(document.createdAt)}
                              </p>
                            </div>

                            <a
                              href={document.fileUrl}
                              download
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/25 transition duration-300 hover:shadow-emerald-400/40 hover:brightness-110"
                            >
                              <Download className="h-4 w-4" />
                              Yuklab olish
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  </section>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
