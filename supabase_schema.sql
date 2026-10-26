-- ==============================================================================
-- KC NEXUS STUDIO: SUPABASE DATABASE & STORAGE SCHEMA
-- Project: kc-nexus (https://vmracftfhqqigfvenrtg.supabase.co)
-- Primary Administrator: okoobenikelechisalvation@gmail.com
-- Storage Bucket: portfolio-media
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. PORTFOLIO PROJECTS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  filter_category TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'published',
  description TEXT NOT NULL,
  full_overview TEXT NOT NULL,
  image TEXT,
  video_url TEXT,
  project_link TEXT,
  client_scope TEXT,
  year TEXT DEFAULT '2026',
  deliverables JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookup by status and category
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_category ON public.projects(filter_category);

-- Enable Row Level Security (RLS) on projects table
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Project Table RLS Policies:
-- 1a. Public visitors can view published projects
CREATE POLICY "Public read published projects"
  ON public.projects
  FOR SELECT
  USING (
    status = 'published'
    OR (auth.jwt() ->> 'email') = 'okoobenikelechisalvation@gmail.com'
  );

-- 1b. Administrator can insert projects
CREATE POLICY "Admin insert projects"
  ON public.projects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (auth.jwt() ->> 'email') = 'okoobenikelechisalvation@gmail.com'
  );

-- 1c. Administrator can update projects
CREATE POLICY "Admin update projects"
  ON public.projects
  FOR UPDATE
  TO authenticated
  USING (
    (auth.jwt() ->> 'email') = 'okoobenikelechisalvation@gmail.com'
  )
  WITH CHECK (
    (auth.jwt() ->> 'email') = 'okoobenikelechisalvation@gmail.com'
  );

-- 1d. Administrator can delete projects
CREATE POLICY "Admin delete projects"
  ON public.projects
  FOR DELETE
  TO authenticated
  USING (
    (auth.jwt() ->> 'email') = 'okoobenikelechisalvation@gmail.com'
  );

-- ------------------------------------------------------------------------------
-- 2. SUPABASE STORAGE: "portfolio-media" BUCKET & RLS POLICIES
-- ------------------------------------------------------------------------------

-- Ensure the public "portfolio-media" bucket exists
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'portfolio-media',
  'portfolio-media',
  true,
  157286400, -- 150 MB limit
  ARRAY[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/svg+xml',
    'image/gif',
    'video/mp4',
    'video/webm',
    'video/quicktime',
    'video/ogg'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 157286400;

-- Storage RLS Policies for storage.objects:
-- 2a. Allow public visitors to read portfolio media
CREATE POLICY "Public Read Portfolio Media"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'portfolio-media');

-- 2b. Allow authenticated administrator to upload media (INSERT)
CREATE POLICY "Admin Upload Portfolio Media"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'portfolio-media'
    AND (auth.jwt() ->> 'email') = 'okoobenikelechisalvation@gmail.com'
  );

-- 2c. Allow authenticated administrator to update media (UPDATE)
CREATE POLICY "Admin Update Portfolio Media"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'portfolio-media'
    AND (auth.jwt() ->> 'email') = 'okoobenikelechisalvation@gmail.com'
  );

-- 2d. Allow authenticated administrator to delete media (DELETE)
CREATE POLICY "Admin Delete Portfolio Media"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'portfolio-media'
    AND (auth.jwt() ->> 'email') = 'okoobenikelechisalvation@gmail.com'
  );
