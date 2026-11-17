"use server";

import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/lib/auth";
import { createGallery, deleteGallery } from "@/lib/queries";
import { SAVE_FAILED, SESSION_EXPIRED, type ActionState } from "@/lib/action-state";

function error(message: string): ActionState {
  return { status: "error", message };
}

export async function createGalleryItem(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await getAdminSession();
  if (!session) return SESSION_EXPIRED;

  const value = (key: string) => String(formData.get(key) ?? "").trim();
  const title = value("title");
  const category = value("category");
  const imageUrl = value("imageUrl");

  if (!title) return error("Rasm sarlavhasi to'ldirilishi shart.");
  if (!category) return error("Kategoriya to'ldirilishi shart.");
  if (!imageUrl) return error("Avval rasm yuklang.");

  try {
    await createGallery({ title, category, imageUrl });
    revalidatePath("/admin/galereya");
    return { status: "success", message: "Rasm galereyaga qo'shildi." };
  } catch {
    return SAVE_FAILED;
  }
}

export async function deleteGalleryItem(formData: FormData): Promise<void> {
  const session = await getAdminSession();
  if (!session) return;

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;

  try {
    await deleteGallery(id);
    revalidatePath("/admin/galereya");
  } catch {
    return;
  }
}
