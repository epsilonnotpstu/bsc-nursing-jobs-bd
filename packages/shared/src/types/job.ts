export type JobStatus = "active" | "expired" | "cancelled" | "result_published";

export type SourceType =
  | "job_site"
  | "government"
  | "hospital"
  | "facebook"
  | "newspaper"
  | "ngo";

export type ResourceType =
  | "question_paper"
  | "study_material"
  | "news"
  | "guide";

export interface Category {
  id: string;
  name: string;
  name_bn: string;
  slug: string;
  description: string | null;
  icon: string | null;
  sort_order: number;
  created_at: string;
  job_count?: number;
}

export interface Source {
  id: string;
  name: string;
  base_url: string;
  source_type: SourceType;
  scrape_config: Record<string, unknown> | null;
  is_active: boolean;
  last_scraped_at: string | null;
  scrape_frequency_minutes: number;
  reliability_score: number;
  created_at: string;
}

export interface Job {
  id: string;
  title: string;
  title_bn: string | null;
  category_id: string;
  source_id: string;
  organization: string;
  organization_bn: string | null;
  description: string | null;
  description_bn: string | null;

  published_at: string | null;
  application_start_date: string | null;
  application_end_date: string | null;
  exam_date: string | null;
  interview_date: string | null;
  result_date: string | null;

  total_posts: number | null;
  salary_range: string | null;
  education_requirement: string | null;
  experience_requirement: string | null;
  age_limit: string | null;
  application_fee: number | null;
  apply_url: string | null;

  circular_url: string | null;
  circular_pdf_path: string | null;
  circular_image_paths: string[] | null;

  status: JobStatus;
  is_verified: boolean;
  district: string | null;

  source_unique_id: string | null;
  content_hash: string | null;

  scraped_at: string;
  created_at: string;
  updated_at: string;

  // Joined fields
  category?: Category;
  source?: Pick<Source, "name">;
  tags?: string[];
}

export interface JobTag {
  id: string;
  job_id: string;
  tag: string;
}

export interface Resource {
  id: string;
  title: string;
  title_bn: string | null;
  resource_type: ResourceType;
  category_id: string | null;
  description: string | null;
  file_path: string | null;
  external_url: string | null;
  year: number | null;
  organization: string | null;
  created_at: string;
}

export interface Subscriber {
  id: string;
  email: string | null;
  phone: string | null;
  push_token: string | null;
  platform: "web" | "android" | "ios";
  category_preferences: string[];
  notify_new_jobs: boolean;
  notify_deadline_3days: boolean;
  notify_exam_dates: boolean;
  is_active: boolean;
  created_at: string;
}

export interface ScrapeRun {
  id: string;
  source_id: string;
  started_at: string;
  finished_at: string | null;
  status: "running" | "success" | "partial" | "failed";
  jobs_found: number;
  jobs_new: number;
  jobs_updated: number;
  error_message: string | null;
}

export interface JobWithDaysLeft extends Job {
  days_left: number | null;
  exam_days_left: number | null;
}
