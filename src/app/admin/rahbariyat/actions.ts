"use server";

import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createStaff, deleteStaff, updateStaff } from "@/lib/queries";
import { SAVE_FAILED, SESSION_EXPIRED, type ActionState } from "@/lib/action-state";

function error(message: string): ActionState {
  return { status: "error", message };
}

type StaffInput = {
  fullName: string;
  role: string;
  department: string;
  bio: string;
  imageUrl: string;
  order: number;
};

function readStaff(formData: FormData): StaffInput | null {
  const value = (key: string) => String(formData.get(key) ?? "").trim();
  const fullName = value("fullName");
  const role = value("role");
  const department = value("department");

  if (!fullName || !role || !department) return null;

  const rawOrder = Number(value("order"));
  return {
    fullName,
    role,
    department,
    bio: value("bio"),
    imageUrl: value("imageUrl"),
    order: Number.isFinite(rawOrder) ? Math.trunc(rawOrder) : 0,
  };
}

export async function createStaffItem(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await getAdminSession();
  if (!session) return SESSION_EXPIRED;

  const input = readStaff(formData);
  if (!input) {
    return error("F.I.Sh., lavozim va bo'lim to'ldirilishi shart.");
  }

  try {
    const last = await prisma.staff.findFirst({
      orderBy: { order: "desc" },
      select: { order: true },
    });

    await createStaff({
      ...input,
      order: input.order || (last ? last.order + 1 : 1),
    });

    revalidatePath("/admin/rahbariyat");
    return { status: "success", message: "Xodim qo'shildi." };
  } catch {
    return SAVE_FAILED;
  }
}

export async function updateStaffItem(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await getAdminSession();
  if (!session) return SESSION_EXPIRED;

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return error("Xodim topilmadi.");

  const input = readStaff(formData);
  if (!input) {
    return error("F.I.Sh., lavozim va bo'lim to'ldirilishi shart.");
  }

  try {
    await updateStaff(id, input);
    revalidatePath("/admin/rahbariyat");
    return { status: "success", message: "O'zgarishlar saqlandi." };
  } catch {
    return SAVE_FAILED;
  }
}

export async function moveStaff(formData: FormData): Promise<void> {
  const session = await getAdminSession();
  if (!session) return;

  const id = Number(formData.get("id"));
  const dir = String(formData.get("dir") ?? "");
  if (!Number.isInteger(id) || (dir !== "up" && dir !== "down")) return;

  try {
    const current = await prisma.staff.findUnique({
      where: { id },
      select: { id: true, order: true },
    });
    if (!current) return;

    const neighbor =
      dir === "up"
        ? await prisma.staff.findFirst({
            where: { order: { lt: current.order } },
            orderBy: { order: "desc" },
            select: { id: true, order: true },
          })
        : await prisma.staff.findFirst({
            where: { order: { gt: current.order } },
            orderBy: { order: "asc" },
            select: { id: true, order: true },
          });
    if (!neighbor) return;

    const currentOrder = current.order;
    await prisma.staff.update({ where: { id }, data: { order: -1 } });
    await prisma.staff.update({
      where: { id: neighbor.id },
      data: { order: currentOrder },
    });
    await prisma.staff.update({
      where: { id },
      data: { order: neighbor.order },
    });

    revalidatePath("/admin/rahbariyat");
  } catch {
    return;
  }
}

export async function deleteStaffItem(formData: FormData): Promise<void> {
  const session = await getAdminSession();
  if (!session) return;

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;

  try {
    await deleteStaff(id);
    revalidatePath("/admin/rahbariyat");
  } catch {
    return;
  }
}
