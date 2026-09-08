import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const LISTING_DURATION_DAYS = 30;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const categorySlug = searchParams.get("category");
  const city = searchParams.get("city");
  const q = searchParams.get("q");
  const mine = searchParams.get("mine");

  const where: {
    status: "ACTIVE";
    category?: { slug: string };
    city?: { contains: string; mode: "insensitive" };
    title?: { contains: string; mode: "insensitive" };
    userId?: string;
  } = { status: "ACTIVE" };

  if (categorySlug) where.category = { slug: categorySlug };
  if (city) where.city = { contains: city, mode: "insensitive" };
  if (q) where.title = { contains: q, mode: "insensitive" };

  if (mine === "true") {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
    where.userId = user.id;
  }

  const listings = await prisma.listing.findMany({
    where,
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    take: 60,
    include: {
      images: { orderBy: { position: "asc" }, take: 1 },
      category: { select: { namePt: true, slug: true } },
      user: { select: { id: true, name: true } },
    },
  });

  return NextResponse.json({ listings });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Precisas de ter conta e sessão iniciada para publicar." }, { status: 401 });
  }

  try {
    const { title, description, price, categoryId, city, condition, images } = await req.json();

    if (!title || !description || !price || !categoryId || !city) {
      return NextResponse.json({ error: "Preenche todos os campos obrigatórios." }, { status: 400 });
    }

    const priceNumber = Number(price);
    if (Number.isNaN(priceNumber) || priceNumber < 0) {
      return NextResponse.json({ error: "Preço inválido." }, { status: 400 });
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + LISTING_DURATION_DAYS);

    const listing = await prisma.listing.create({
      data: {
        userId: user.id,
        categoryId,
        title,
        description,
        price: priceNumber,
        city,
        condition: condition === "NEW" ? "NEW" : "USED",
        expiresAt,
        images: {
          create: (Array.isArray(images) ? images : []).map((url: string, i: number) => ({
            url,
            position: i,
          })),
        },
      },
      include: { images: true },
    });

    return NextResponse.json({ listing }, { status: 201 });
  } catch (err) {
    console.error("Erro ao criar anúncio:", err);
    return NextResponse.json({ error: "Erro interno ao criar anúncio." }, { status: 500 });
  }
}
