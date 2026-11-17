import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const TOKEN_COOKIE_NAME = "admin_token";
const LOGIN_PATH = "/admin/login";
const ADMIN_PATH = "/admin";

async function isValidToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length === 0) return false;
  try {
    await jwtVerify(token, new TextEncoder().encode(secret));
    return true;
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const token = request.cookies.get(TOKEN_COOKIE_NAME)?.value;
  const authenticated = await isValidToken(token);

  if (pathname === LOGIN_PATH) {
    if (authenticated) {
      return NextResponse.redirect(new URL(ADMIN_PATH, request.url));
    }
    return NextResponse.next();
  }

  if (!authenticated) {
    const loginUrl = new URL(LOGIN_PATH, request.url);
    loginUrl.searchParams.set("from", pathname + search);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
