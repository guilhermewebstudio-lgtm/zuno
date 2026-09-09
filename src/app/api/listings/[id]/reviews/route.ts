import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const reviews = await prisma.review.findMany({
    where: { listingId: id },
    orderBy: { createdAt: "desc" },
    include: { reviewer: { select: { name: true } } },
  });

  const avg =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : null;

  return NextResponse.json({ reviews, average: avg, count: reviews.length });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const { id } = await params;
  const { rating, comment } = await req.json();

  const ratingNumber = Number(rating);
  if (!ratingNumber || ratingNumber < 1 || ratingNumber > 5) {
    return NextResponse.json({ error: "A classificação tem de ser entre 1 e 5." }, { status: 400 });
  }

  const listing = await prisma.listing.findUnique({ where: { id } });
  if (!listing) return NextResponse.json({ error: "Anúncio não encontrado." }, { status: 404 });
  if (listing.userId === user.id) {
    return NextResponse.json({ error: "Não podes classificar o teu próprio anúncio." }, { status: 400 });
  }

  const review = await prisma.review.upsert({
    where: { listingId_reviewerId: { listingId: id, reviewerId: user.id } },
    update: { rating: ratingNumber, comment: comment || null },
    create: {
      listingId: id,
      reviewedUserId: listing.userId,
      reviewerId: user.id,
      rating: ratingNumber,
      comment: comment || null,
    },
  });

  return NextResponse.json({ review }, { status: 201 });
}
