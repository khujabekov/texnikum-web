import path from "node:path";
import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { NextResponse, type NextRequest } from "next/server";
import { TOKEN_COOKIE_NAME, verifyAdminToken } from "@/lib/auth";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "application/pdf": ".pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    ".docx",
};

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

export async function POST(request: NextRequest) {
  const token = request.cookies.get(TOKEN_COOKIE_NAME)?.value;
  const session = await verifyAdminToken(token);
  if (!session) {
    return NextResponse.json({ error: "Ruxsat berilmagan" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Fayl yuborilmadi yoki format noto'g'ri" },
      { status: 400 }
    );
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Fayl topilmadi" }, { status: 400 });
  }

  const extension = ALLOWED_TYPES[file.type];
  if (!extension) {
    return NextResponse.json(
      {
        error:
          "Faqat rasm (JPG, PNG, WebP, GIF), PDF yoki DOCX fayllar qabul qilinadi",
      },
      { status: 415 }
    );
  }

  if (file.size === 0) {
    return NextResponse.json({ error: "Bo'sh fayl" }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: "Fayl hajmi 10 MB dan oshmasligi kerak" },
      { status: 413 }
    );
  }

  const filename = `${Date.now()}-${randomUUID().slice(0, 8)}${extension}`;
  const filePath = path.join(UPLOAD_DIR, filename);

  await mkdir(UPLOAD_DIR, { recursive: true });
  const bytes = new Uint8Array(await file.arrayBuffer());
  await writeFile(filePath, bytes);

  return NextResponse.json({
    ok: true,
    filename,
    url: `/api/uploads/${filename}`,
    size: file.size,
    type: file.type,
  });
}
