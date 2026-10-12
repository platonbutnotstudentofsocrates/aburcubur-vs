import map from "@/data/provinces.json";
import { productName } from "./catalog";
import type { Matchup } from "./matchups";
import type { Results } from "./store";

export type ProvinceRow = { code: string; name: string; a: number; b: number };

/** Oy almış iller (çoktan aza) ve ili bilinmeyen oylar; toplamı raundun toplamına eşittir. */
export function provinceRows(results: Results): ProvinceRow[] {
  const rows = map.provinces
    .map((p) => ({ code: p.code, name: p.name, ...(results.cities[p.code] ?? { a: 0, b: 0 }) }))
    .filter((row) => row.a + row.b > 0)
    .sort((x, y) => y.a + y.b - (x.a + x.b) || x.name.localeCompare(y.name, "tr"));
  const known = rows.reduce((sum, row) => ({ a: sum.a + row.a, b: sum.b + row.b }), { a: 0, b: 0 });
  const unknown = { code: "", name: "Bilinmiyor", a: results.a - known.a, b: results.b - known.b };
  return unknown.a + unknown.b > 0 ? [...rows, unknown] : rows;
}

const HEADER = ["raunt", "bitis", "il_kodu", "il", "urun_a", "oy_a", "urun_b", "oy_b", "toplam"];

// Excel'in Türkçe ayarlarla doğrudan açabilmesi için: UTF-8 BOM, noktalı virgül, CRLF.
export function toCsv(rounds: { matchup: Matchup; results: Results }[]) {
  const lines = [HEADER.join(";")];
  for (const { matchup, results } of rounds)
    for (const row of provinceRows(results))
      lines.push(
        [matchup.round, matchup.endsAt.slice(0, 10), row.code, row.name, productName(matchup.a), row.a, productName(matchup.b), row.b, row.a + row.b].join(";"),
      );
  return "﻿" + lines.join("\r\n") + "\r\n";
}
