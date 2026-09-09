import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Não autorizado." }, { status: 403 });

  const listings = await prisma.listing.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: {
      user: { select: { id: true, name: true, email: true } },
      category: { select: { namePt: true } },
      _count: { select: { reports: true } },
    },
  });

  return NextResponse.json({ listings });
}

export async function PATCH(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Não autorizado." }, { status: 403 });

  const { listingId, status, isFeatured, isSpotlight } = await req.json();
  if (!listingId) return NextResponse.json({ error: "listingId em falta." }, { status: 400 });

  const data: {
    status?: "ACTIVE" | "SOLD" | "PAUSED" | "EXPIRED" | "REMOVED";
    isFeatured?: boolean;
    isSpotlight?: boolean;
    spotlightUntil?: Date | null;
  } = {};
  if (status) data.status = status;
  if (typeof isFeatured === "boolean") data.isFeatured = isFeatured;
  if (typeof isSpotlight === "boolean") {
    data.isSpotlight = isSpotlight;
    if (isSpotlight) {
      const until = new Date();
      until.setDate(until.getDate() + 1);
      data.spotlightUntil = until;
    } else {
      data.spotlightUntil = null;
    }
  }

  const listing = await prisma.listing.update({ where: { id: listingId }, data });
  return NextResponse.json({ listing });
}

export async function DELETE(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Não autorizado." }, { status: 403 });

  const { listingId } = await req.json();
  if (!listingId) return NextResponse.json({ error: "listingId em falta." }, { status: 400 });

  await prisma.listing.delete({ where: { id: listingId } });
  return NextResponse.json({ ok: true });
}
