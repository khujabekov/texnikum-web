import { NextResponse, type NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import {
  TOKEN_COOKIE_NAME,
  TOKEN_MAX_AGE,
  signAdminToken,
} from "@/lib/auth";

export async function POST(request: NextRequest) {
  let body: { username?: unknown; password?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Noto'g'ri so'rov formati" },
      { status: 400 }
    );
  }

  const username = typeof body.username === "string" ? body.username.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!username || !password) {
    return NextResponse.json(
      { error: "Login va parol kiritilishi shart" },
      { status: 400 }
    );
  }

  const admin = await prisma.admin.findUnique({ where: { username } });
  if (!admin || !(await bcrypt.compare(password, admin.passwordHash))) {
    return NextResponse.json(
      { error: "Login yoki parol xato" },
      { status: 401 }
    );
  }

  const token = await signAdminToken(admin.id, admin.username);

  const response = NextResponse.json({ ok: true, username: admin.username });
  response.cookies.set(TOKEN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: TOKEN_MAX_AGE,
  });
  return response;
}
