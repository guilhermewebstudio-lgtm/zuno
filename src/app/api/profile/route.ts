import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const [listings, ratingAgg] = await Promise.all([
    prisma.listing.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: { images: { take: 1, orderBy: { position: "asc" } } },
    }),
    prisma.review.aggregate({
      where: { reviewedUserId: user.id },
      _avg: { rating: true },
      _count: { rating: true },
    }),
  ]);

  return NextResponse.json({
    user,
    listings,
    rating: ratingAgg._avg.rating,
    ratingCount: ratingAgg._count.rating,
  });
}

export async function PATCH(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const { name, phone, city } = await req.json();
  const updated = await prisma.user.update({
    where: { id: user.id },
    data: {
      ...(name !== undefined && { name }),
      ...(phone !== undefined && { phone }),
      ...(city !== undefined && { city }),
    },
    select: { id: true, name: true, email: true, phone: true, city: true, isAdmin: true },
  });

  return NextResponse.json({ user: updated });
}
