import { NextResponse } from "next/server";
import { validateKey, COOKIE_NAME, COOKIE_MAX_AGE } from "@/lib/auth";

export async function POST(request) {
  const { key } = await request.json();

  if (!key || !validateKey(key)) {
    return NextResponse.json(
      { success: false, error: "Invalid access key" },
      { status: 401 }
    );
  }

  const response = NextResponse.json({ success: true });

  response.cookies.set(COOKIE_NAME, "valid", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });

  return response;
}
