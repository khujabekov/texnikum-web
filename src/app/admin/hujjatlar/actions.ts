"use server";

import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/lib/auth";
import { createDocument, deleteDocument } from "@/lib/queries";
import { SAVE_FAILED, SESSION_EXPIRED, type ActionState } from "@/lib/action-state";

function error(message: string): ActionState {
  return { status: "error", message };
}

export async function createDocumentItem(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await getAdminSession();
  if (!session) return SESSION_EXPIRED;

  const value = (key: string) => String(formData.get(key) ?? "").trim();
  const title = value("title");
  const category = value("category");
  const fileUrl = value("fileUrl");

  if (!title) return error("Hujjat sarlavhasi to'ldirilishi shart.");
  if (!category) return error("Kategoriya to'ldirilishi shart.");
  if (!fileUrl) return error("Avval PDF yoki DOCX fayl yuklang.");

  try {
    await createDocument({
      title,
      category,
      description: value("description"),
      fileUrl,
    });
    revalidatePath("/admin/hujjatlar");
    return { status: "success", message: "Hujjat qo'shildi." };
  } catch {
    return SAVE_FAILED;
  }
}

export async function deleteDocumentItem(formData: FormData): Promise<void> {
  const session = await getAdminSession();
  if (!session) return;

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;

  try {
    await deleteDocument(id);
    revalidatePath("/admin/hujjatlar");
  } catch {
    return;
  }
}
