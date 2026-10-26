import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './config';
import { STUDIO_PROJECTS, ProjectItem, PortfolioCategory } from '../data/studioData';
import { parseAndConvertVideoUrl, validateImageUrl } from '../utils/mediaUtils';

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

const COLLECTION_NAME = 'projects';
const LOCAL_STORAGE_KEY = 'kcnexus_custom_projects';

const inMemoryCustomProjects = new Map<string, ProjectRecord>();

/**
 * Local Storage & memory persistence helpers to ensure projects never get lost
 * even when Cloud Firestore authentication is not present in the preview iframe.
 */
export function getLocalCustomProjects(): ProjectRecord[] {
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (raw) {
        const parsed: ProjectRecord[] = JSON.parse(raw);
        parsed.forEach((p) => {
          if (!inMemoryCustomProjects.has(p.id)) {
            inMemoryCustomProjects.set(p.id, p);
          }
        });
      }
    } catch (e) {
      console.warn('Could not read local custom projects:', e);
    }
  }
  return Array.from(inMemoryCustomProjects.values());
}

export function saveLocalCustomProject(project: ProjectRecord): void {
  inMemoryCustomProjects.set(project.id, project);
  if (typeof window !== 'undefined') {
    try {
      const all = Array.from(inMemoryCustomProjects.values());
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(all));
    } catch (e) {
      console.warn('Could not save local custom project:', e);
    }
  }
}

export function deleteLocalCustomProject(idOrSlug: string): void {
  inMemoryCustomProjects.delete(idOrSlug);
  for (const [key, val] of inMemoryCustomProjects.entries()) {
    if (val.slug === idOrSlug || val.id === idOrSlug) {
      inMemoryCustomProjects.delete(key);
    }
  }
  if (typeof window !== 'undefined') {
    try {
      const all = Array.from(inMemoryCustomProjects.values());
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(all));
    } catch (e) {
      console.warn('Could not delete local custom project:', e);
    }
  }
}

/**
 * Fetch all published projects for the public portfolio.
 * Combines Firestore (if accessible), Local Custom projects, and baseline STUDIO_PROJECTS.
 */
export async function getPublishedProjects(): Promise<ProjectRecord[]> {
  const localPublished = getLocalCustomProjects().filter((p) => p.status === 'published');
  const baseProjects: ProjectRecord[] = STUDIO_PROJECTS.map((p) => ({
    ...p,
    status: 'published' as const,
  }));

  try {
    const q = query(collection(db, COLLECTION_NAME), where('status', '==', 'published'));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      // Merge local with base
      const projectMap = new Map<string, ProjectRecord>();
      baseProjects.forEach((p) => projectMap.set(p.id, p));
      localPublished.forEach((p) => projectMap.set(p.id, p));
      return Array.from(projectMap.values());
    }

    const firestoreProjects: ProjectRecord[] = [];
    snapshot.forEach((docSnap) => {
      firestoreProjects.push({
        id: docSnap.id,
        ...(docSnap.data() as Omit<ProjectRecord, 'id'>),
      });
    });

    const projectMap = new Map<string, ProjectRecord>();
    baseProjects.forEach((p) => projectMap.set(p.id, p));
    firestoreProjects.forEach((p) => projectMap.set(p.id, p));
    localPublished.forEach((p) => projectMap.set(p.id, p));
    return Array.from(projectMap.values());
  } catch (error) {
    console.info('Loading published projects from local storage and studio data fallback:', error);
    const projectMap = new Map<string, ProjectRecord>();
    baseProjects.forEach((p) => projectMap.set(p.id, p));
    localPublished.forEach((p) => projectMap.set(p.id, p));
    return Array.from(projectMap.values());
  }
}

/**
 * Fetch ALL projects (both published and drafts) for authorized admin.
 * Resilient against permission errors: gracefully returns all available projects.
 */
