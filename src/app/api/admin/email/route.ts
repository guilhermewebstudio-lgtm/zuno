import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";
const SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL || "no-reply@zuno.pt";
const SENDER_NAME = "Zuno";

async function sendBrevoEmail(to: string, name: string, subject: string, htmlContent: string) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) throw new Error("BREVO_API_KEY não configurada.");

  const res = await fetch(BREVO_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({
      sender: { name: SENDER_NAME, email: SENDER_EMAIL },
      to: [{ email: to, name }],
      subject,
      htmlContent,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Brevo error (${res.status}): ${text}`);
  }
}

function buildEmailHtml(userName: string, subject: string, message: string) {
  return `
  <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; background: #f5f4f0; padding: 24px;">
    <div style="background: #0f2951; padding: 24px; border-radius: 16px 16px 0 0; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 22px;">Zuno</h1>
    </div>
    <div style="background: #ffffff; padding: 32px; border-radius: 0 0 16px 16px;">
      <p style="color: #16223f; font-size: 15px;">Olá ${userName},</p>
      <h2 style="color: #0f2951; font-size: 18px;">${subject}</h2>
      <div style="color: #444; font-size: 14px; line-height: 1.6; white-space: pre-line;">${message}</div>
      <p style="color: #999; font-size: 12px; margin-top: 32px;">
        Estás a receber este email porque tens conta no Zuno.
      </p>
    </div>
  </div>`;
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Não autorizado." }, { status: 403 });

  try {
    const { subject, message, target } = await req.json();
    if (!subject || !message) {
      return NextResponse.json({ error: "Assunto e mensagem são obrigatórios." }, { status: 400 });
    }

    const where = target === "with_listings" ? { listings: { some: {} } } : {};
    const users = await prisma.user.findMany({
      where,
      select: { name: true, email: true },
    });

    let sent = 0;
    let failed = 0;

    for (const user of users) {
      try {
        const html = buildEmailHtml(user.name, subject, message);
        await sendBrevoEmail(user.email, user.name, subject, html);
        sent++;
      } catch (err) {
        console.error(`Falha ao enviar para ${user.email}:`, err);
        failed++;
      }
    }

    return NextResponse.json({ sent, failed, total: users.length });
  } catch (err) {
    console.error("Erro no envio de emails:", err);
    return NextResponse.json({ error: "Erro interno ao enviar emails." }, { status: 500 });
  }
}
