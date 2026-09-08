import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { prisma } from "./prisma";

const JWT_SECRET = process.env.JWT_SECRET || "zuno_dev_secret_change_in_production";
const COOKIE_NAME = "zuno_session";
const SESSION_DAYS = 30;

export interface SessionPayload {
  userId: string;
}

export function signSession(userId: string): string {
  return jwt.sign({ userId } as SessionPayload, JWT_SECRET, {
    expiresIn: `${SESSION_DAYS}d`,
  });
}

export async function setSessionCookie(userId: string) {
  const token = signSession(userId);
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function getCurrentUser() {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const payload = jwt.verify(token, JWT_SECRET) as SessionPayload;
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        city: true,
        avatarUrl: true,
        isAdmin: true,
        isBanned: true,
        createdAt: true,
      },
    });
    if (!user || user.isBanned) return null;
    return user;
  } catch {
    return null;
  }
}

export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || !user.isAdmin) return null;
  return user;
}
