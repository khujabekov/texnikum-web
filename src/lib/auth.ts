import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";

export const TOKEN_COOKIE_NAME = "admin_token";
export const TOKEN_MAX_AGE = 60 * 60 * 24 * 7;

export type AdminSession = {
  sub: string;
  username: string;
};

function getSecretKey(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length === 0) {
    throw new Error("JWT_SECRET environment variable is not set");
  }
  return new TextEncoder().encode(secret);
}

export async function signAdminToken(
  adminId: number,
  username: string
): Promise<string> {
  return new SignJWT({ username })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(String(adminId))
    .setIssuedAt()
    .setExpirationTime(`${TOKEN_MAX_AGE}s`)
    .sign(getSecretKey());
}

export async function verifyAdminToken(
  token: string | null | undefined
): Promise<AdminSession | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    if (!payload.sub || typeof payload.username !== "string") return null;
    return { sub: payload.sub, username: payload.username };
  } catch {
    return null;
  }
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  return verifyAdminToken(cookieStore.get(TOKEN_COOKIE_NAME)?.value);
}

export async function requireAdminSession(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }
  return session;
}
