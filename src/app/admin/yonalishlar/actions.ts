"use server";

import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createDirection, deleteDirection, updateDirection } from "@/lib/queries";
import { ensureUniqueSlug } from "@/lib/slug";
import { SAVE_FAILED, SESSION_EXPIRED, type ActionState } from "@/lib/action-state";

function error(message: string): ActionState {
  return { status: "error", message };
}

type DirectionInput = {
  title: string;
  shortDesc: string;
  fullDesc: string;
  duration: string;
  eduForm: string;
  imageUrl: string;
  order: number;
};

function readDirection(formData: FormData): DirectionInput | null {
  const value = (key: string) => String(formData.get(key) ?? "").trim();
  const title = value("title");
  const shortDesc = value("shortDesc");
  const fullDesc = value("fullDesc");
  const duration = value("duration");
  const eduForm = value("eduForm");

  if (!title || !shortDesc || !fullDesc || !duration || !eduForm) {
    return null;
  }

  const rawOrder = Number(value("order"));
  return {
    title,
    shortDesc,
    fullDesc,
    duration,
    eduForm,
    imageUrl: value("imageUrl"),
    order: Number.isFinite(rawOrder) ? Math.trunc(rawOrder) : 0,
  };
}

export async function createDirectionItem(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await getAdminSession();
  if (!session) return SESSION_EXPIRED;

  const input = readDirection(formData);
  if (!input) {
    return error("Sarlavha, qisqa va to'liq tavsif, davomiylik va ta'lim shakli to'ldirilishi shart.");
  }

  try {
    const slug = await ensureUniqueSlug(input.title, async (candidate) => {
      const found = await prisma.direction.findUnique({
        where: { slug: candidate },
        select: { id: true },
      });
      return found !== null;
    });

    const last = await prisma.direction.findFirst({
      orderBy: { order: "desc" },
      select: { order: true },
    });

    await createDirection({
      ...input,
      order: input.order || (last ? last.order + 1 : 1),
      slug,
    });

    revalidatePath("/admin/yonalishlar");
    return { status: "success", message: "Yo'nalish qo'shildi." };
  } catch {
    return SAVE_FAILED;
  }
}

export async function updateDirectionItem(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await getAdminSession();
  if (!session) return SESSION_EXPIRED;

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return error("Yo'nalish topilmadi.");

  const input = readDirection(formData);
  if (!input) {
    return error("Sarlavha, qisqa va to'liq tavsif, davomiylik va ta'lim shakli to'ldirilishi shart.");
  }

  try {
    await updateDirection(id, input);
    revalidatePath("/admin/yonalishlar");
    return { status: "success", message: "O'zgarishlar saqlandi." };
  } catch {
    return SAVE_FAILED;
  }
}

export async function moveDirection(formData: FormData): Promise<void> {
  const session = await getAdminSession();
  if (!session) return;

  const id = Number(formData.get("id"));
  const dir = String(formData.get("dir") ?? "");
  if (!Number.isInteger(id) || (dir !== "up" && dir !== "down")) return;

  try {
    const current = await prisma.direction.findUnique({
      where: { id },
      select: { id: true, order: true },
    });
    if (!current) return;

    const neighbor =
      dir === "up"
        ? await prisma.direction.findFirst({
            where: { order: { lt: current.order } },
            orderBy: { order: "desc" },
            select: { id: true, order: true },
          })
        : await prisma.direction.findFirst({
            where: { order: { gt: current.order } },
            orderBy: { order: "asc" },
            select: { id: true, order: true },
          });
    if (!neighbor) return;

    const currentOrder = current.order;
    await prisma.direction.update({ where: { id }, data: { order: -1 } });
    await prisma.direction.update({
      where: { id: neighbor.id },
      data: { order: currentOrder },
    });
    await prisma.direction.update({
      where: { id },
      data: { order: neighbor.order },
    });

    revalidatePath("/admin/yonalishlar");
  } catch {
    return;
  }
}

export async function deleteDirectionItem(formData: FormData): Promise<void> {
  const session = await getAdminSession();
  if (!session) return;

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;

  try {
    await deleteDirection(id);
    revalidatePath("/admin/yonalishlar");
  } catch {
    return;
  }
}
