import { NextResponse } from "next/server";
import { COOKIE_NAME } from "@/lib/auth";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (
    pathname === "/" ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/google/callback") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const cookie = request.cookies.get(COOKIE_NAME);

  if (!cookie || cookie.value !== "valid") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
