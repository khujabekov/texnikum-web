import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import type {
  Document,
  Direction,
  Gallery,
  News,
  SiteConfig,
  Staff,
} from "@/generated/prisma/client";
import type { SiteConfigUncheckedUpdateInput } from "@/generated/prisma/models/SiteConfig";
import type {
  DirectionCreateInput,
  DirectionUncheckedUpdateInput,
} from "@/generated/prisma/models/Direction";
import type {
  NewsCreateInput,
  NewsUncheckedUpdateInput,
} from "@/generated/prisma/models/News";
import type {
  StaffCreateInput,
  StaffUncheckedUpdateInput,
} from "@/generated/prisma/models/Staff";
import type {
  GalleryCreateInput,
  GalleryUncheckedUpdateInput,
} from "@/generated/prisma/models/Gallery";
import type { DocumentCreateInput } from "@/generated/prisma/models/Document";

function revalidateSite() {
  revalidatePath("/", "layout");
}

// ---------- SiteConfig ----------

export async function getSiteConfig(): Promise<SiteConfig | null> {
  return prisma.siteConfig.findUnique({ where: { id: 1 } });
}

export async function updateSiteConfig(
  data: SiteConfigUncheckedUpdateInput
): Promise<SiteConfig> {
  const config = await prisma.siteConfig.update({ where: { id: 1 }, data });
  revalidateSite();
  return config;
}

// ---------- Direction ----------

export async function getDirections(): Promise<Direction[]> {
  return prisma.direction.findMany({ orderBy: { order: "asc" } });
}

export async function getDirectionBySlug(
  slug: string
): Promise<Direction | null> {
  return prisma.direction.findUnique({ where: { slug } });
}

export async function createDirection(
  data: DirectionCreateInput
): Promise<Direction> {
  const direction = await prisma.direction.create({ data });
  revalidateSite();
  return direction;
}

export async function updateDirection(
  id: number,
  data: DirectionUncheckedUpdateInput
): Promise<Direction> {
  const direction = await prisma.direction.update({ where: { id }, data });
  revalidateSite();
  return direction;
}

export async function deleteDirection(id: number): Promise<Direction> {
  const direction = await prisma.direction.delete({ where: { id } });
  revalidateSite();
  return direction;
}

// ---------- News ----------

export async function getAllNews(): Promise<News[]> {
  return prisma.news.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getPublishedNews(): Promise<News[]> {
  return prisma.news.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getNewsBySlug(slug: string): Promise<News | null> {
  return prisma.news.findUnique({ where: { slug } });
}

export async function createNews(data: NewsCreateInput): Promise<News> {
  const news = await prisma.news.create({ data });
  revalidateSite();
  return news;
}

export async function updateNews(
  id: number,
  data: NewsUncheckedUpdateInput
): Promise<News> {
  const news = await prisma.news.update({ where: { id }, data });
  revalidateSite();
  return news;
}

export async function deleteNews(id: number): Promise<News> {
  const news = await prisma.news.delete({ where: { id } });
  revalidateSite();
  return news;
}

export async function incrementNewsViews(id: number): Promise<void> {
  await prisma.news.update({
    where: { id },
    data: { views: { increment: 1 } },
  });
}

// ---------- Staff ----------

export async function getStaff(): Promise<Staff[]> {
  return prisma.staff.findMany({ orderBy: { order: "asc" } });
}

export async function createStaff(data: StaffCreateInput): Promise<Staff> {
  const staff = await prisma.staff.create({ data });
  revalidateSite();
  return staff;
}

export async function updateStaff(
  id: number,
  data: StaffUncheckedUpdateInput
): Promise<Staff> {
  const staff = await prisma.staff.update({ where: { id }, data });
  revalidateSite();
  return staff;
}

export async function deleteStaff(id: number): Promise<Staff> {
  const staff = await prisma.staff.delete({ where: { id } });
  revalidateSite();
  return staff;
}

// ---------- Gallery ----------

export async function getGallery(): Promise<Gallery[]> {
  return prisma.gallery.findMany({ orderBy: { createdAt: "desc" } });
}

export async function createGallery(
  data: GalleryCreateInput
): Promise<Gallery> {
  const gallery = await prisma.gallery.create({ data });
  revalidateSite();
  return gallery;
}

export async function updateGallery(
  id: number,
  data: GalleryUncheckedUpdateInput
): Promise<Gallery> {
  const gallery = await prisma.gallery.update({ where: { id }, data });
  revalidateSite();
  return gallery;
}

export async function deleteGallery(id: number): Promise<Gallery> {
  const gallery = await prisma.gallery.delete({ where: { id } });
  revalidateSite();
  return gallery;
}

// ---------- Document ----------

export async function getDocuments(): Promise<Document[]> {
  return prisma.document.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getDocumentsByCategory(
  category: string
): Promise<Document[]> {
  return prisma.document.findMany({
    where: { category },
    orderBy: { createdAt: "desc" },
  });
}

export async function createDocument(
  data: DocumentCreateInput
): Promise<Document> {
  const document = await prisma.document.create({ data });
  revalidateSite();
  return document;
}

export async function deleteDocument(id: number): Promise<Document> {
  const document = await prisma.document.delete({ where: { id } });
  revalidateSite();
  return document;
}
