// JSON-file storage in /data (committed by GitHub Actions). Merges each run into the
// existing file so firstSeenAt and lifecycle events survive across runs.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { LifecycleEvent, OpportunitiesFile, Opportunity, SourceHealth } from "@bsc-nursing/shared";
import { todayDhaka } from "./text";

export const DATA_DIR = resolve(dirname(fileURLToPath(import.meta.url)), "../../../data");

export function readJson<T>(name: string, fallback: T): T {
  const p = resolve(DATA_DIR, name);
  if (!existsSync(p)) return fallback;
  return JSON.parse(readFileSync(p, "utf8")) as T;
}

export function writeJson(name: string, value: unknown): void {
  const p = resolve(DATA_DIR, name);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, JSON.stringify(value, null, 1) + "\n");
}

/** Item as produced by a source; bookkeeping fields are filled by mergeItems. */
export type ScrapedItem = Omit<Opportunity, "id" | "firstSeenAt" | "lastSeenAt" | "updatedAt" | "status"> & {
  status?: Opportunity["status"];
};

function sameEvent(a: LifecycleEvent, b: LifecycleEvent) {
  return a.type === b.type && (a.url ?? a.title) === (b.url ?? b.title);
}

const CONTENT_KEYS: (keyof Opportunity)[] = [
  "title", "titleBn", "organization", "posts", "totalVacancies", "deadline", "examDate",
  "applyUrl", "circularUrl", "bscEligible", "section", "salary",
];

export function mergeItems(
  existing: Opportunity[],
  scraped: ScrapedItem[],
  okSourceIds: Set<string>,
  now: string,
): { items: Opportunity[]; added: Opportunity[]; changed: Opportunity[] } {
  const byId = new Map(existing.map((o) => [o.id, o]));
  const added: Opportunity[] = [];
  const changed: Opportunity[] = [];
  const seen = new Set<string>();

  for (const s of scraped) {
    const id = `${s.sourceId}:${s.sourceKey}`;
    seen.add(id);
    const prev = byId.get(id);
    if (!prev) {
      const item: Opportunity = { ...s, id, status: s.status ?? "active", firstSeenAt: now, lastSeenAt: now, updatedAt: now };
      byId.set(id, item);
      added.push(item);
      continue;
    }
    const events = [...prev.events];
    for (const e of s.events) if (!events.some((x) => sameEvent(x, e))) events.push(e);
    const next: Opportunity = {
      ...prev,
      ...s,
      id,
      events,
      status: s.status ?? "active",
      firstSeenAt: prev.firstSeenAt,
      lastSeenAt: now,
      updatedAt: prev.updatedAt,
    };
    const contentChanged =
      events.length !== prev.events.length ||
      CONTENT_KEYS.some((k) => JSON.stringify(prev[k]) !== JSON.stringify(next[k]));
    if (contentChanged) {
      next.updatedAt = now;
      changed.push(next);
    }
    byId.set(id, next);
  }

  // Lifecycle bookkeeping for items not returned this run.
  const today = todayDhaka();
  for (const [id, o] of byId) {
    if (o.deadline && o.deadline < today && o.status === "active") {
      byId.set(id, { ...o, status: "expired", updatedAt: now });
    } else if (!seen.has(id) && okSourceIds.has(o.sourceId) && o.status === "active" && !o.deadline) {
      // Source worked but no longer lists it and it has no deadline: treat as closed.
      byId.set(id, { ...o, status: "closed", updatedAt: now });
    }
  }

  const items = [...byId.values()].sort(
    (a, b) => (b.publishedAt ?? b.firstSeenAt).localeCompare(a.publishedAt ?? a.firstSeenAt),
  );
  return { items, added, changed };
}

export function loadOpportunities(): OpportunitiesFile {
  return readJson<OpportunitiesFile>("opportunities.json", { generatedAt: "", items: [] });
}

export function saveOpportunities(items: Opportunity[], now: string) {
  writeJson("opportunities.json", { generatedAt: now, items } satisfies OpportunitiesFile);
}

export function saveHealth(health: SourceHealth[]) {
  const prev = readJson<SourceHealth[]>("source-health.json", []);
  const map = new Map(prev.map((h) => [h.sourceId, h]));
  for (const h of health) {
    map.set(h.sourceId, { ...h, lastSuccessAt: h.ok ? h.lastRunAt : (map.get(h.sourceId)?.lastSuccessAt ?? null) });
  }
  writeJson("source-health.json", [...map.values()]);
}
