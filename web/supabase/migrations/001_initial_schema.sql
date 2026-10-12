-- BSc Nursing Jobs BD — Initial Schema
-- Run this in Supabase SQL Editor to set up the database

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================
-- 1. Categories
-- ============================================
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  name_bn TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 2. Sources
-- ============================================
CREATE TABLE sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  base_url TEXT NOT NULL,
  source_type TEXT NOT NULL CHECK (source_type IN ('job_site', 'government', 'hospital', 'facebook', 'newspaper', 'ngo')),
  scrape_config JSONB,
  is_active BOOLEAN DEFAULT true,
  last_scraped_at TIMESTAMPTZ,
  scrape_frequency_minutes INT DEFAULT 360,
  reliability_score REAL DEFAULT 1.0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 3. Jobs (main table)
-- ============================================
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  title_bn TEXT,
  category_id UUID REFERENCES categories(id),
  source_id UUID REFERENCES sources(id),
  organization TEXT NOT NULL,
  organization_bn TEXT,
  description TEXT,
  description_bn TEXT,

  published_at TIMESTAMPTZ,
  application_start_date DATE,
  application_end_date DATE,
  exam_date DATE,
  interview_date DATE,
  result_date DATE,

  total_posts INT,
  salary_range TEXT,
  education_requirement TEXT,
  experience_requirement TEXT,
  age_limit TEXT,
  application_fee DECIMAL(10,2),
  apply_url TEXT,
  district TEXT,

  circular_url TEXT,
  circular_pdf_path TEXT,
  circular_image_paths TEXT[],

  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled', 'result_published')),
  is_verified BOOLEAN DEFAULT false,

  source_unique_id TEXT,
  content_hash TEXT,

  raw_data JSONB,
  scraped_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  UNIQUE(source_id, source_unique_id)
);

CREATE INDEX idx_jobs_category ON jobs(category_id);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_application_end ON jobs(application_end_date);
CREATE INDEX idx_jobs_content_hash ON jobs(content_hash);
CREATE INDEX idx_jobs_created_at ON jobs(created_at DESC);
CREATE INDEX idx_jobs_district ON jobs(district);
CREATE INDEX idx_jobs_title_trgm ON jobs USING gin(title gin_trgm_ops);
CREATE INDEX idx_jobs_title_bn_trgm ON jobs USING gin(title_bn gin_trgm_ops);

-- ============================================
-- 4. Job Tags
-- ============================================
CREATE TABLE job_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  tag TEXT NOT NULL
);

CREATE INDEX idx_job_tags_job ON job_tags(job_id);
CREATE INDEX idx_job_tags_tag ON job_tags(tag);

-- ============================================
-- 5. Resources
-- ============================================
CREATE TABLE resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  title_bn TEXT,
  resource_type TEXT NOT NULL CHECK (resource_type IN ('question_paper', 'study_material', 'news', 'guide')),
  category_id UUID REFERENCES categories(id),
  description TEXT,
  file_path TEXT,
  external_url TEXT,
  year INT,
  organization TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 6. Subscribers
-- ============================================
CREATE TABLE subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT,
  phone TEXT,
  push_token TEXT,
  platform TEXT DEFAULT 'web' CHECK (platform IN ('web', 'android', 'ios')),
  category_preferences UUID[],
  notify_new_jobs BOOLEAN DEFAULT true,
  notify_deadline_3days BOOLEAN DEFAULT true,
  notify_exam_dates BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 7. Notifications Log
-- ============================================
CREATE TABLE notifications_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscriber_id UUID REFERENCES subscribers(id),
  job_id UUID REFERENCES jobs(id),
  notification_type TEXT NOT NULL CHECK (notification_type IN ('new_job', 'deadline_reminder', 'exam_reminder', 'result_published')),
  sent_at TIMESTAMPTZ DEFAULT now(),
  status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'failed', 'delivered'))
);

-- ============================================
-- 8. Scrape Runs
-- ============================================
CREATE TABLE scrape_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID REFERENCES sources(id),
  started_at TIMESTAMPTZ DEFAULT now(),
  finished_at TIMESTAMPTZ,
  status TEXT DEFAULT 'running' CHECK (status IN ('running', 'success', 'partial', 'failed')),
  jobs_found INT DEFAULT 0,
  jobs_new INT DEFAULT 0,
  jobs_updated INT DEFAULT 0,
  error_message TEXT,
  metadata JSONB
);

-- ============================================
-- Row Level Security
-- ============================================
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE scrape_runs ENABLE ROW LEVEL SECURITY;

-- Public read access for content tables
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read sources" ON sources FOR SELECT USING (true);
CREATE POLICY "Public read jobs" ON jobs FOR SELECT USING (true);
CREATE POLICY "Public read job_tags" ON job_tags FOR SELECT USING (true);
CREATE POLICY "Public read resources" ON resources FOR SELECT USING (true);

-- Service role only for write operations (scraper uses service role key)
CREATE POLICY "Service write categories" ON categories FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service write sources" ON sources FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service write jobs" ON jobs FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service write job_tags" ON job_tags FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service write resources" ON resources FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service write subscribers" ON subscribers FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service write notifications" ON notifications_log FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service write scrape_runs" ON scrape_runs FOR ALL USING (auth.role() = 'service_role');

-- Subscribers can insert their own record
CREATE POLICY "Anyone can subscribe" ON subscribers FOR INSERT WITH CHECK (true);

-- ============================================
-- Seed: Categories
-- ============================================
INSERT INTO categories (name, name_bn, slug, icon, sort_order) VALUES
  ('Government Nursing Jobs', 'সরকারি নার্সিং চাকরি', 'government-nursing', 'building-government', 1),
  ('Non-Government Nursing Jobs', 'বেসরকারি নার্সিং চাকরি', 'non-government-nursing', 'briefcase', 2),
  ('Diagnostic Center', 'ডায়াগনস্টিক সেন্টার', 'diagnostic-center', 'microscope', 3),
  ('Private Hospital & Medical College', 'বেসরকারি হাসপাতাল ও মেডিকেল কলেজ', 'private-hospital', 'hospital', 4),
  ('Nursing Teacher Recruitment', 'নার্সিং শিক্ষক নিয়োগ', 'nursing-teacher', 'academic-cap', 5),
  ('Nursing Scholarship (Abroad)', 'নার্সিং স্কলারশিপ (বিদেশে পড়াশোনা)', 'scholarship-abroad', 'globe', 6),
  ('NGO Health Services', 'এনজিও স্বাস্থ্যসেবা', 'ngo-health', 'heart', 7),
  ('Military Nursing', 'সামরিক নার্সিং (CMH, সশস্ত্র বাহিনী)', 'military-nursing', 'shield', 8);

-- ============================================
-- Seed: Sources
-- ============================================
INSERT INTO sources (name, base_url, source_type, scrape_frequency_minutes) VALUES
  ('bdjobs.com', 'https://jobs.bdjobs.com', 'job_site', 360),
  ('chakri.com', 'https://chakri.com', 'job_site', 360),
  ('bdgovtjob.com', 'https://bdgovtjob.com', 'job_site', 360),
  ('DGHS', 'https://dghs.gov.bd', 'government', 720),
  ('MOHFW', 'https://mohfw.gov.bd', 'government', 720),
  ('BPSC', 'https://bpsc.gov.bd', 'government', 720),
  ('Teletalk', 'https://teletalk.com.bd', 'government', 360),
  ('Manual Entry', 'https://manual', 'job_site', 0);

-- ============================================
-- Function: Auto-update updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER jobs_updated_at
  BEFORE UPDATE ON jobs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
