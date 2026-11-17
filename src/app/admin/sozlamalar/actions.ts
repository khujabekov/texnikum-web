"use server";

import { getAdminSession } from "@/lib/auth";
import { updateSiteConfig } from "@/lib/queries";

export type SettingsState = {
  status: "idle" | "success" | "error";
  message: string;
};

export async function updateSiteSettings(
  _prevState: SettingsState,
  formData: FormData
): Promise<SettingsState> {
  const session = await getAdminSession();
  if (!session) {
    return {
      status: "error",
      message: "Sessiya tugagan. Iltimos, tizimga qaytadan kiring.",
    };
  }

  const value = (key: string) => String(formData.get(key) ?? "").trim();
  const flag = (key: string) => formData.get(key) === "on";

  const collegeName = value("collegeName");
  const heroTitle = value("heroTitle");
  const heroSubtitle = value("heroSubtitle");
  const aboutTitle = value("aboutTitle");
  const aboutText = value("aboutText");

  if (!collegeName || !heroTitle || !heroSubtitle || !aboutTitle || !aboutText) {
    return {
      status: "error",
      message:
        "Muassasa nomi, asosiy va \"Biz haqimizda\" bo'limlarining sarlavhalari to'ldirilishi shart.",
    };
  }

  try {
    await updateSiteConfig({
      collegeName,
      slogan: value("slogan"),
      logoUrl: value("logoUrl"),
      heroTitle,
      heroSubtitle,
      heroImageUrl: value("heroImageUrl"),
      aboutTitle,
      aboutText,
      aboutImageUrl: value("aboutImageUrl"),
      stat1Label: value("stat1Label"),
      stat1Value: value("stat1Value"),
      stat2Label: value("stat2Label"),
      stat2Value: value("stat2Value"),
      stat3Label: value("stat3Label"),
      stat3Value: value("stat3Value"),
      stat4Label: value("stat4Label"),
      stat4Value: value("stat4Value"),
      address: value("address"),
      phones: value("phones"),
      email: value("email"),
      workHours: value("workHours"),
      telegramUrl: value("telegramUrl"),
      instagramUrl: value("instagramUrl"),
      youtubeUrl: value("youtubeUrl"),
      mapEmbedUrl: value("mapEmbedUrl"),
      footerText: value("footerText"),
      showStats: flag("showStats"),
      showDirections: flag("showDirections"),
      showNews: flag("showNews"),
      showStaff: flag("showStaff"),
      showGallery: flag("showGallery"),
    });

    return {
      status: "success",
      message: "Sozlamalar muvaffaqiyatli saqlandi.",
    };
  } catch {
    return {
      status: "error",
      message:
        "Saqlashda xatolik yuz berdi. Ma'lumotlarni tekshirib, qayta urinib ko'ring.",
    };
  }
}
