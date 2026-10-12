import { cookies } from "next/headers";
import { keyMatches, PANEL_COOKIE, panelToken } from "@/lib/panel";

const MONTH = 60 * 60 * 24 * 30;

// Panel girişi: anahtar doğruysa çerez yazar ve panele döner.
export async function POST(request: Request) {
  const form = await request.formData().catch(() => null);
  const key = String(form?.get("key") ?? "");
  // Deneme-yanılmayı yavaşlat.
  await new Promise((resolve) => setTimeout(resolve, 600));
  const ok = keyMatches(key);
  if (ok)
    (await cookies()).set(PANEL_COOKIE, panelToken(), { httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production", maxAge: MONTH, path: "/" });
  return new Response(null, { status: 303, headers: { location: ok ? "/panel" : "/panel?hata=1" } });
}
