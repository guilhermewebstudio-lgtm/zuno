import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const listing = await prisma.listing.findUnique({
    where: { id },
    include: {
      images: { orderBy: { position: "asc" } },
      category: true,
      user: { select: { id: true, name: true, city: true, createdAt: true, isVerified: true } },
    },
  });

  if (!listing) {
    return NextResponse.json({ error: "Anúncio não encontrado." }, { status: 404 });
  }

  // incrementa vistas sem bloquear a resposta
  prisma.listing.update({ where: { id }, data: { viewsCount: { increment: 1 } } }).catch(() => {});

  return NextResponse.json({ listing });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const { id } = await params;
  const listing = await prisma.listing.findUnique({ where: { id } });
  if (!listing) return NextResponse.json({ error: "Anúncio não encontrado." }, { status: 404 });
  if (listing.userId !== user.id && !user.isAdmin) {
    return NextResponse.json({ error: "Não tens permissão para editar este anúncio." }, { status: 403 });
  }

  const body = await req.json();
  const allowed = ["title", "description", "price", "city", "status", "condition", "categoryId"] as const;
  const data: Record<string, unknown> = {};
  for (const key of allowed) {
    if (body[key] !== undefined) data[key] = body[key];
  }
  if (data.price !== undefined) data.price = Number(data.price);

  if (Array.isArray(body.images)) {
    await prisma.listingImage.deleteMany({ where: { listingId: id } });
    data.images = {
      create: body.images.map((url: string, i: number) => ({ url, position: i })),
    };
  }

  const updated = await prisma.listing.update({
    where: { id },
    data,
    include: { images: true },
  });
  return NextResponse.json({ listing: updated });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const { id } = await params;
  const listing = await prisma.listing.findUnique({ where: { id } });
  if (!listing) return NextResponse.json({ error: "Anúncio não encontrado." }, { status: 404 });
  if (listing.userId !== user.id && !user.isAdmin) {
    return NextResponse.json({ error: "Não tens permissão para remover este anúncio." }, { status: 403 });
  }

  await prisma.listing.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
