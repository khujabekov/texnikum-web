export type ActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

export const IDLE_STATE: ActionState = { status: "idle", message: "" };

export const SESSION_EXPIRED: ActionState = {
  status: "error",
  message: "Sessiya tugagan. Iltimos, tizimga qaytadan kiring.",
};

export const SAVE_FAILED: ActionState = {
  status: "error",
  message:
    "Saqlashda xatolik yuz berdi. Ma'lumotlarni tekshirib, qayta urinib ko'ring.",
};
