import { createHash, createHmac, timingSafeEqual } from "node:crypto";

export const SESSION_COOKIE = "nuvana_admin";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

function secret(): string | null {
  const s = process.env.AUTH_SECRET;
  return s && s.length >= 32 ? s : null;
}

export const authConfigured = () => Boolean(secret() && process.env.ADMIN_PASSWORD);

function sign(payload: string, key: string) {
  return createHmac("sha256", key).update(payload).digest("base64url");
}

function safeEqual(a: string, b: string) {
  // Hash first so inputs of different length still compare in constant time.
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

export function createSessionToken(): string | null {
  const key = secret();
  if (!key) return null;
  const payload = String(Date.now() + SESSION_MAX_AGE * 1000);
  return `${payload}.${sign(payload, key)}`;
}

export function isValidSession(token: string | undefined): boolean {
  const key = secret();
  if (!key || !token) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;
  if (!safeEqual(signature, sign(payload, key))) return false;
  return Number(payload) > Date.now();
}

export function isCorrectPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return safeEqual(input, expected);
}
