import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Não autorizado." }, { status: 403 });

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      city: true,
      isAdmin: true,
      isBanned: true,
      createdAt: true,
      _count: { select: { listings: true } },
    },
  });

  return NextResponse.json({ users });
}

export async function PATCH(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Não autorizado." }, { status: 403 });

  const { userId, isBanned, isAdmin } = await req.json();
  if (!userId) return NextResponse.json({ error: "userId em falta." }, { status: 400 });

  const data: { isBanned?: boolean; isAdmin?: boolean } = {};
  if (typeof isBanned === "boolean") data.isBanned = isBanned;
  if (typeof isAdmin === "boolean") data.isAdmin = isAdmin;

  const user = await prisma.user.update({ where: { id: userId }, data });
  return NextResponse.json({ user });
}
