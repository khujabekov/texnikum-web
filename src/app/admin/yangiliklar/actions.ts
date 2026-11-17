"use server";

import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createNews, deleteNews, updateNews } from "@/lib/queries";
import { ensureUniqueSlug } from "@/lib/slug";
import { SAVE_FAILED, SESSION_EXPIRED, type ActionState } from "@/lib/action-state";

function error(message: string): ActionState {
  return { status: "error", message };
}

export async function createNewsItem(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await getAdminSession();
  if (!session) return SESSION_EXPIRED;

  const value = (key: string) => String(formData.get(key) ?? "").trim();
  const title = value("title");
  const category = value("category");
  const content = value("content");

  if (!title) return error("Sarlavha to'ldirilishi shart.");
  if (!category) return error("Kategoriya to'ldirilishi shart.");
  if (!content) return error("Yangilik matni to'ldirilishi shart.");

  try {
    const slug = await ensureUniqueSlug(title, async (candidate) => {
      const found = await prisma.news.findUnique({
        where: { slug: candidate },
        select: { id: true },
      });
      return found !== null;
    });

    await createNews({
      title,
      category,
      content,
      imageUrl: value("imageUrl"),
      published: formData.get("published") === "on",
      slug,
    });

    revalidatePath("/admin/yangiliklar");
    return { status: "success", message: "Yangilik qo'shildi." };
  } catch {
    return SAVE_FAILED;
  }
}

export async function updateNewsItem(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await getAdminSession();
  if (!session) return SESSION_EXPIRED;

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return error("Yangilik topilmadi.");

  const value = (key: string) => String(formData.get(key) ?? "").trim();
  const title = value("title");
  const category = value("category");
  const content = value("content");

  if (!title) return error("Sarlavha to'ldirilishi shart.");
  if (!category) return error("Kategoriya to'ldirilishi shart.");
  if (!content) return error("Yangilik matni to'ldirilishi shart.");

  try {
    await updateNews(id, {
      title,
      category,
      content,
      imageUrl: value("imageUrl"),
      published: formData.get("published") === "on",
    });

    revalidatePath("/admin/yangiliklar");
    return { status: "success", message: "O'zgarishlar saqlandi." };
  } catch {
    return SAVE_FAILED;
  }
}

export async function toggleNewsPublished(formData: FormData): Promise<void> {
  const session = await getAdminSession();
  if (!session) return;

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;

  try {
    const news = await prisma.news.findUnique({
      where: { id },
      select: { published: true },
    });
    if (!news) return;

    await updateNews(id, { published: !news.published });
    revalidatePath("/admin/yangiliklar");
  } catch {
    return;
  }
}

export async function deleteNewsItem(formData: FormData): Promise<void> {
  const session = await getAdminSession();
  if (!session) return;

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;

  try {
    await deleteNews(id);
    revalidatePath("/admin/yangiliklar");
  } catch {
    return;
  }
}
