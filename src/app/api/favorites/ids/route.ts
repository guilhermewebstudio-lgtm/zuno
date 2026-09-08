import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ ids: [] });

  const favorites = await prisma.favorite.findMany({
    where: { userId: user.id },
    select: { listingId: true },
  });

  return NextResponse.json({ ids: favorites.map((f) => f.listingId) });
}
