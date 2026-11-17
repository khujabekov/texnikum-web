import { ArrowLeft, ChevronLeft, ChevronRight, Newspaper } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import NewsGrid from "@/components/news/NewsGrid";
import type { NewsItem } from "@/lib/dto";
import { excerpt, formatDateUz } from "@/lib/format";
import { getPublicPublishedNews } from "@/lib/public-data";

export const metadata: Metadata = {
  title: "Yangiliklar",
  description:
    "Texnikum hayotidagi eng dolzarb yangiliklar, e'lonlar, tadbirlar va rasmiy ma'lumotlar.",
};

const PAGE_SIZE = 9;

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function buildHref(category: string, page: number): string {
  const params = new URLSearchParams();
  if (category) params.set("kategoriya", category);
  if (page > 1) params.set("sahifa", String(page));
  const qs = params.toString();
  return qs ? `/yangiliklar?${qs}` : "/yangiliklar";
}

function parsePage(value: string | string[] | undefined): number {
  const raw = Array.isArray(value) ? value[0] : value;
  const parsed = Number.parseInt(raw ?? "1", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

function parseCategory(value: string | string[] | undefined): string {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw?.trim() ?? "";
}

function pageList(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set<number>([1, total, current - 1, current, current + 1]);
  const sorted = [...pages]
    .filter((page) => page >= 1 && page <= total)
    .sort((a, b) => a - b);
  const result: (number | "…")[] = [];
  let previous = 0;
  for (const page of sorted) {
    if (page - previous > 1) result.push("…");
    result.push(page);
    previous = page;
  }
  return result;
}

function NewsSkeleton() {
  return (
    <div className="grid animate-pulse gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }, (_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white"
        >
          <div className="aspect-[16/10] bg-slate-200" />
          <div className="space-y-3 p-6">
            <div className="h-4 w-24 rounded-full bg-slate-200" />
            <div className="h-5 w-full rounded-full bg-slate-200" />
            <div className="h-5 w-2/3 rounded-full bg-slate-200" />
            <div className="h-3 w-full rounded-full bg-slate-100" />
            <div className="h-3 w-4/5 rounded-full bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

async function NewsList({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const category = parseCategory(params.kategoriya);
  const requestedPage = parsePage(params.sahifa);

  const allNews = await getPublicPublishedNews();

  const categories = [
    ...new Set(allNews.map((item) => item.category).filter(Boolean)),
  ];
  const filtered = category
    ? allNews.filter((item) => item.category === category)
    : allNews;

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const page = Math.min(requestedPage, totalPages);
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const items: NewsItem[] = pageItems.map((item) => ({
    id: item.id,
    slug: item.slug,
    title: item.title,
    category: item.category,
    imageUrl: item.imageUrl,
    excerpt: excerpt(item.content, 160),
    dateLabel: formatDateUz(item.createdAt),
    views: item.views,
  }));

  return (
    <div>
      <div
        role="tablist"
        aria-label="Yangiliklar kategoriyalari"
        className="-mx-4 flex snap-x gap-2.5 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0"
      >
        {[{ value: "", label: "Barchasi" }, ...categories.map((value) => ({ value, label: value }))].map(
          (tab) => {
            const isActive = category === tab.value;
            const count = tab.value
              ? allNews.filter((item) => item.category === tab.value).length
              : allNews.length;
            return (
              <Link
                key={tab.value || "__all__"}
                href={buildHref(tab.value, 1)}
                role="tab"
                aria-selected={isActive}
                className={`shrink-0 snap-start rounded-full border px-5 py-2.5 text-sm font-bold transition duration-300 ${
                  isActive
                    ? "border-transparent bg-gradient-to-r from-emerald-500 to-sky-500 text-white shadow-lg shadow-emerald-500/25"
                    : "border-slate-300 bg-white text-navy-800 hover:border-emerald-400 hover:text-emerald-600"
                }`}
              >
                {tab.label}
                <span
                  className={`ml-2 text-xs font-semibold ${
                    isActive ? "text-emerald-100" : "text-slate-400"
                  }`}
                >
                  {count}
                </span>
              </Link>
            );
          }
        )}
      </div>

      {items.length === 0 ? (
        <div className="mt-12 flex flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-500">
            <Newspaper className="h-7 w-7" />
          </span>
          <p className="text-sm font-semibold text-slate-500">
            {category
              ? "Bu kategoriyada hozircha yangiliklar yo'q"
              : "Hozircha yangiliklar yo'q"}
          </p>
          {category && (
            <Link
              href="/yangiliklar"
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-6 py-3 text-sm font-bold text-navy-800 transition hover:border-emerald-400 hover:text-emerald-600"
            >
              Barcha yangiliklar
            </Link>
          )}
        </div>
      ) : (
        <>
          <p className="mt-6 text-xs font-semibold text-slate-500">
            Jami {filtered.length} ta yangilik, {page}/{totalPages} sahifa
          </p>
          <div className="mt-6">
            <NewsGrid items={items} />
          </div>

          {totalPages > 1 && (
            <nav
              aria-label="Sahifalar navigatsiyasi"
              className="mt-12 flex flex-wrap items-center justify-center gap-2"
            >
              {page > 1 && (
                <Link
                  href={buildHref(category, page - 1)}
                  rel="prev"
                  className="inline-flex h-11 items-center gap-1.5 rounded-full border border-slate-300 bg-white px-4 text-sm font-bold text-navy-800 transition hover:border-emerald-400 hover:text-emerald-600"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Oldingi
                </Link>
              )}
              <div className="flex items-center gap-1.5">
                {pageList(page, totalPages).map((entry, index) =>
                  entry === "…" ? (
                    <span
                      key={`ellipsis-${index}`}
                      className="flex h-11 w-9 items-center justify-center text-sm font-bold text-slate-400"
                    >
                      …
                    </span>
                  ) : (
                    <Link
                      key={entry}
                      href={buildHref(category, entry)}
                      aria-current={entry === page ? "page" : undefined}
                      className={`flex h-11 w-11 items-center justify-center rounded-full border text-sm font-bold transition ${
                        entry === page
                          ? "border-transparent bg-gradient-to-r from-emerald-500 to-sky-500 text-white shadow-lg shadow-emerald-500/25"
                          : "border-slate-300 bg-white text-navy-800 hover:border-emerald-400 hover:text-emerald-600"
                      }`}
                    >
                      {entry}
                    </Link>
                  )
                )}
              </div>
              {page < totalPages && (
                <Link
                  href={buildHref(category, page + 1)}
                  rel="next"
                  className="inline-flex h-11 items-center gap-1.5 rounded-full border border-slate-300 bg-white px-4 text-sm font-bold text-navy-800 transition hover:border-emerald-400 hover:text-emerald-600"
                >
                  Keyingi
                  <ChevronRight className="h-4 w-4" />
                </Link>
              )}
            </nav>
          )}
        </>
      )}
    </div>
  );
}

export default function YangiliklarPage(props: PageProps<"/yangiliklar">) {
  return (
    <>
      <PageHeader
        kicker="Matbuot xizmati"
        title="Yangiliklar va e'lonlar"
        description="Texnikum hayotidagi eng dolzarb yangiliklar, tadbirlar va rasmiy e'lonlar — bir joyda."
        breadcrumb="Yangiliklar"
      />
      <section className="bg-slate-50 py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Suspense fallback={<NewsSkeleton />}>
            <NewsList searchParams={props.searchParams} />
          </Suspense>
          <div className="mt-12 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-bold text-navy-700 transition hover:text-emerald-600"
            >
              <ArrowLeft className="h-4 w-4" />
              Bosh sahifaga qaytish
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
