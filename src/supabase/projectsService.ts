import { supabase, isSupabaseConfigured, PRIMARY_ADMIN_EMAIL } from './client';
import { STUDIO_PROJECTS, PortfolioCategory } from '../data/studioData';
import { extractPortfolioStoragePath, deletePortfolioMedia } from './storageService';

export interface ProjectDeleteResult {
  success: boolean;
  message: string;
  databaseDeleted: boolean;
  mediaCleaned: string[];
  mediaSkipped: string[];
  mediaFailed: Array<{ path: string; error: string }>;
}

export interface ProjectRecord {
  id: string;
  slug: string;
  title: string;
  category: string;
  filterCategory: PortfolioCategory;
  description: string;
  fullOverview: string;
  image?: string;
  videoUrl?: string;
  projectLink?: string;
  deliverables: string[];
  clientScope?: string;
  year?: string;
  status: 'published' | 'draft';
  createdAt?: string;
  updatedAt?: string;
}

export interface ProjectSaveResult {
  id: string;
  syncedToCloud: boolean;
  message: string;
}

interface SupabaseProjectRow {
  id: string;
  slug: string;
  title: string;
  category: string;
  filter_category: string;
  status: 'published' | 'draft';
  description: string;
  full_overview: string;
  image: string | null;
  video_url: string | null;
  project_link: string | null;
  deliverables: string[] | null;
  client_scope: string | null;
  year: string | null;
  created_at: string;
  updated_at: string;
}

// Convert a database row to application ProjectRecord
function mapRowToRecord(row: SupabaseProjectRow): ProjectRecord {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: row.category,
    filterCategory: row.filter_category as PortfolioCategory,
    status: row.status || 'published',
    description: row.description,
    fullOverview: row.full_overview,
    image: row.image || undefined,
    videoUrl: row.video_url || undefined,
    projectLink: row.project_link || undefined,
    deliverables: Array.isArray(row.deliverables) ? row.deliverables : [],
    clientScope: row.client_scope || undefined,
    year: row.year || '2026',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// Convert application input to database row format
function mapRecordToRow(
  data: Partial<ProjectRecord>
): Partial<SupabaseProjectRow> {
  const row: Record<string, unknown> = {};

  if (data.title !== undefined) row.title = data.title;
  if (data.slug !== undefined) row.slug = data.slug;
  if (data.category !== undefined) row.category = data.category;
  if (data.filterCategory !== undefined) row.filter_category = data.filterCategory;
  if (data.status !== undefined) row.status = data.status;
  if (data.description !== undefined) row.description = data.description;
  if (data.fullOverview !== undefined) row.full_overview = data.fullOverview;
  if (data.image !== undefined) row.image = data.image || null;
  if (data.videoUrl !== undefined) row.video_url = data.videoUrl || null;
  if (data.projectLink !== undefined) row.project_link = data.projectLink || null;
  if (data.deliverables !== undefined) row.deliverables = data.deliverables;
  if (data.clientScope !== undefined) row.client_scope = data.clientScope || null;
  if (data.year !== undefined) row.year = data.year || '2026';
  row.updated_at = new Date().toISOString();

  return row as Partial<SupabaseProjectRow>;
}

/**
 * Fetch all published projects for the public portfolio.
 * Merges Supabase projects with baseline STUDIO_PROJECTS safely without duplicates.
 */
function getDeletedSlugs(): string[] {
  try {
    const raw = localStorage.getItem('kcnexus_deleted_project_slugs');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function getPublishedProjects(): Promise<ProjectRecord[]> {
  const deletedSlugs = getDeletedSlugs();
  const baseProjects: ProjectRecord[] = STUDIO_PROJECTS
    .filter((p) => !deletedSlugs.includes(p.slug))
    .map((p) => ({
      ...p,
      status: 'published' as const,
    }));

  if (!isSupabaseConfigured()) {
    return baseProjects;
  }

  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase projects fetch warning:', error.message);
      return baseProjects;
    }

    if (!data || data.length === 0) {
      return baseProjects;
    }

    const dbProjects = data
      .map((row) => mapRowToRecord(row as SupabaseProjectRow))
      .filter((p) => !deletedSlugs.includes(p.slug));

    // Merge without duplicates (Supabase custom projects override baseline if same slug or id)
    const projectMap = new Map<string, ProjectRecord>();
    baseProjects.forEach((p) => projectMap.set(p.slug, p));
    dbProjects.forEach((p) => projectMap.set(p.slug, p));

    return Array.from(projectMap.values());
  } catch (err) {
    console.warn('Error retrieving published projects, serving baseline:', err);
    return baseProjects;
  }
}

/**
 * Fetch a single published project by its URL slug
 */
export async function getProjectBySlug(slug: string): Promise<ProjectRecord | null> {
  const published = await getPublishedProjects();
  return published.find((p) => p.slug === slug) || null;
}

/**
 * Fetch all projects (published and drafts) for authorized administrators.
 */
export async function getAllProjectsForAdmin(): Promise<ProjectRecord[]> {
  const deletedSlugs = getDeletedSlugs();
  const baseProjects: ProjectRecord[] = STUDIO_PROJECTS
    .filter((p) => !deletedSlugs.includes(p.slug))
    .map((p) => ({
      ...p,
      status: 'published' as const,
    }));

  if (!isSupabaseConfigured()) {
    return baseProjects;
  }

  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase admin projects fetch warning:', error.message);
      return baseProjects;
    }

    if (!data || data.length === 0) {
      return baseProjects;
    }

    const dbProjects = data
      .map((row) => mapRowToRecord(row as SupabaseProjectRow))
      .filter((p) => !deletedSlugs.includes(p.slug));

    const projectMap = new Map<string, ProjectRecord>();
    baseProjects.forEach((p) => projectMap.set(p.slug, p));
    dbProjects.forEach((p) => projectMap.set(p.slug, p));

    return Array.from(projectMap.values());
  } catch (err) {
    console.warn('Error loading admin projects, serving baseline:', err);
    return baseProjects;
  }
}

