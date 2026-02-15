export const COOKIE_NAME = "qf_access";
export const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days in seconds

export function validateKey(key) {
  const raw = process.env.ACCESS_KEYS || "";
  const keys = raw
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);
  return keys.includes(key);
}
