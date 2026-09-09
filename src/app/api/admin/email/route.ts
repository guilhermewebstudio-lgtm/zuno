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
  const logoUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://zuno-wine.vercel.app"}/logo/zuno-logo.png`;

  return `
  <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 560px; margin: 0 auto; background: #f5f4f0; padding: 32px 16px;">
    <div style="text-align: center; margin-bottom: 20px;">
      <img src="${logoUrl}" alt="Zuno" width="120" style="display: inline-block;" />
    </div>

    <div style="background: linear-gradient(135deg, #0f2951, #0a1c3a); padding: 36px 32px; border-radius: 20px 20px 0 0; text-align: center;">
      <span style="display: inline-block; background: rgba(255,255,255,0.1); color: #ffffff; font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; padding: 6px 14px; border-radius: 999px;">
        Zuno &middot; Mercado Online
      </span>
      <h1 style="color: #ffffff; margin: 18px 0 0; font-size: 24px; line-height: 1.3;">${subject}</h1>
    </div>

    <div style="background: #ffffff; padding: 36px 32px; border-radius: 0 0 20px 20px; box-shadow: 0 8px 24px rgba(15,41,81,0.08);">
      <p style="color: #16223f; font-size: 15px; margin-top: 0;">Olá ${userName},</p>
      <div style="color: #444; font-size: 15px; line-height: 1.7; white-space: pre-line;">${message}</div>

      <div style="text-align: center; margin-top: 32px;">
        <a href="${process.env.NEXT_PUBLIC_SITE_URL || "https://zuno-wine.vercel.app"}"
           style="display: inline-block; background: #14926b; color: #ffffff; font-weight: 700; font-size: 14px; text-decoration: none; padding: 13px 32px; border-radius: 999px;">
          Ver no Zuno
        </a>
      </div>
    </div>

    <p style="color: #999; font-size: 12px; margin-top: 24px; text-align: center; line-height: 1.6;">
      Estás a receber este email porque tens conta no Zuno.<br />
      Zuno &middot; O teu mercado online em Portugal
    </p>
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
