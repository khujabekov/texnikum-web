import type { Metadata } from "next";
import { Suspense } from "react";
import StaffManager from "@/components/admin/staff/StaffManager";
import { requireAdminSession } from "@/lib/auth";
import { getStaff } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Rahbariyat",
  robots: { index: false, follow: false },
};

function ListSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-11 w-56 animate-pulse rounded-2xl bg-slate-200" />
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="h-36 animate-pulse rounded-3xl border border-slate-200 bg-white"
        />
      ))}
    </div>
  );
}

async function StaffContent() {
  await requireAdminSession();
  const staff = await getStaff();
  return <StaffManager items={staff} />;
}

export default function AdminStaffPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">
          Boshqaruv
        </p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-navy-900 sm:text-3xl">
          Rahbariyat
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">
          Rahbariyat a&apos;zolari va xodimlar ma&apos;lumotlarini
          boshqarish bo&apos;limi.
        </p>
      </div>

      <Suspense fallback={<ListSkeleton />}>
        <StaffContent />
      </Suspense>
    </div>
  );
}
