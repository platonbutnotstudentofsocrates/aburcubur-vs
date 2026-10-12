import { toCsv } from "@/lib/export";
import { getFinishedRounds, getResults } from "@/lib/store";

// /veri/raunt-3.csv tek raundu, /veri/tum-rauntlar.csv biten tüm rauntları verir.
export async function GET(_request: Request, { params }: RouteContext<"/veri/[file]">) {
  const { file } = await params;
  const single = /^raunt-(\d+)\.csv$/.exec(file);
  if (!single && file !== "tum-rauntlar.csv") return new Response("Bulunamadı", { status: 404 });

  const finished = await getFinishedRounds();
  const rounds = single ? finished.filter((m) => m.round === Number(single[1])) : finished.reverse();
  if (!rounds.length) return new Response("Bulunamadı", { status: 404 });

  const csv = toCsv(await Promise.all(rounds.map(async (matchup) => ({ matchup, results: await getResults(matchup.round) }))));
  return new Response(csv, {
    headers: { "content-type": "text/csv; charset=utf-8", "content-disposition": `attachment; filename="aburcuburvs-${file}"` },
  });
}
