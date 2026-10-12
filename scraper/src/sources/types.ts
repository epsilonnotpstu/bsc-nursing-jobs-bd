import type { ScrapedItem } from "../lib/store";
import type { ExtractionCache } from "../extract/circular";

export interface SourceContext {
  now: string;
  cache: ExtractionCache;
  log: (msg: string) => void;
}

export interface Source {
  id: string;
  name: string;
  run(ctx: SourceContext): Promise<ScrapedItem[]>;
}
