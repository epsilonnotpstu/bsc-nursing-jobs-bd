// Data model produced by the scraper agent (data/opportunities.json) and read by web + mobile.
// Dates are ISO strings: "YYYY-MM-DD" for calendar dates, full ISO for timestamps.

export type SectionSlug =
  | "govt-health"
  | "govt-other"
  | "defence"
  | "private-hospital"
  | "clinic"
  | "diagnostic"
  | "teaching"
  | "ngo-un"
  | "corporate"
  | "homecare-other"
  | "abroad-jobs"
  | "scholarship"
  | "higher-study"
  | "exams-results"
  | "special";

/** What kind of item this is. A job can also accumulate lifecycle events. */
export type OpportunityKind =
  | "job"
  | "admit_card"
  | "exam_schedule"
  | "result"
  | "admission"
  | "training"
  | "scholarship"
  | "notice";

/**
 * Whether a BSc Nursing graduate can apply.
 * - yes: BSc Nursing (or Bachelor in nursing) explicitly accepted
 * - diploma_min: minimum is Diploma in Nursing; BSc holders can usually apply
 * - no: midwifery-only, caregiver/HSC, or other non-nursing qualification
 * - unknown: qualification not stated or not yet extracted
 */
export type BscEligibility = "yes" | "diploma_min" | "no" | "unknown";

/** Evidence grade (from the Codex V2 research model). */
export type TrustGrade = "A1" | "A2" | "B" | "C" | "D";

export type OpportunityStatus = "active" | "expired" | "closed";

export type LifecycleEventType =
  | "circular"
  | "admit_card"
  | "exam"
  | "written_result"
  | "viva"
  | "final_result"
  | "waiting_list"
  | "notice";

export interface LifecycleEvent {
  type: LifecycleEventType;
  title: string;
  date: string | null;
  url: string | null;
  seenAt: string;
}

export interface PostInfo {
  name: string;
  count: number | null;
  qualification: string | null;
  bscEligible: BscEligibility;
  salary: string | null;
  ageLimit: string | null;
}

export interface Opportunity {
  /** Stable id: `${sourceId}:${sourceKey}` */
  id: string;
  sourceId: string;
  /** Id of the item inside its source (job id, notice id, url hash). */
  sourceKey: string;
  kind: OpportunityKind;
  section: SectionSlug;
  title: string;
  titleBn: string | null;
  organization: string;
  organizationBn: string | null;
  /** Nursing-relevant posts only (from listing or PDF extraction). */
  posts: PostInfo[];
  totalVacancies: number | null;
  location: string | null;
  publishedAt: string | null;
  applicationStart: string | null;
  deadline: string | null;
  examDate: string | null;
  applyUrl: string | null;
  detailUrl: string | null;
  circularUrl: string | null;
  salary: string | null;
  ageLimit: string | null;
  applicationFee: string | null;
  experience: string | null;
  gender: "any" | "male" | "female" | null;
  bscEligible: BscEligibility;
  trust: TrustGrade;
  /** Personal / anonymous poster or other reason the reader should double-check. */
  warning: string | null;
  aiExtracted: boolean;
  needsReview: boolean;
  events: LifecycleEvent[];
  status: OpportunityStatus;
  firstSeenAt: string;
  lastSeenAt: string;
  updatedAt: string;
}

export interface OpportunitiesFile {
  generatedAt: string;
  items: Opportunity[];
}

export interface SourceHealth {
  sourceId: string;
  name: string;
  lastRunAt: string;
  lastSuccessAt: string | null;
  ok: boolean;
  itemsFound: number;
  error: string | null;
}