export async function getAllProjectsForAdmin(): Promise<ProjectRecord[]> {
  const localProjects = getLocalCustomProjects();
  const baseProjects: ProjectRecord[] = STUDIO_PROJECTS.map((p) => ({
    ...p,
    status: 'published' as const,
  }));

  const projectMap = new Map<string, ProjectRecord>();
  baseProjects.forEach((p) => projectMap.set(p.id, p));
  localProjects.forEach((p) => projectMap.set(p.id, p));

  try {
    const snapshot = await getDocs(collection(db, COLLECTION_NAME));
    snapshot.forEach((docSnap) => {
      projectMap.set(docSnap.id, {
        id: docSnap.id,
        ...(docSnap.data() as Omit<ProjectRecord, 'id'>),
      });
    });
    return Array.from(projectMap.values());
  } catch (error) {
    console.info('Cloud Firestore list returned permission status; loaded local & base projects successfully:', error);
    // Return all base + local projects without crashing
    return Array.from(projectMap.values());
  }
}

/**
 * Fetch a single project by slug.
 */
export async function getProjectBySlug(slug: string): Promise<ProjectRecord | null> {
  // Check local custom projects first
  const localFound = getLocalCustomProjects().find((p) => p.slug === slug || p.id === slug);
  if (localFound) return localFound;

  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('slug', '==', slug)
    );
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const docSnap = snapshot.docs[0];
      return {
        id: docSnap.id,
        ...(docSnap.data() as Omit<ProjectRecord, 'id'>),
      };
    }
  } catch (error) {
    console.warn('Could not query project by slug from Firestore:', error);
  }

  // Fallback to static base projects
  const staticProject = STUDIO_PROJECTS.find((p) => p.slug === slug || p.id === slug);
  return staticProject ? { ...staticProject, status: 'published' } : null;
}

export interface ProjectSaveResult {
  id: string;
  syncedToCloud: boolean;
  message?: string;
}

/**
 * Create a new project document.
 * Persists to local browser storage immediately, then attempts to sync to Cloud Firestore.
 */
export async function createProject(
  data: Omit<ProjectRecord, 'id' | 'createdAt' | 'updatedAt'>
): Promise<ProjectSaveResult> {
  const customId = data.slug.toLowerCase().replace(/[^a-z0-9-_]/g, '-');
  const now = new Date().toISOString();

  // Validate image: explicitly prevent Base64 strings in database
  let sanitizedImage = data.image ? data.image.trim() : '';
  if (sanitizedImage.startsWith('data:')) {
    throw new Error('Base64 data URLs cannot be saved. Please paste a direct HTTP/HTTPS link from ImgBB or an external host.');
  }

  // Canonicalize YouTube video URLs to embeddable URLs
  let sanitizedVideoUrl = data.videoUrl ? data.videoUrl.trim() : '';
  if (sanitizedVideoUrl) {
    const videoParsed = parseAndConvertVideoUrl(sanitizedVideoUrl);
    if (videoParsed.isValid && videoParsed.embedUrl) {
      sanitizedVideoUrl = videoParsed.embedUrl;
    }
  }

  const fullRecord: ProjectRecord = {
    ...data,
    id: customId,
    image: sanitizedImage,
    videoUrl: sanitizedVideoUrl,
    createdAt: now,
    updatedAt: now,
  };

  // 1. Immediately persist to local custom store (100% reliable)
  saveLocalCustomProject(fullRecord);

  // 2. Attempt Cloud Firestore synchronization
  const docRef = doc(db, COLLECTION_NAME, customId);
  const payload: Omit<ProjectRecord, 'id'> = {
    slug: fullRecord.slug,
    title: fullRecord.title,
    category: fullRecord.category,
    filterCategory: fullRecord.filterCategory,
    description: fullRecord.description,
    fullOverview: fullRecord.fullOverview,
    image: fullRecord.image,
    videoUrl: fullRecord.videoUrl,
    projectLink: fullRecord.projectLink,
    deliverables: fullRecord.deliverables,
    clientScope: fullRecord.clientScope,
    year: fullRecord.year,
    status: fullRecord.status,
    createdAt: now,
    updatedAt: now,
  };

  try {
    await setDoc(docRef, payload);
    return {
      id: customId,
      syncedToCloud: true,
      message: 'Project created and synced to Cloud Firestore.',
    };
  } catch (error) {
    console.info('Project saved locally; Cloud Firestore rejected write (requires admin Google sign-in):', error);
    return {
      id: customId,
      syncedToCloud: false,
      message: 'Project saved and active in portfolio. (Cloud Firestore sync requires Google admin login).',
    };
  }
}

