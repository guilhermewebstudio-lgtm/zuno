import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { setSessionCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email e password são obrigatórios." },
        { status: 400 }
      );
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });

    if (!user) {
      return NextResponse.json({ error: "Credenciais inválidas." }, { status: 401 });
    }
    if (user.isBanned) {
      return NextResponse.json(
        { error: "Esta conta foi suspensa. Contacta o suporte." },
        { status: 403 }
      );
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Credenciais inválidas." }, { status: 401 });
    }

    // Promove a admin se o email corresponder ao ADMIN_EMAIL configurado
    const shouldBeAdmin = normalizedEmail === (process.env.ADMIN_EMAIL || "").toLowerCase();
    if (shouldBeAdmin && !user.isAdmin) {
      await prisma.user.update({ where: { id: user.id }, data: { isAdmin: true } });
    }

    await setSessionCookie(user.id);

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: shouldBeAdmin || user.isAdmin,
      },
    });
  } catch (err) {
    console.error("Erro no login:", err);
    return NextResponse.json({ error: "Erro interno ao entrar." }, { status: 500 });
  }
}
