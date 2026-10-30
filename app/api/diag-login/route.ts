import { NextResponse } from "next/server";

// Temporária: diz só se as variáveis do login existem, nunca o valor.
export const dynamic = "force-dynamic";

export function GET() {
  const url = process.env.NEXTAUTH_URL;
  return NextResponse.json({
    AUTH_SECRET: Boolean(process.env.AUTH_SECRET),
    NEXTAUTH_SECRET: Boolean(process.env.NEXTAUTH_SECRET),
    AUTH_GOOGLE_ID: Boolean(process.env.AUTH_GOOGLE_ID),
    AUTH_GOOGLE_SECRET: Boolean(process.env.AUTH_GOOGLE_SECRET),
    INTERNAL_API_SECRET: Boolean(process.env.INTERNAL_API_SECRET),
    NEXTAUTH_URL: url ?? null,
    VERCEL_ENV: process.env.VERCEL_ENV ?? null,
  });
}
