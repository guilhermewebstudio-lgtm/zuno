import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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

  return NextResponse.json({
    totalUsers,
    totalListings,
    activeListings,
    featuredListings,
    pendingReports,
  });
}
