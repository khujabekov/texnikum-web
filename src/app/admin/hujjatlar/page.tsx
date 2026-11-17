import type { Metadata } from "next";
import { Suspense } from "react";
import DocumentManager from "@/components/admin/documents/DocumentManager";
import { requireAdminSession } from "@/lib/auth";
import { getDocuments } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Hujjatlar",
  robots: { index: false, follow: false },
};

function ListSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-11 w-56 animate-pulse rounded-2xl bg-slate-200" />
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="h-28 animate-pulse rounded-3xl border border-slate-200 bg-white"
        />
      ))}
    </div>
  );
}

async function DocumentsContent() {
  await requireAdminSession();
  const documents = await getDocuments();
  return <DocumentManager items={documents} />;
}

export default function AdminDocumentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">
          Boshqaruv
        </p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-navy-900 sm:text-3xl">
          Hujjatlar
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">
          PDF va DOCX hujjatlarni sarlavha va kategoriya bilan yuklash va
          boshqarish bo&apos;limi.
        </p>
      </div>

      <Suspense fallback={<ListSkeleton />}>
        <DocumentsContent />
      </Suspense>
    </div>
  );
}
