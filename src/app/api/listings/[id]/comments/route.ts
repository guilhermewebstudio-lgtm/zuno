import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const comments = await prisma.comment.findMany({
    where: { listingId: id },
    orderBy: { createdAt: "asc" },
    include: { user: { select: { name: true, isVerified: true } } },
  });

  return NextResponse.json({ comments });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const { id } = await params;
  const { body } = await req.json();

  const trimmed = String(body || "").trim();
  if (!trimmed) return NextResponse.json({ error: "Escreve um comentário." }, { status: 400 });
  if (trimmed.length > 500) {
    return NextResponse.json({ error: "Comentário demasiado longo (máx 500 caracteres)." }, { status: 400 });
  }

  const listing = await prisma.listing.findUnique({ where: { id } });
  if (!listing) return NextResponse.json({ error: "Anúncio não encontrado." }, { status: 404 });

  const comment = await prisma.comment.create({
    data: { listingId: id, userId: user.id, body: trimmed },
    include: { user: { select: { name: true, isVerified: true } } },
  });

  return NextResponse.json({ comment }, { status: 201 });
}
