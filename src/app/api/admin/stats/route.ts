import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const DAYS = 14;

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Não autorizado." }, { status: 403 });

  const [totalUsers, totalListings, activeListings, featuredListings, pendingReports] =
    await Promise.all([
      prisma.user.count(),
      prisma.listing.count(),
      prisma.listing.count({ where: { status: "ACTIVE" } }),
      prisma.listing.count({ where: { isFeatured: true } }),
      prisma.report.count({ where: { status: "PENDING" } }),
    ]);

  const since = new Date();
  since.setDate(since.getDate() - DAYS);

  const [recentUsers, recentListings] = await Promise.all([
    prisma.user.findMany({
      where: { createdAt: { gte: since } },
      select: { createdAt: true },
    }),
    prisma.listing.findMany({
      where: { createdAt: { gte: since } },
      select: { createdAt: true },
    }),
  ]);

  const dayBuckets: { date: string; utilizadores: number; anuncios: number }[] = [];
  for (let i = DAYS - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    dayBuckets.push({ date: key.slice(5), utilizadores: 0, anuncios: 0 });
  }

  const indexForDate = (date: Date) => {
    const key = date.toISOString().slice(0, 10);
    return dayBuckets.findIndex((b) => key.slice(5) === b.date);
  };

  recentUsers.forEach((u) => {
    const idx = indexForDate(u.createdAt);
    if (idx >= 0) dayBuckets[idx].utilizadores += 1;
  });
  recentListings.forEach((l) => {
    const idx = indexForDate(l.createdAt);
    if (idx >= 0) dayBuckets[idx].anuncios += 1;
  });

  return NextResponse.json({
    totalUsers,
    totalListings,
    activeListings,
    featuredListings,
    pendingReports,
    daily: dayBuckets,
  });
}
