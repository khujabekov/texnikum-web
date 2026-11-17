import {
  ArrowLeft,
  CalendarDays,
  ChevronRight,
  Eye,
  Home,
  Newspaper,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import NewsGrid from "@/components/news/NewsGrid";
import SafeImage from "@/components/SafeImage";
import type { NewsItem } from "@/lib/dto";
import { excerpt, formatDateUz } from "@/lib/format";
import { getPublicNewsBySlug, getPublicPublishedNews } from "@/lib/public-data";
import { getNewsBySlug, incrementNewsViews } from "@/lib/queries";

type ArticleParams = Promise<{ slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: ArticleParams;
}): Promise<Metadata> {
  const { slug } = await params;
  const news = await getPublicNewsBySlug(slug);

  if (!news || !news.published) {
    return { title: "Yangilik topilmadi" };
  }

  return {
    title: news.title,
    description: excerpt(news.content, 160),
    openGraph: {
      title: news.title,
      description: excerpt(news.content, 160),
      type: "article",
      locale: "uz_UZ",
      ...(news.imageUrl ? { images: [news.imageUrl] } : {}),
    },
  };
}

function ArticleSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="mx-auto max-w-4xl px-4 pt-10 sm:px-6 lg:px-8">
        <div className="h-4 w-56 rounded-full bg-slate-200" />
        <div className="mt-8 flex gap-3">
          <div className="h-7 w-24 rounded-full bg-slate-200" />
          <div className="h-7 w-40 rounded-full bg-slate-100" />
        </div>
        <div className="mt-6 h-9 w-full rounded-2xl bg-slate-200" />
        <div className="mt-3 h-9 w-2/3 rounded-2xl bg-slate-200" />
        <div className="mt-10 aspect-[16/9] w-full rounded-3xl bg-slate-200" />
        <div className="mt-10 space-y-4">
          {Array.from({ length: 6 }, (_, index) => (
            <div
              key={index}
              className="h-4 rounded-full bg-slate-100"
              style={{ width: `${95 - index * 7}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

async function NewsArticle({ params }: { params: ArticleParams }) {
  const { slug } = await params;
  const article = await getNewsBySlug(slug);

  if (!article || !article.published) {
    notFound();
  }

  await incrementNewsViews(article.id);
  const views = article.views + 1;

  const relatedNews = await getPublicPublishedNews();
  const related: NewsItem[] = relatedNews
    .filter((item) => item.slug !== article.slug)
    .sort((a, b) => {
      const sameCategory =
        Number(b.category === article.category) -
        Number(a.category === article.category);
      return sameCategory !== 0 ? sameCategory : b.createdAt.getTime() - a.createdAt.getTime();
    })
    .slice(0, 3)
    .map((item) => ({
      id: item.id,
      slug: item.slug,
      title: item.title,
      category: item.category,
      imageUrl: item.imageUrl,
      excerpt: excerpt(item.content, 130),
      dateLabel: formatDateUz(item.createdAt),
      views: item.views,
    }));

  const paragraphs = article.content
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <>
      <section className="bg-white pb-16 pt-8 sm:pt-10 lg:pb-20 lg:pt-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <nav
            aria-label="Sayt xaritasi"
            className="flex flex-wrap items-center gap-1.5 text-xs font-semibold text-slate-500 sm:text-sm"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 transition hover:text-emerald-600"
            >
              <Home className="h-3.5 w-3.5" />
              Bosh sahifa
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" aria-hidden />
            <Link href="/yangiliklar" className="transition hover:text-emerald-600">
              Yangiliklar
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" aria-hidden />
            <span className="text-navy-900">{article.category}</span>
          </nav>

          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-semibold text-slate-500 sm:text-sm">
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 font-bold text-emerald-700">
              {article.category}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4 text-emerald-500" />
              {formatDateUz(article.createdAt)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Eye className="h-4 w-4 text-sky-500" />
              {views} marta o&rsquo;qilgan
            </span>
          </div>

          <h1 className="mt-5 text-2xl font-extrabold leading-tight tracking-tight text-navy-900 sm:text-3xl lg:text-4xl">
            {article.title}
          </h1>

          {article.imageUrl && (
            <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-3xl border border-slate-200/80 shadow-xl shadow-navy-900/10 sm:aspect-[21/9]">
              <SafeImage
                src={article.imageUrl}
                alt={article.title}
                fallback="icon"
                fallbackIcon={Newspaper}
                sizes="(max-width: 896px) 100vw, 896px"
                priority
              />
            </div>
          )}

          <div className="mt-10 space-y-6 text-[0.95rem] leading-relaxed text-slate-700 sm:text-base lg:text-lg">
            {paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-8">
            <Link
              href="/yangiliklar"
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-6 py-3 text-sm font-bold text-navy-800 transition hover:border-emerald-400 hover:text-emerald-600"
            >
              <ArrowLeft className="h-4 w-4" />
              Barcha yangiliklar
            </Link>
            <Link
              href="/aloqa"
              className="inline-flex items-center gap-2 text-sm font-bold text-navy-700 transition hover:text-emerald-600"
            >
              Qabul haqida ma&rsquo;lumot
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="bg-slate-50 py-14 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  O&rsquo;xshash yangiliklar
                </span>
                <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-navy-900 sm:text-3xl">
                  Yana o&rsquo;qishga tavsiya etamiz
                </h2>
              </div>
            </div>
            <div className="mt-10">
              <NewsGrid items={related} />
            </div>
          </div>
        </section>
      )}
    </>
  );
}

export default function YangilikPage(props: PageProps<"/yangiliklar/[slug]">) {
  return (
    <Suspense fallback={<ArticleSkeleton />}>
      <NewsArticle params={props.params} />
    </Suspense>
  );
}
