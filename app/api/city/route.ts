import { isClosed } from "@/lib/matchups";
import { getVoter, provinceCodes } from "@/lib/request";
import { getCurrent, getResults, setCity } from "@/lib/store";

// Oy verenin, oyunun sayıldığı ili düzeltmesi (IP tahmini yanlışsa).
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const city = String(body?.city ?? "");
  const voter = await getVoter();
  if (!voter || !provinceCodes.has(city)) return Response.json({ error: "Geçersiz il." }, { status: 400 });

  const current = await getCurrent();
  if (isClosed(current)) return Response.json({ error: "Oylama kapandı." }, { status: 403 });
  await setCity(current.round, voter, city);
  return Response.json({ city, results: await getResults(current.round, true) });
}
