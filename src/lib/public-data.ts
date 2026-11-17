import { cacheLife } from "next/cache";
import {
  getDirectionBySlug,
  getDirections,
  getDocuments,
  getGallery,
  getNewsBySlug,
  getPublishedNews,
  getSiteConfig,
  getStaff,
} from "./queries";

export async function getPublicSiteConfig() {
  "use cache";
  cacheLife("max");
  return getSiteConfig();
}

export async function getPublicDirections() {
  "use cache";
  cacheLife("max");
  return getDirections();
}

export async function getPublicPublishedNews() {
  "use cache";
  cacheLife("max");
  return getPublishedNews();
}

export async function getPublicStaff() {
  "use cache";
  cacheLife("max");
  return getStaff();
}

export async function getPublicGallery() {
  "use cache";
  cacheLife("max");
  return getGallery();
}

export async function getPublicDocuments() {
  "use cache";
  cacheLife("max");
  return getDocuments();
}

export async function getPublicNewsBySlug(slug: string) {
  "use cache";
  cacheLife("max");
  return getNewsBySlug(slug);
}

export async function getPublicDirectionBySlug(slug: string) {
  "use cache";
  cacheLife("max");
  return getDirectionBySlug(slug);
}
