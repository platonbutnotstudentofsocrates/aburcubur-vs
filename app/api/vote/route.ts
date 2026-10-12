import { isClosed } from "@/lib/matchups";
import { ensureVoter, getIpHash, guessCity } from "@/lib/request";
import { castVote, getCurrent, getResults, getVote } from "@/lib/store";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const choice = body?.choice;
  if (choice !== "a" && choice !== "b") return Response.json({ error: "Geçersiz oy." }, { status: 400 });

  const current = await getCurrent();
  if (body.round !== current.round) return Response.json({ error: "Yeni raunt başladı. Sayfayı yenile." }, { status: 409 });
  if (isClosed(current)) return Response.json({ error: "Oylama kapandı." }, { status: 403 });

  const voter = await ensureVoter();
  const source = typeof body.source === "string" && /^[a-z0-9.-]{1,40}$/.test(body.source) ? body.source : null;
  const outcome = await castVote(current.round, voter, choice, await guessCity(), await getIpHash(), source);
  if (outcome === "limited")
    return Response.json({ error: "Bu ağdan çok fazla oy geldi. Biraz sonra tekrar dene." }, { status: 429 });

  const vote = await getVote(current.round, voter);
  return Response.json({ vote: vote?.choice, city: vote?.city ?? null, results: await getResults(current.round, true) });
}