/**
 * Create a new project in Supabase database
 */
export async function createProject(
  projectData: Omit<ProjectRecord, 'id' | 'createdAt' | 'updatedAt'>
): Promise<ProjectSaveResult> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase publishable key is not configured. Please set VITE_SUPABASE_ANON_KEY in Google AI Studio.');
  }

  const customSlug = projectData.slug || projectData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const now = new Date().toISOString();

  const rowPayload: Partial<SupabaseProjectRow> = {
    ...mapRecordToRow(projectData),
    slug: customSlug,
    created_at: now,
    updated_at: now,
  };

  const { data, error } = await supabase
    .from('projects')
    .insert([rowPayload])
    .select()
    .single();

  if (error) {
    console.error('Supabase createProject error:', error);
    throw new Error(`Failed to create project: ${error.message}`);
  }

  return {
    id: data.id,
    syncedToCloud: true,
    message: 'Project created and saved to Supabase.',
  };
}

/**
 * Update an existing project in Supabase database
 */
export async function updateProject(
  idOrSlug: string,
  projectData: Partial<ProjectRecord>
): Promise<ProjectSaveResult> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase publishable key is not configured.');
  }

  const rowPayload = mapRecordToRow(projectData);

  // Attempt update by id or by slug
  let updateQuery = supabase
    .from('projects')
    .update(rowPayload);

  if (idOrSlug.includes('-') && idOrSlug.length > 20) {
    updateQuery = updateQuery.eq('id', idOrSlug);
  } else {
    updateQuery = updateQuery.or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`);
  }

  const { data, error } = await updateQuery.select().single();

  if (error) {
    // If updating a baseline project that didn't exist in Supabase yet, insert it!
    const baseline = STUDIO_PROJECTS.find((p) => p.id === idOrSlug || p.slug === idOrSlug);
    if (baseline) {
      const merged = { ...baseline, ...projectData, status: projectData.status || 'published' };
      return createProject(merged as Omit<ProjectRecord, 'id' | 'createdAt' | 'updatedAt'>);
    }

    console.error('Supabase updateProject error:', error);
    throw new Error(`Failed to update project: ${error.message}`);
  }

  return {
    id: data?.id || idOrSlug,
    syncedToCloud: true,
    message: 'Project updated successfully in Supabase.',
  };
}

/**
 * Check if a storage asset is referenced by another project in the database.
 * Used before deleting storage objects to avoid breaking other projects sharing the same media.
 * Normalizes image and video URLs to their canonical relative paths for exact comparison,
 * avoiding SQL wildcard injection (_ and %) and substring false-positive matches.
 */
export async function isMediaReferencedByOtherProject(
  relativePath: string,
  excludeId?: string,
  excludeSlug?: string
): Promise<boolean> {
  if (!isSupabaseConfigured() || !relativePath) return false;

  const targetPath = relativePath.trim();
  if (!targetPath) return false;

  try {
    let query = supabase
      .from('projects')
      .select('id, slug, image, video_url');

    if (excludeId) {
      query = query.neq('id', excludeId);
    }
    if (excludeSlug) {
      query = query.neq('slug', excludeSlug);
    }

    const { data, error } = await query;
    if (error) {
      console.warn('Error checking other project references for media:', error.message);
      // Fail-safe: if query cannot be verified, assume in use to avoid accidental deletion
      return true;
    }

    if (!data || data.length === 0) {
      return false;
    }

    // Exact normalized path comparison across other projects
    return data.some((row) => {
      const rowImagePath = extractPortfolioStoragePath(row.image);
      const rowVideoPath = extractPortfolioStoragePath(row.video_url);
      return rowImagePath === targetPath || rowVideoPath === targetPath;
    });
  } catch (err) {
    console.warn('Reference check exception:', err);
    return true; // Fail-safe
  }
}

/**
 * Delete a project from Supabase database and safely clean up associated Storage media.
 * Follows the strict order:
 * 1. Verify authorized Supabase administrator session.
 * 2. Pre-read the project's image and video URLs before database deletion.
 * 3. Delete the database record and verify deletion succeeded.
 * 4. For each media URL belonging to portfolio-media bucket, verify it's not a baseline asset
 *    and not referenced by another project before removing from Storage.
 * 5. Report full success or clear partial success.
 */
export async function deleteProject(
  idOrSlug: string,
  optionalSlug?: string
): Promise<ProjectDeleteResult> {
  const cleanId = (idOrSlug || '').trim();
  const cleanSlug = (optionalSlug || idOrSlug || '').trim();

  if (!cleanId && !cleanSlug) {
    throw new Error('Project ID or slug is required for deletion.');
  }

  // 1. Verify authorized Supabase administrator session
  if (!isSupabaseConfigured()) {
    return {
      success: true,
      message: 'Project removed locally (Supabase not configured).',
      databaseDeleted: false,
      mediaCleaned: [],
      mediaSkipped: [],
      mediaFailed: [],
    };
  }

  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) {
    throw new Error(`Authentication check failed: ${sessionError.message}`);
  }

  const user = sessionData?.session?.user;
  if (!user) {
    throw new Error(
      'Supabase session required: You are currently in local preview mode. Please click "Connect Supabase" in the header to authenticate before deleting projects.'
    );
  }

  const userEmail = (user.email || '').toLowerCase().trim();
  const isAdminUser = userEmail === PRIMARY_ADMIN_EMAIL.toLowerCase() || user.app_metadata?.role === 'admin';
  if (!isAdminUser) {
    throw new Error(
      `Permission denied: Only the authorized studio administrator (${PRIMARY_ADMIN_EMAIL}) can delete projects.`
    );
  }

  // 2. Pre-read target project's image and video URLs before database deletion
  let targetImage: string | null = null;
  let targetVideo: string | null = null;
  let dbProjectId: string | null = null;
  let dbProjectSlug: string | null = null;

  try {
    let selectQuery = supabase.from('projects').select('id, slug, image, video_url');
    if (cleanId && cleanSlug && cleanId !== cleanSlug) {
      selectQuery = selectQuery.or(`id.eq.${cleanId},slug.eq.${cleanSlug}`);
    } else if (cleanId) {
      selectQuery = selectQuery.or(`id.eq.${cleanId},slug.eq.${cleanId}`);
    } else {
      selectQuery = selectQuery.eq('slug', cleanSlug);
    }

    const { data: existingRows, error: readError } = await selectQuery.limit(1);
    if (!readError && existingRows && existingRows.length > 0) {
      const row = existingRows[0];
      targetImage = row.image || null;
      targetVideo = row.video_url || null;
      dbProjectId = row.id;
      dbProjectSlug = row.slug;
    }
  } catch (readErr) {
    console.warn('Could not pre-read project media references prior to deletion:', readErr);
  }

  // Record deleted slug in localStorage so baseline showcase projects do not reappear
  try {
    const key = 'kcnexus_deleted_project_slugs';
    const existing = localStorage.getItem(key);
    const list: string[] = existing ? JSON.parse(existing) : [];
    const slugToRecord = dbProjectSlug || cleanSlug;
    if (slugToRecord && !list.includes(slugToRecord)) {
      list.push(slugToRecord);
      localStorage.setItem(key, JSON.stringify(list));
    }
  } catch (e) {
    console.warn('Could not record deleted slug in localStorage:', e);
  }

  // 3. Delete database record first and confirm deletion succeeded
  let deleteQuery = supabase.from('projects').delete();
  if (cleanId && cleanSlug && cleanId !== cleanSlug) {
    deleteQuery = deleteQuery.or(`id.eq.${cleanId},slug.eq.${cleanSlug}`);
  } else if (cleanId) {
    deleteQuery = deleteQuery.or(`id.eq.${cleanId},slug.eq.${cleanId}`);
  } else {
    deleteQuery = deleteQuery.eq('slug', cleanSlug);
  }

  const { error: deleteError } = await deleteQuery;

  if (deleteError) {
    console.warn('Supabase deleteProject warning:', deleteError.message);
    let friendly = deleteError.message;
    if (deleteError.code === '42501' || deleteError.message.toLowerCase().includes('row-level security')) {
      friendly =
        'Permission denied: Supabase Row-Level Security policy restricts project deletion to the authorized administrator (okoobenikelechisalvation@gmail.com).';
    }
    throw new Error(friendly);
  }

  const databaseDeleted = true;

  // 4. Clean up associated media files in Storage
  const mediaCleaned: string[] = [];
  const mediaSkipped: string[] = [];
  const mediaFailed: Array<{ path: string; error: string }> = [];

  const mediaCandidates: string[] = [];
  if (targetImage) mediaCandidates.push(targetImage);
  if (targetVideo) mediaCandidates.push(targetVideo);

  for (const rawUrl of mediaCandidates) {
    const relativePath = extractPortfolioStoragePath(rawUrl);
    if (!relativePath) {
      mediaSkipped.push(`${rawUrl} (external URL or non-portfolio asset)`);
      continue;
    }

    // Check if it's a baseline asset
    const isBaseline = STUDIO_PROJECTS.some(
      (bp) =>
        (bp.image && bp.image.includes(relativePath)) ||
        (bp.videoUrl && bp.videoUrl.includes(relativePath))
    );
    if (isBaseline) {
      mediaSkipped.push(`${relativePath} (protected baseline asset)`);
      continue;
    }

    // Check if referenced by another project in the database
    const inUseElsewhere = await isMediaReferencedByOtherProject(
      relativePath,
      dbProjectId || cleanId,
      dbProjectSlug || cleanSlug
    );
    if (inUseElsewhere) {
      mediaSkipped.push(`${relativePath} (referenced by another project)`);
      continue;
    }

    // Safe to remove from Supabase Storage
    const removeResult = await deletePortfolioMedia(relativePath);
    if (removeResult.success && !removeResult.skipped) {
      mediaCleaned.push(relativePath);
    } else if (removeResult.skipped) {
      mediaSkipped.push(`${relativePath} (${removeResult.reason || 'skipped'})`);
    } else {
      mediaFailed.push({
        path: relativePath,
        error: removeResult.error || 'Failed to remove from storage',
      });
    }
  }

  // 5. Build accurate summary message
  let summaryMessage = 'Project deleted successfully.';
  if (mediaFailed.length > 0) {
    summaryMessage = `Project database record was deleted successfully, but ${mediaFailed.length} storage file(s) could not be removed (${mediaFailed.map((f) => f.path).join(', ')}).`;
  } else if (mediaCleaned.length > 0) {
    summaryMessage = `Project deleted and ${mediaCleaned.length} storage file(s) cleaned up successfully.`;
  }

  return {
    success: true,
    message: summaryMessage,
    databaseDeleted,
    mediaCleaned,
    mediaSkipped,
    mediaFailed,
  };
}

/**
 * Seed baseline studio showcase projects into Supabase database
 */
export async function seedInitialProjects(): Promise<number> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase publishable key is not configured. Please set VITE_SUPABASE_ANON_KEY.');
  }

  let count = 0;
  for (const proj of STUDIO_PROJECTS) {
    try {
      await createProject({
        ...proj,
        status: 'published',
      });
      count++;
    } catch (e) {
      console.warn(`Project ${proj.slug} seed notice:`, e);
    }
  }

  return count;
}

