import type { Metadata } from "next";
import { Suspense } from "react";
import GalleryManager from "@/components/admin/gallery/GalleryManager";
import { requireAdminSession } from "@/lib/auth";
import { getGallery } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Galereya",
  robots: { index: false, follow: false },
};

function GridSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-11 w-56 animate-pulse rounded-2xl bg-slate-200" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-72 animate-pulse rounded-3xl border border-slate-200 bg-white"
          />
        ))}
      </div>
    </div>
  );
}

async function GalleryContent() {
  await requireAdminSession();
  const gallery = await getGallery();
  return <GalleryManager items={gallery} />;
}

export default function AdminGalleryPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">
          Boshqaruv
        </p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-navy-900 sm:text-3xl">
          Galereya
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">
          Galereya rasmlarini kategoriya bilan yuklash va boshqarish
          bo&apos;limi.
        </p>
      </div>

      <Suspense fallback={<GridSkeleton />}>
        <GalleryContent />
      </Suspense>
    </div>
  );
}
