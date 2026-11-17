import Directions from "@/components/home/Directions";
import GalleryContact from "@/components/home/GalleryContact";
import Hero from "@/components/home/Hero";
import NewsSection from "@/components/home/News";
import StaffPreview from "@/components/home/StaffPreview";
import Stats from "@/components/home/Stats";
import type {
  ContactInfo,
  DirectionItem,
  GalleryPhoto,
  NewsItem,
  StaffItem,
  StatItem,
} from "@/lib/dto";
import { excerpt, formatDateUz, initials } from "@/lib/format";
import {
  getPublicDirections,
  getPublicGallery,
  getPublicPublishedNews,
  getPublicSiteConfig,
  getPublicStaff,
} from "@/lib/public-data";

export default async function Home() {
  const [config, directions, news, staff, gallery] = await Promise.all([
    getPublicSiteConfig(),
    getPublicDirections(),
    getPublicPublishedNews(),
    getPublicStaff(),
    getPublicGallery(),
  ]);

  const siteName = config?.collegeName ?? "Texnikum";

  const stats: StatItem[] = config
    ? (
        [
          [config.stat1Label, config.stat1Value],
          [config.stat2Label, config.stat2Value],
          [config.stat3Label, config.stat3Value],
          [config.stat4Label, config.stat4Value],
        ] as const
      )
          .map(([label, value]) => ({ label, value }))
          .filter((stat) => stat.label && stat.value)
    : [];

  const chips = [stats[0], stats[stats.length - 1]].filter(
    (stat): stat is StatItem => Boolean(stat)
  );

  const directionItems: DirectionItem[] = directions.map((direction) => ({
    id: direction.id,
    title: direction.title,
    slug: direction.slug,
    shortDesc: direction.shortDesc,
    duration: direction.duration,
    eduForm: direction.eduForm,
    imageUrl: direction.imageUrl,
  }));

  const newsItems: NewsItem[] = news.slice(0, 3).map((item) => ({
    id: item.id,
    slug: item.slug,
    title: item.title,
    category: item.category,
    imageUrl: item.imageUrl,
    excerpt: excerpt(item.content, 170),
    dateLabel: formatDateUz(item.createdAt),
    views: item.views,
  }));

  const staffItems: StaffItem[] = staff.slice(0, 4).map((person) => ({
    id: person.id,
    fullName: person.fullName,
    role: person.role,
    department: person.department,
    bio: person.bio,
    imageUrl: person.imageUrl,
    initials: initials(person.fullName),
  }));

  const galleryItems: GalleryPhoto[] = gallery.slice(0, 8).map((photo) => ({
    id: photo.id,
    title: photo.title,
    category: photo.category,
    imageUrl: photo.imageUrl,
  }));

  const contact: ContactInfo = {
    address: config?.address ?? "",
    phones: (config?.phones ?? "")
      .split(",")
      .map((phone) => phone.trim())
      .filter(Boolean),
    email: config?.email ?? "",
    workHours: config?.workHours ?? "",
    mapEmbedUrl: config?.mapEmbedUrl ?? "",
  };

  const showStats = config?.showStats !== false && stats.length > 0;
  const showDirections = config?.showDirections !== false && directionItems.length > 0;
  const showNews = config?.showNews !== false && newsItems.length > 0;
  const showStaff = config?.showStaff !== false && staffItems.length > 0;
  const showGallery = config?.showGallery !== false;

  const scrollTarget = showStats
    ? "stats"
    : showDirections
      ? "yonalishlar"
      : showNews
        ? "yangiliklar"
        : showStaff
          ? "rahbariyat"
          : showGallery
            ? "galereya"
            : "";

  return (
    <>
      <Hero
        badge={config?.slogan ?? ""}
        title={config?.heroTitle ?? `${siteName} — zamonaviy ta'lim maskani`}
        subtitle={config?.heroSubtitle ?? ""}
        imageUrl={config?.heroImageUrl ?? ""}
        imageAlt={siteName}
        chips={chips}
        marqueeItems={directions.map((direction) => direction.title)}
        scrollTarget={scrollTarget}
      />
      {showStats && <Stats stats={stats} />}
      {showDirections && <Directions items={directionItems} />}
      {showNews && <NewsSection items={newsItems} />}
      {showStaff && <StaffPreview items={staffItems} />}
      {showGallery && <GalleryContact items={galleryItems} contact={contact} />}
    </>
  );
}
