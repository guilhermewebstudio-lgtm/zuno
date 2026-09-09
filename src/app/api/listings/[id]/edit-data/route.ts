import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const { id } = await params;
  const listing = await prisma.listing.findUnique({
    where: { id },
    include: { images: { orderBy: { position: "asc" } } },
  });

  if (!listing) return NextResponse.json({ error: "Anúncio não encontrado." }, { status: 404 });
  if (listing.userId !== user.id && !user.isAdmin) {
    return NextResponse.json({ error: "Não tens permissão." }, { status: 403 });
  }

  return NextResponse.json({ listing });
}
