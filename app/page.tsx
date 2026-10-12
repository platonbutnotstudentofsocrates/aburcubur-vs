import { Game } from "@/components/Game";
import { productName } from "@/lib/catalog";
import { isClosed } from "@/lib/matchups";
import { getVoter } from "@/lib/request";
import { getCurrent, getNomination, getNominees, getPastRounds, getResults, getUsedProducts, getVote } from "@/lib/store";

// Her istekte veritabanından okunur; derleme sırasında önceden üretilmez.
export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const current = await getCurrent();
  const title = `${productName(current.a)} vs ${productName(current.b)} — Abur Cubur VS`;
  return { title, openGraph: { title } };
}

export default async function Page() {
  const current = await getCurrent();
  const voter = await getVoter();
  const vote = voter ? await getVote(current.round, voter) : null;
  // Sonuçlar yalnızca oy verene (ya da oylama bitince herkese) gider.
  const results = vote || isClosed(current) ? await getResults(current.round) : null;
  return (
    <Game
      key={current.round}
      matchup={current}
      vote={vote?.choice ?? null}
      city={vote?.city ?? null}
      results={results}
      nomination={voter ? await getNomination(current.round, voter) : null}
      nominees={await getNominees(current.round)}
      used={[...(await getUsedProducts())]}
      past={await getPastRounds(current.round)}
    />
  );
}
