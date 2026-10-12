// Agent entry point: run every source independently, merge into data/opportunities.json,
// record source health. Usage: npm run scrape [-- --only=bdjobs,teletalk]

import type { SourceHealth } from "@bsc-nursing/shared";
import { aiBudget, loadCache, saveCache } from "./extract/circular";
import { loadOpportunities, mergeItems, saveHealth, saveOpportunities, type ScrapedItem } from "./lib/store";
import { bdjobs } from "./sources/bdjobs";
import { govPortalSources } from "./sources/govPortal";
import { teletalk } from "./sources/teletalk";
import type { Source } from "./sources/types";

const ALL_SOURCES: Source[] = [teletalk, bdjobs, ...govPortalSources];

async function main() {
  const only = process.argv.find((a) => a.startsWith("--only="))?.slice(7).split(",");
  const sources = only ? ALL_SOURCES.filter((s) => only.includes(s.id)) : ALL_SOURCES;
  const now = new Date().toISOString();
  const cache = loadCache();
  const log = (msg: string) => console.log(`[${new Date().toISOString().slice(11, 19)}] ${msg}`);

  const scraped: ScrapedItem[] = [];
  const health: SourceHealth[] = [];
  const okSourceIds = new Set<string>();

  for (const source of sources) {
    const started = Date.now();
    try {
      const items = await source.run({ now, cache, log });
      scraped.push(...items);
      okSourceIds.add(source.id);
      health.push({ sourceId: source.id, name: source.name, lastRunAt: now, lastSuccessAt: now, ok: true, itemsFound: items.length, error: null });
      log(`✓ ${source.id}: ${items.length} items (${((Date.now() - started) / 1000).toFixed(1)}s)`);
    } catch (err) {
      const msg = (err as Error).message ?? String(err);
      health.push({ sourceId: source.id, name: source.name, lastRunAt: now, lastSuccessAt: null, ok: false, itemsFound: 0, error: msg.slice(0, 300) });
      log(`✗ ${source.id}: ${msg}`);
    }
    saveCache(cache); // keep AI results even if a later source crashes
  }

  const { items, added, changed } = mergeItems(loadOpportunities().items, scraped, okSourceIds, now);
  saveOpportunities(items, now);
  saveHealth(health);
  log(`done: ${items.length} total, ${added.length} new, ${changed.length} changed, AI calls left ${aiBudget.remaining}`);
  for (const a of added.slice(0, 30)) log(`  + [${a.section}] ${a.title.slice(0, 60)} — ${a.organization.slice(0, 40)} (শেষ: ${a.deadline ?? "?"})`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
