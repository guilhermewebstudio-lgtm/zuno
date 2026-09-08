import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DEFAULT_CATEGORIES = [
  { namePt: "Tecnologia", nameEn: "Technology", slug: "tecnologia" },
  { namePt: "Imóveis", nameEn: "Real Estate", slug: "imoveis" },
  { namePt: "Compras", nameEn: "Shopping", slug: "compras" },
  { namePt: "Aulas", nameEn: "Classes", slug: "aulas" },
  { namePt: "Moda", nameEn: "Fashion", slug: "moda" },
  { namePt: "Brinquedos", nameEn: "Toys", slug: "brinquedos" },
  { namePt: "Informática", nameEn: "Computers", slug: "informatica" },
  { namePt: "Veículos", nameEn: "Vehicles", slug: "veiculos" },
  { namePt: "Casa", nameEn: "Home", slug: "casa" },
  { namePt: "Desporto", nameEn: "Sports", slug: "desporto" },
  { namePt: "Instrumentos", nameEn: "Instruments", slug: "instrumentos" },
  { namePt: "Serviços", nameEn: "Services", slug: "servicos" },
];

export async function GET() {
  const count = await prisma.category.count();

  if (count === 0) {
    await prisma.category.createMany({
      data: DEFAULT_CATEGORIES,
      skipDuplicates: true,
    });
  } else {
    // Migra a antiga categoria "Bebés" (slug: bebes) para "Brinquedos"
    const old = await prisma.category.findUnique({ where: { slug: "bebes" } });
    if (old) {
      await prisma.category.update({
        where: { slug: "bebes" },
        data: { namePt: "Brinquedos", nameEn: "Toys", slug: "brinquedos" },
      });
    }
  }

  const categories = await prisma.category.findMany({
    orderBy: { namePt: "asc" },
  });

  return NextResponse.json({ categories });
}
