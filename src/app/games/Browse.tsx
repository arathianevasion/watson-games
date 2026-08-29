"use client";
import { useMemo, useState } from "react";
import { Button, Card, Checkbox, Select, Tag } from "@/components/ds";
import { GameGrid } from "@/components/site/GameGrid";
import type { Game } from "@/lib/games";

const SORTS = [{ value: "popular", label: "Most played" }, { value: "new", label: "Newest" }, { value: "shortest", label: "Shortest round" }];
const LENGTHS = ["Any length", "Under 5 minutes", "5–10 minutes", "Over 10 minutes"];

interface Props { games: Game[]; categories: string[]; initialQuery: string; initialSort: string }

export function Browse({ games, categories, initialQuery, initialSort }: Props) {
  const [active, setActive] = useState<string[]>([]);
  const [solo, setSolo] = useState(true);
  const [multi, setMulti] = useState(true);
  const [length, setLength] = useState(LENGTHS[0]);
  const [sort, setSort] = useState(SORTS.some((s) => s.value === initialSort) ? initialSort : "popular");
  const toggle = (c: string) => setActive((a) => (a.includes(c) ? a.filter((x) => x !== c) : [...a, c]));

  const shown = useMemo(() => {
    const q = initialQuery.toLowerCase();
    let list = games.filter((g) => !q || g.title.toLowerCase().includes(q) || g.description.toLowerCase().includes(q) || g.category.toLowerCase().includes(q));
    if (active.length) list = list.filter((g) => active.includes(g.category));
    list = list.filter((g) => (g.players === "1" ? solo : multi));
    if (length === LENGTHS[1]) list = list.filter((g) => g.minutes < 5);
    if (length === LENGTHS[2]) list = list.filter((g) => g.minutes >= 5 && g.minutes <= 10);
    if (length === LENGTHS[3]) list = list.filter((g) => g.minutes > 10);
    if (sort === "shortest") list = [...list].sort((a, b) => a.minutes - b.minutes);
    if (sort === "new") list = [...list].sort((a, b) => Number(b.badge === "New") - Number(a.badge === "New"));
    return list;
  }, [games, initialQuery, active, solo, multi, length, sort]);

  return (
    <div className="container" style={{ padding: "var(--sp-7) var(--gutter) var(--sp-9)" }}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: "var(--sp-5)", marginBottom: "var(--sp-6)", flexWrap: "wrap" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "var(--fs-display-m)" }}>{initialQuery ? `Results for “${initialQuery}”` : "All games"}</h1>
          <p style={{ margin: "7px 0 0", color: "var(--text-faint)", fontSize: 14 }}>{shown.length} of {games.length} games</p>
        </div>
        <div style={{ marginLeft: "auto", minWidth: 190 }}><Select options={SORTS} value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort" /></div>
      </div>
      <div className="browse-cols">
        <Card style={{ position: "sticky", top: 88 }}>
          <div style={{ font: "var(--fw-medium) 13px/1 var(--font-body)", color: "var(--text-muted)", marginBottom: "var(--sp-3)" }}>Category</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--sp-2)", marginBottom: "var(--sp-6)" }}>
            {categories.map((c) => <Tag key={c} selected={active.includes(c)} onClick={() => toggle(c)}>{c}</Tag>)}
          </div>
          <div style={{ font: "var(--fw-medium) 13px/1 var(--font-body)", color: "var(--text-muted)", marginBottom: "var(--sp-1)" }}>Players</div>
          <div style={{ display: "flex", flexDirection: "column", marginBottom: "var(--sp-5)" }}>
            <Checkbox label="Just me" checked={solo} onChange={(e) => setSolo(e.target.checked)} />
            <Checkbox label="Two or more" checked={multi} onChange={(e) => setMulti(e.target.checked)} />
          </div>
          <Select label="Round length" options={LENGTHS} value={length} onChange={(e) => setLength(e.target.value)} />
        </Card>
        <div>
          {active.length > 0 && (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: "var(--sp-4)", alignItems: "center" }}>
              {active.map((c) => <Tag key={c} onRemove={() => toggle(c)}>{c}</Tag>)}
              <Button variant="ghost" size="sm" onClick={() => setActive([])}>Clear all</Button>
            </div>
          )}
          {shown.length === 0
            ? <Card tone="sunken"><p style={{ margin: 0, color: "var(--text-muted)" }}>No games match those filters.</p><p style={{ margin: "6px 0 0", fontSize: 14, color: "var(--text-faint)" }}>Clear a filter or try another search.</p></Card>
            : <GameGrid games={shown} tight />}
        </div>
      </div>
    </div>
  );
}
