import type { Metadata } from "next";
import { Suspense } from "react";
import SiteSettingsForm from "@/components/admin/SiteSettingsForm";
import { requireAdminSession } from "@/lib/auth";
import { getSiteConfig } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Sayt sozlamalari",
  robots: { index: false, follow: false },
};

function SettingsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-9 w-56 animate-pulse rounded-2xl bg-slate-200" />
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="h-44 animate-pulse rounded-3xl border border-slate-200 bg-white"
        />
      ))}
    </div>
  );
}

async function SettingsContent() {
  await requireAdminSession();
  const config = await getSiteConfig();

  if (!config) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
        <p className="text-sm font-bold text-slate-500">
          Sayt sozlamalari topilmadi. Ma&apos;lumotlar bazasini tekshiring.
        </p>
      </div>
    );
  }

  return <SiteSettingsForm config={config} />;
}

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">
          Sozlamalar
        </p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-navy-900 sm:text-3xl">
          Sayt sozlamalari
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">
          Sayt matnlari, rasmlari, aloqa ma&apos;lumotlari va bo&apos;limlar
          ko&apos;rinishini shu sahifadan boshqaring.
        </p>
      </div>

      <Suspense fallback={<SettingsSkeleton />}>
        <SettingsContent />
      </Suspense>
    </div>
  );
}
