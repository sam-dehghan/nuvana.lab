"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { authConfigured, createSessionToken, isCorrectPassword, SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/auth";
import { hasDb, query } from "@/lib/db";

export type LoginState = { error?: string };

const MAX_FAILURES = 8;
const WINDOW = "15 minutes";

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  if (!authConfigured()) {
    return { error: "Admin ist nicht eingerichtet. ADMIN_PASSWORD und AUTH_SECRET (mind. 32 Zeichen) fehlen." };
  }

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  if (hasDb) {
    const [{ n }] = await query<{ n: number }>(
      `SELECT count(*)::int AS n FROM login_attempts WHERE ip = $1 AND created_at > now() - interval '${WINDOW}'`,
      [ip],
    );
    if (n >= MAX_FAILURES) return { error: "Zu viele Versuche. Bitte in 15 Minuten erneut versuchen." };
  }

  const password = String(formData.get("password") ?? "");
  if (!isCorrectPassword(password)) {
    if (hasDb) await query("INSERT INTO login_attempts (ip) VALUES ($1)", [ip]);
    return { error: "Das Passwort ist falsch." };
  }

  if (hasDb) await query("DELETE FROM login_attempts WHERE ip = $1 OR created_at < now() - interval '1 day'", [ip]);

  const token = createSessionToken();
  if (!token) return { error: "AUTH_SECRET fehlt oder ist zu kurz." };

  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  redirect("/admin/blog");
}

export async function logout() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/admin/login");
}
