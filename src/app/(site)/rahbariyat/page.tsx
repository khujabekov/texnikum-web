import { Users } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import StaffGrid from "@/components/staff/StaffGrid";
import type { StaffItem } from "@/lib/dto";
import { initials } from "@/lib/format";
import { getPublicStaff } from "@/lib/public-data";

export const metadata: Metadata = {
  title: "Rahbariyat",
  description:
    "Texnikum rahbariyati, kafedra mudirlari va ustoz-murabbiylar jamoasi bilan tanishing.",
};

export default async function RahbariyatPage() {
  const staff = await getPublicStaff();

  const items: StaffItem[] = staff.map((person) => ({
    id: person.id,
    fullName: person.fullName,
    role: person.role,
    department: person.department,
    bio: person.bio,
    imageUrl: person.imageUrl,
    initials: initials(person.fullName),
  }));

  return (
    <>
      <PageHeader
        kicker="Rahbariyat va ustozlar"
        title="Tajribali mutaxassislar jamoasi"
        description="Yo'nalishlarimizni tajribali rahbarlar, o'qituvchilar va usta-murabbiylar boshqaradi."
        breadcrumb="Rahbariyat"
      />

      <section className="bg-white py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-500">
                <Users className="h-7 w-7" />
              </span>
              <p className="text-sm font-semibold text-slate-500">
                Hozircha xodimlar ro&rsquo;yxati qo&rsquo;shilmagan
              </p>
            </div>
          ) : (
            <StaffGrid items={items} />
          )}

          <div className="mt-12 text-center">
            <Link
              href="/aloqa"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-7 py-3.5 text-sm font-bold text-white shadow-xl shadow-emerald-500/30 transition duration-300 hover:shadow-emerald-400/40 hover:brightness-110"
            >
              Biz bilan bog&rsquo;lanish
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
