import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  ChevronRight,
  Clock,
  Home,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import SafeImage from "@/components/SafeImage";
import {
  getPublicDirectionBySlug,
  getPublicDirections,
} from "@/lib/public-data";

type DirectionPageParams = Promise<{ slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: DirectionPageParams;
}): Promise<Metadata> {
  const { slug } = await params;
  const direction = await getPublicDirectionBySlug(slug);

  if (!direction) {
    return { title: "Yo'nalish topilmadi" };
  }

  return {
    title: direction.title,
    description: direction.shortDesc,
    openGraph: {
      title: direction.title,
      description: direction.shortDesc,
      type: "website",
      locale: "uz_UZ",
      ...(direction.imageUrl ? { images: [direction.imageUrl] } : {}),
    },
  };
}

function DetailSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <div className="h-4 w-48 rounded-full bg-slate-200" />
        <div className="mt-10 grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="aspect-[4/3] rounded-3xl bg-slate-200" />
          <div className="space-y-5 py-2">
            <div className="h-9 w-full rounded-2xl bg-slate-200" />
            <div className="h-9 w-2/3 rounded-2xl bg-slate-200" />
            <div className="h-4 w-full rounded-full bg-slate-100" />
            <div className="h-4 w-5/6 rounded-full bg-slate-100" />
            <div className="h-28 w-full rounded-3xl bg-slate-100" />
          </div>
        </div>
      </div>
    </div>
  );
}

async function DirectionDetail({ params }: { params: DirectionPageParams }) {
  const { slug } = await params;
  const [direction, directions] = await Promise.all([
    getPublicDirectionBySlug(slug),
    getPublicDirections(),
  ]);

  if (!direction) {
    notFound();
  }

  const others = directions.filter((item) => item.slug !== direction.slug);

  return (
    <>
      <section className="bg-white py-8 sm:py-10 lg:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
            <Link
              href="/yonalishlar"
              className="transition hover:text-emerald-600"
            >
              Yo&rsquo;nalishlar
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" aria-hidden />
            <span className="text-navy-900">{direction.title}</span>
          </nav>

          <div className="mt-10 grid items-start gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
            <div className="group relative aspect-[4/3] overflow-hidden rounded-[2rem] border border-slate-200/80 shadow-xl shadow-navy-900/10">
              <SafeImage
                src={direction.imageUrl}
                alt={direction.title}
                fallback="icon"
                fallbackIcon="compass"
                sizes="(max-width: 1024px) 100vw, 55vw"
                priority
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-navy-950/60 via-transparent to-transparent"
                aria-hidden
              />
              <div className="absolute inset-x-5 bottom-5 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-navy-950/60 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
                  <Clock className="h-3.5 w-3.5 text-emerald-300" />
                  {direction.duration}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-navy-950/60 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
                  <BookOpen className="h-3.5 w-3.5 text-emerald-300" />
                  {direction.eduForm}
                </span>
              </div>
            </div>

            <div className="lg:pt-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Ta&rsquo;lim yo&rsquo;nalishi
              </span>
              <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-navy-900 sm:text-4xl">
                {direction.title}
              </h1>
              <p className="mt-4 text-base leading-relaxed text-slate-600">
                {direction.shortDesc}
              </p>

              <dl className="mt-8 grid gap-4 rounded-3xl border border-slate-200/80 bg-slate-50 p-6 sm:grid-cols-2">
                <div className="flex items-start gap-3.5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                    <Clock className="h-5 w-5" />
                  </span>
                  <div>
                    <dt className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Davomiyligi
                    </dt>
                    <dd className="mt-1 text-sm font-bold text-navy-900">
                      {direction.duration}
                    </dd>
                  </div>
                </div>
                <div className="flex items-start gap-3.5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sky-100 text-sky-600">
                    <BookOpen className="h-5 w-5" />
                  </span>
                  <div>
                    <dt className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Ta&rsquo;lim shakli
                    </dt>
                    <dd className="mt-1 text-sm font-bold text-navy-900">
                      {direction.eduForm}
                    </dd>
                  </div>
                </div>
              </dl>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/aloqa"
                  className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-7 py-3.5 text-sm font-bold text-white shadow-xl shadow-emerald-500/30 transition duration-300 hover:shadow-emerald-400/40 hover:brightness-110"
                >
                  Qabul haqida ma&rsquo;lumot
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/yonalishlar"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-7 py-3.5 text-sm font-bold text-navy-800 transition hover:border-emerald-400 hover:text-emerald-600"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Barcha yo&rsquo;nalishlar
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            O&rsquo;quv rejasi
          </span>
          <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-navy-900 sm:text-3xl">
            Yo&rsquo;nalish haqida batafsil
          </h2>
          <div className="mt-6 whitespace-pre-line text-[0.95rem] leading-relaxed text-slate-700 sm:text-base lg:text-lg">
            {direction.fullDesc}
          </div>
        </div>
      </section>

      {others.length > 0 && (
        <section className="bg-white py-12 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Boshqa yo&rsquo;nalishlar
                </span>
                <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-navy-900 sm:text-3xl">
                  Yo&rsquo;nalishlarimizni yarim tashlab qo&rsquo;ymang
                </h2>
              </div>
              <Link
                href="/yonalishlar"
                className="group hidden items-center gap-2 text-sm font-bold text-navy-700 transition hover:text-emerald-600 sm:inline-flex"
              >
                Barchasi
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {others.slice(0, 6).map((item) => (
                <Link
                  key={item.id}
                  href={`/yonalishlar/${item.slug}`}
                  className="group flex items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-300/60 hover:shadow-lg hover:shadow-emerald-500/10"
                >
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-bold text-navy-900 transition-colors group-hover:text-emerald-700">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-xs font-semibold text-slate-500">
                      {item.duration} · {item.eduForm}
                    </p>
                  </div>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition group-hover:border-emerald-300 group-hover:bg-emerald-50 group-hover:text-emerald-600">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

export default function YonalishPage(props: PageProps<"/yonalishlar/[slug]">) {
  return (
    <Suspense fallback={<DetailSkeleton />}>
      <DirectionDetail params={props.params} />
    </Suspense>
  );
}
