import { Image as ImageIcon } from "lucide-react";
import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import GalleryBrowser from "@/components/gallery/GalleryBrowser";
import type { GalleryPhoto } from "@/lib/dto";
import { getPublicGallery } from "@/lib/public-data";

export const metadata: Metadata = {
  title: "Galereya",
  description:
    "Kampus binolari, laboratoriyalar, tadbirlar va talabalar hayotidan lavhalar.",
};

export default async function GalereyaPage() {
  const gallery = await getPublicGallery();

  const items: GalleryPhoto[] = gallery.map((photo) => ({
    id: photo.id,
    title: photo.title,
    category: photo.category,
    imageUrl: photo.imageUrl,
  }));

  return (
    <>
      <PageHeader
        kicker="Galereya"
        title="Kampus hayoti lavhalarda"
        description="Binolarimiz, laboratoriyalar, ustaxonalar, sport va madaniy tadbirlar — barchasi bir joyda."
        breadcrumb="Galereya"
      />

      <section className="bg-white py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-500">
                <ImageIcon className="h-7 w-7" />
              </span>
              <p className="text-sm font-semibold text-slate-500">
                Hozircha galereyaga rasmlar qo&rsquo;shilmagan
              </p>
            </div>
          ) : (
            <GalleryBrowser items={items} />
          )}
        </div>
      </section>
    </>
  );
}
