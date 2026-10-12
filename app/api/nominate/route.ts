import { findProduct } from "@/lib/catalog";
import { ensureVoter, getIpHash } from "@/lib/request";
import { getCurrent, getNominees, getUsedProducts, nominate } from "@/lib/store";

// Sonraki kapışma için katalogdan tek bir ürün alır.
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const product = String(body?.product ?? "");
  if (!findProduct(product)) return Response.json({ error: "Listeden bir ürün seç." }, { status: 400 });

  const current = await getCurrent();
  if (body.round !== current.round) return Response.json({ error: "Yeni raunt başladı. Sayfayı yenile." }, { status: 409 });
  if ((await getUsedProducts()).has(product))
    return Response.json({ error: "O daha önce kapıştı. Başka bir şey seç." }, { status: 400 });

  const voter = await ensureVoter();
  if ((await nominate(current.round, voter, product, await getIpHash())) === "limited")
    return Response.json({ error: "Bu ağdan çok fazla aday geldi. Biraz sonra tekrar dene." }, { status: 429 });

  return Response.json({ nomination: product, nominees: await getNominees(current.round) });
}
