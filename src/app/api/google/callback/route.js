import { NextResponse } from "next/server";
import { buildTokenCookie } from "@/lib/google";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const quizId = searchParams.get("state") || "";

  const returnPath = quizId ? `/dashboard/${quizId}` : "/dashboard";

  if (error || !code) {
    return NextResponse.redirect(
      new URL(`${returnPath}?error=google_auth_failed`, request.url)
    );
  }

  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenRes.ok) {
      return NextResponse.redirect(
        new URL(`${returnPath}?error=token_exchange_failed`, request.url)
      );
    }

    const tokenData = await tokenRes.json();

    const tokens = {
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      expires_at: Date.now() + tokenData.expires_in * 1000,
    };

    const response = NextResponse.redirect(
      new URL(`${returnPath}?google=connected`, request.url)
    );
    const cookie = buildTokenCookie(tokens);
    response.cookies.set(cookie.name, cookie.value, {
      httpOnly: cookie.httpOnly,
      secure: cookie.secure,
      sameSite: cookie.sameSite,
      maxAge: cookie.maxAge,
      path: cookie.path,
    });

    return response;
  } catch {
    return NextResponse.redirect(
      new URL(`${returnPath}?error=google_auth_failed`, request.url)
    );
  }
}
