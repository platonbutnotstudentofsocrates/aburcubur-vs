import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

// Panel yalnızca PANEL_KEY ortam değişkeni tanımlıysa açılır; anahtarı bilen girer.
export const PANEL_COOKIE = "p";
const digest = (value: string) => createHash("sha256").update(value).digest();

export const panelEnabled = () => Boolean(process.env.PANEL_KEY);

export function keyMatches(candidate: string) {
  const key = process.env.PANEL_KEY;
  return Boolean(key) && timingSafeEqual(digest(candidate), digest(key!));
}

export const panelToken = () => digest(`panel:${process.env.PANEL_KEY}`).toString("hex");

export async function panelAuthorized() {
  if (!panelEnabled()) return false;
  const token = (await cookies()).get(PANEL_COOKIE)?.value ?? "";
  const expected = panelToken();
  return token.length === expected.length && timingSafeEqual(Buffer.from(token), Buffer.from(expected));
}