/**
 * Update an existing project document.
 * Persists locally and attempts Cloud Firestore update.
 */
export async function updateProject(
  id: string,
  updates: Partial<Omit<ProjectRecord, 'id' | 'createdAt'>>
): Promise<ProjectSaveResult> {
  const now = new Date().toISOString();

  const sanitizedUpdates: Partial<Omit<ProjectRecord, 'id' | 'createdAt'>> = {
    ...updates,
    updatedAt: now,
  };

  if (updates.image !== undefined) {
    const trimmed = (updates.image || '').trim();
    if (trimmed.startsWith('data:')) {
      throw new Error('Base64 data URLs cannot be saved. Please paste a direct HTTP/HTTPS link from ImgBB or an external host.');
    }
    sanitizedUpdates.image = trimmed;
  }

  if (updates.videoUrl !== undefined) {
    const trimmedVideo = (updates.videoUrl || '').trim();
    if (trimmedVideo) {
      const videoParsed = parseAndConvertVideoUrl(trimmedVideo);
      sanitizedUpdates.videoUrl = videoParsed.isValid && videoParsed.embedUrl ? videoParsed.embedUrl : trimmedVideo;
    } else {
      sanitizedUpdates.videoUrl = '';
    }
  }

  // 1. Update local custom store
  const existingLocal = getLocalCustomProjects().find((p) => p.id === id);
  if (existingLocal) {
    saveLocalCustomProject({
      ...existingLocal,
      ...sanitizedUpdates,
    });
  }

  // 2. Attempt Cloud Firestore update
  const docRef = doc(db, COLLECTION_NAME, id);
  try {
    await updateDoc(docRef, sanitizedUpdates);
    return {
      id,
      syncedToCloud: true,
      message: 'Project updated in Cloud Firestore.',
    };
  } catch (error) {
    console.info('Project updated locally; Cloud Firestore rejected update (requires admin Google sign-in):', error);
    return {
      id,
      syncedToCloud: false,
      message: 'Project updated locally in portfolio.',
    };
  }
}

/**
 * Delete a project document.
 */
export async function deleteProject(id: string): Promise<void> {
  // 1. Delete from local store
  deleteLocalCustomProject(id);

  // 2. Attempt Firestore delete
  const docRef = doc(db, COLLECTION_NAME, id);
  try {
    await deleteDoc(docRef);
  } catch (error) {
    console.info('Project deleted locally; Cloud Firestore rejected delete (requires admin Google sign-in):', error);
  }
}

/**
 * Seed initial 9 projects from studioData.ts into Firestore.
 */
export async function seedInitialProjects(): Promise<number> {
  let seededCount = 0;
  const now = new Date().toISOString();

  for (const p of STUDIO_PROJECTS) {
    const id = p.id;
    const docRef = doc(db, COLLECTION_NAME, id);
    const payload: Omit<ProjectRecord, 'id'> = {
      slug: p.slug,
      title: p.title,
      category: p.category,
      filterCategory: p.filterCategory,
      description: p.description,
      fullOverview: p.fullOverview,
      image: p.image || '',
      videoUrl: p.videoUrl || '',
      projectLink: p.projectLink || '',
      deliverables: p.deliverables || [],
      clientScope: p.clientScope || '',
      year: p.year || '2026',
      status: 'published',
      createdAt: now,
      updatedAt: now,
    };

    try {
      await setDoc(docRef, payload);
      seededCount++;
    } catch (err) {
      console.error(`Failed to seed project ${id}:`, err);
    }
  }

  return seededCount;
}
