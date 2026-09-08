import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const LISTING_DURATION_DAYS = 30;

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const { id } = await params;
  const listing = await prisma.listing.findUnique({ where: { id } });
  if (!listing) return NextResponse.json({ error: "Anúncio não encontrado." }, { status: 404 });
  if (listing.userId !== user.id) {
    return NextResponse.json({ error: "Não tens permissão para republicar este anúncio." }, { status: 403 });
  }

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + LISTING_DURATION_DAYS);

  const updated = await prisma.listing.update({
    where: { id },
    data: { status: "ACTIVE", expiresAt },
  });

  return NextResponse.json({ listing: updated });
}
