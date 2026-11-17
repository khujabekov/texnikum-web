import { Compass } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import DirectionCardGrid from "@/components/directions/DirectionCardGrid";
import type { DirectionItem } from "@/lib/dto";
import { getPublicDirections } from "@/lib/public-data";

export const metadata: Metadata = {
  title: "Ta'lim yo'nalishlari",
  description:
    "Texnikumdagi barcha ta'lim yo'nalishlari: o'quv rejasi, davomiyligi va ta'lim shakli haqida batafsil ma'lumot.",
};

export default async function YonalishlarPage() {
  const directions = await getPublicDirections();

  const items: DirectionItem[] = directions.map((direction) => ({
    id: direction.id,
    title: direction.title,
    slug: direction.slug,
    shortDesc: direction.shortDesc,
    duration: direction.duration,
    eduForm: direction.eduForm,
    imageUrl: direction.imageUrl,
  }));

  return (
    <>
      <PageHeader
        kicker="Ta'lim yo'nalishlari"
        title="Kelajak kasbingizni tanlang"
        description={`${items.length} ta zamonaviy ta'lim yo'nalishi — IT-dan qurilishgacha. O'zingizga mos kasbni tanlang va kelajagingizni bugundan boshlang.`}
        breadcrumb="Yo'nalishlar"
      />

      <section className="bg-white py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-500">
                <Compass className="h-7 w-7" />
              </span>
              <p className="text-sm font-semibold text-slate-500">
                Hozircha ta&rsquo;lim yo&rsquo;nalishlari qo&rsquo;shilmagan
              </p>
              <Link
                href="/aloqa"
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-6 py-3 text-sm font-bold text-navy-800 transition hover:border-emerald-400 hover:text-emerald-600"
              >
                Qabul haqida ma&rsquo;lumot olish
              </Link>
            </div>
          ) : (
            <DirectionCardGrid items={items} />
          )}
        </div>
      </section>
    </>
  );
}
