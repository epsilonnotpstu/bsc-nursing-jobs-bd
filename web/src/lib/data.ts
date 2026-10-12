// Reads the agent's output (../data, committed by GitHub Actions) at build time.

import type { OpportunitiesFile, Opportunity, SectionSlug, SourceHealth } from "@bsc-nursing/shared";
import opportunitiesJson from "../../../data/opportunities.json";
import healthJson from "../../../data/source-health.json";
import scholarshipsJson from "../../../data/curated/scholarships.json";

const file = opportunitiesJson as unknown as OpportunitiesFile;

export const generatedAt: string = file.generatedAt;
export const sourceHealth = healthJson as SourceHealth[];

export interface Scholarship {
  name: string;
  country: string;
  level: string;
  url: string;
  usualWindow: string;
  status: string;
  nursingFit: string;
  note: string | null;
}

export const scholarships = scholarshipsJson as Scholarship[];

/** URL-safe slug for an opportunity id (`source:key`). */
export const toSlug = (id: string) => id.replace(":", "__");
export const fromSlug = (slug: string) => decodeURIComponent(slug).replace("__", ":");

/** Hide closed items and posts a BSc nurse cannot apply for. */
function isListed(o: Opportunity) {
  return o.status !== "closed" && o.bscEligible !== "no";
}

/** Active first, then soonest deadline, then newest. */
function byUrgency(a: Opportunity, b: Opportunity) {
  const rank = (o: Opportunity) => (o.status === "active" ? 0 : 1);
  if (rank(a) !== rank(b)) return rank(a) - rank(b);
  const da = a.deadline ?? "9999";
  const db = b.deadline ?? "9999";
  if (da !== db) return da.localeCompare(db);
  return (b.publishedAt ?? b.firstSeenAt).localeCompare(a.publishedAt ?? a.firstSeenAt);
}

export const opportunities: Opportunity[] = file.items.filter(isListed).sort(byUrgency);

export function getBySection(section: SectionSlug): Opportunity[] {
  return opportunities.filter((o) => o.section === section);
}

export function getBySlug(slug: string): Opportunity | undefined {
  const id = fromSlug(slug);
  return file.items.find((o) => o.id === id);
}

export function sectionCounts(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const o of opportunities) if (o.status === "active") counts[o.section] = (counts[o.section] ?? 0) + 1;
  return counts;
}

/** Slim shape sent to client components (keeps the HTML payload small). */
export type OpportunityRow = Pick<
  Opportunity,
  | "id" | "kind" | "section" | "title" | "titleBn" | "organization" | "organizationBn" | "totalVacancies"
  | "location" | "publishedAt" | "deadline" | "examDate" | "applyUrl" | "circularUrl" | "bscEligible"
  | "trust" | "warning" | "status" | "gender"
> & { slug: string };

export function toRows(items: Opportunity[]): OpportunityRow[] {
  return items.map((o) => ({
    slug: toSlug(o.id),
    id: o.id, kind: o.kind, section: o.section, title: o.title, titleBn: o.titleBn,
    organization: o.organization, organizationBn: o.organizationBn, totalVacancies: o.totalVacancies,
    location: o.location, publishedAt: o.publishedAt, deadline: o.deadline, examDate: o.examDate,
    applyUrl: o.applyUrl, circularUrl: o.circularUrl, bscEligible: o.bscEligible, trust: o.trust,
    warning: o.warning, status: o.status, gender: o.gender,
  }));
}
