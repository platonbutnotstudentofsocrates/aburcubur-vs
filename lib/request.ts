import { createHash, randomUUID } from "node:crypto";
import { cookies, headers } from "next/headers";
import map from "@/data/provinces.json";

const VOTER_COOKIE = "v";
const YEAR = 60 * 60 * 24 * 365;

export const provinceCodes = new Set(map.provinces.map((p) => p.code));

export async function getVoter() {
  return (await cookies()).get(VOTER_COOKIE)?.value ?? null;
}

/** Yalnızca Route Handler içinde çağır: çerez yazar. */
export async function ensureVoter() {
  const store = await cookies();
  let voter = store.get(VOTER_COOKIE)?.value;
  if (!voter) {
    voter = randomUUID();
    store.set(VOTER_COOKIE, voter, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: YEAR, path: "/" });
  }
  return voter;
}

export async function getIpHash() {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0].trim() || h.get("x-real-ip") || "local";
  return createHash("sha256").update(`${process.env.IP_SALT ?? "aburcubur"}:${ip}`).digest("hex").slice(0, 32);
}

/** Vercel'in IP'den tahmin ettiği il (plaka kodu). Bulunamazsa null. */
export async function guessCity() {
  const h = await headers();
  if (h.get("x-vercel-ip-country") !== "TR") return null;
  const code = h.get("x-vercel-ip-country-region")?.padStart(2, "0") ?? "";
  return provinceCodes.has(code) ? code : null;
}
