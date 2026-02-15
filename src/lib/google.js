import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

const ALGORITHM = "aes-256-gcm";
const COOKIE_NAME = "qf_google_tokens";

function getKey() {
  const secret = process.env.COOKIE_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("COOKIE_SECRET must be at least 32 characters");
  }
  return Buffer.from(secret.slice(0, 32), "utf-8");
}

export function encryptTokens(tokens) {
  const key = getKey();
  const iv = randomBytes(12);
  const cipher = createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(JSON.stringify(tokens), "utf-8", "hex");
  encrypted += cipher.final("hex");
  const tag = cipher.getAuthTag().toString("hex");

  return `${iv.toString("hex")}:${tag}:${encrypted}`;
}

export function decryptTokens(value) {
  const key = getKey();
  const [ivHex, tagHex, encrypted] = value.split(":");

  const decipher = createDecipheriv(
    ALGORITHM,
    key,
    Buffer.from(ivHex, "hex")
  );
  decipher.setAuthTag(Buffer.from(tagHex, "hex"));

  let decrypted = decipher.update(encrypted, "hex", "utf-8");
  decrypted += decipher.final("utf-8");

  return JSON.parse(decrypted);
}

export function getTokensFromCookies(cookieStore) {
  const cookie = cookieStore.get(COOKIE_NAME);
  if (!cookie?.value) return null;

  try {
    return decryptTokens(cookie.value);
  } catch {
    return null;
  }
}

export function buildTokenCookie(tokens) {
  return {
    name: COOKIE_NAME,
    value: encryptTokens(tokens),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  };
}

export async function refreshAccessToken(refreshToken) {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to refresh Google token");
  }

  const data = await res.json();
  return {
    access_token: data.access_token,
    refresh_token: refreshToken,
    expires_at: Date.now() + data.expires_in * 1000,
  };
}

export { COOKIE_NAME };
