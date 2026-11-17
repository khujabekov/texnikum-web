import path from "node:path";
import { readFile } from "node:fs/promises";
import { NextResponse, type NextRequest } from "next/server";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

const MIME_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".pdf": "application/pdf",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;

  if (
    !filename ||
    filename.includes("/") ||
    filename.includes("\\") ||
    filename.includes("..")
  ) {
    return NextResponse.json({ error: "Noto'g'ri fayl nomi" }, { status: 400 });
  }

  const extension = path.extname(filename).toLowerCase();
  const contentType = MIME_TYPES[extension];
  if (!contentType) {
    return NextResponse.json(
      { error: "Bu turdagi fayl qo'llab-quvvatlanmaydi" },
      { status: 415 }
    );
  }

  const filePath = path.join(UPLOAD_DIR, filename);
  const resolved = path.resolve(filePath);
  if (!resolved.startsWith(path.resolve(UPLOAD_DIR) + path.sep)) {
    return NextResponse.json({ error: "Ruxsat berilmagan" }, { status: 403 });
  }

  let data: Buffer;
  try {
    data = await readFile(filePath);
  } catch {
    return NextResponse.json({ error: "Fayl topilmadi" }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(data), {
    headers: {
      "Content-Type": contentType,
      "Content-Length": String(data.length),
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Disposition": `inline; filename="${encodeURIComponent(filename)}"`,
    },
  });
}
