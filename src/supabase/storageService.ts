import { supabase, PORTFOLIO_STORAGE_BUCKET, SUPABASE_URL, isSupabaseConfigured } from './client';
import { STUDIO_PROJECTS } from '../data/studioData';

export interface MediaUploadResult {
  success: boolean;
  publicUrl?: string;
  storagePath?: string;
  error?: string;
}

export interface MediaDeleteResult {
  path: string;
  success: boolean;
  error?: string;
  skipped?: boolean;
  reason?: string;
}

// Supported media formats
export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/svg+xml',
  'image/gif',
];

export const ALLOWED_VIDEO_TYPES = [
  'video/mp4',
  'video/webm',
  'video/quicktime', // .mov
  'video/ogg',
];

const MAX_IMAGE_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB
const MAX_VIDEO_SIZE_BYTES = 150 * 1024 * 1024; // 150 MB

/**
 * Validate media file format and size before uploading
 */
export function validateMediaFile(
  file: File,
  type: 'image' | 'video'
): { isValid: boolean; error?: string } {
  if (!file) {
    return { isValid: false, error: 'No file selected.' };
  }

  const fileName = file.name.toLowerCase();
  const mimeType = file.type.toLowerCase();

  if (type === 'image') {
    const isImageExt = /\.(jpg|jpeg|png|webp|svg|gif)$/i.test(fileName);
    const isImageMime = ALLOWED_IMAGE_TYPES.includes(mimeType) || mimeType.startsWith('image/');

    if (!isImageExt && !isImageMime) {
      return {
        isValid: false,
        error: 'Unsupported image format. Allowed formats: JPG, PNG, WEBP, SVG, GIF.',
      };
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      return {
        isValid: false,
        error: `Image size (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds maximum limit of 25MB.`,
      };
    }
  }

  if (type === 'video') {
    const isVideoExt = /\.(mp4|webm|mov|ogg)$/i.test(fileName);
    const isVideoMime = ALLOWED_VIDEO_TYPES.includes(mimeType) || mimeType.startsWith('video/');

    if (!isVideoExt && !isVideoMime) {
      return {
        isValid: false,
        error: 'Unsupported video format. Allowed formats: MP4, WebM, QuickTime MOV.',
      };
    }

    if (file.size > MAX_VIDEO_SIZE_BYTES) {
      return {
        isValid: false,
        error: `Video size (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds maximum limit of 150MB.`,
      };
    }
  }

  return { isValid: true };
}

/**
 * Upload an image or video directly to the Supabase "portfolio-media" Storage bucket.
 * Returns the permanent public CDN URL to store in the project database record.
 */
export async function uploadPortfolioMedia(
  file: File,
  folder: 'images' | 'videos',
  projectSlug?: string
): Promise<MediaUploadResult> {
  if (!isSupabaseConfigured()) {
    return {
      success: false,
      error: 'Supabase publishable key is not yet configured. Please set VITE_SUPABASE_ANON_KEY.',
    };
  }

  // Validate file format and size
  const validation = validateMediaFile(file, folder === 'images' ? 'image' : 'video');
  if (!validation.isValid) {
    return { success: false, error: validation.error };
  }

  try {
    // Determine clean file extension
    const originalName = file.name || 'file';
    const lastDotIndex = originalName.lastIndexOf('.');
    const cleanExt = lastDotIndex !== -1
      ? originalName.substring(lastDotIndex + 1).toLowerCase().replace(/[^a-z0-9]/g, '')
      : (folder === 'images' ? 'jpg' : 'mp4');

    // Extract clean base name without extension
    const rawBaseName = lastDotIndex !== -1 ? originalName.substring(0, lastDotIndex) : originalName;
    const cleanBaseName = rawBaseName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 32) || 'media';

    // Extract clean slug
    const cleanSlug = (projectSlug || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 32);

    const safeFolder = folder === 'videos' ? 'videos' : 'images';
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const fileName = cleanSlug
      ? `${cleanSlug}-${cleanBaseName}-${Date.now()}-${randomSuffix}.${cleanExt}`
      : `${cleanBaseName}-${Date.now()}-${randomSuffix}.${cleanExt}`;

    const uniquePath = `${safeFolder}/${fileName}`;

    // Check if authenticated session exists
    const { data: sessionData } = await supabase.auth.getSession();
    const hasActiveSession = Boolean(sessionData?.session?.user);

    // Upload to Supabase Storage with explicit content-type and upsert: false (only requires INSERT RLS policy)
    const { data, error: uploadError } = await supabase.storage
      .from(PORTFOLIO_STORAGE_BUCKET)
      .upload(uniquePath, file, {
        contentType: file.type || (folder === 'images' ? 'image/jpeg' : 'video/mp4'),
        cacheControl: '31536000', // 1 year CDN cache
        upsert: false,
      });

    if (uploadError) {
      console.warn('Supabase Storage upload warning:', uploadError.message);
      let friendlyError = uploadError.message;
      if (
        uploadError.message.toLowerCase().includes('row-level security') ||
        uploadError.message.toLowerCase().includes('violates row-level') ||
        (uploadError as unknown as Record<string, unknown>).code === 'AccessDenied'
      ) {
        if (!hasActiveSession) {
          friendlyError =
            'Supabase authentication required: Direct uploads to "portfolio-media" require an active Supabase administrator session. Please sign in with your Supabase credentials in the header, or paste a direct image URL.';
        } else {
          friendlyError =
            'Upload restricted by Supabase Storage RLS policy. Please ensure the "portfolio-media" bucket policy permits INSERT for authenticated administrator okoobenikelechisalvation@gmail.com.';
        }
      }
      return {
        success: false,
        error: friendlyError,
      };
    }

    // Retrieve public URL from the public bucket
    const { data: publicUrlData } = supabase.storage
      .from(PORTFOLIO_STORAGE_BUCKET)
      .getPublicUrl(data.path);

    if (!publicUrlData || !publicUrlData.publicUrl) {
      return {
        success: false,
        error: 'File uploaded, but could not retrieve public URL.',
      };
    }

    return {
      success: true,
      publicUrl: publicUrlData.publicUrl,
      storagePath: data.path,
    };
  } catch (err: unknown) {
    console.error('Media upload exception:', err);
    const msg = err instanceof Error ? err.message : 'Storage upload encountered an unexpected error.';
    return { success: false, error: msg };
  }
}

/**
 * Extract relative storage path if the URL belongs to this project's "portfolio-media" bucket.
 * Returns null if it is an external URL (YouTube, Vimeo, external image), baseline asset, or invalid.
 */
export function extractPortfolioStoragePath(mediaUrl?: string | null): string | null {
  if (!mediaUrl || typeof mediaUrl !== 'string') return null;
  const trimmed = mediaUrl.trim();
  if (!trimmed) return null;

  // Pattern 1: Full Supabase Storage URL
  // e.g. https://...supabase.co/storage/v1/object/public/portfolio-media/images/file.jpg
  const bucketPrefix = `/storage/v1/object/public/${PORTFOLIO_STORAGE_BUCKET}/`;
  const idx = trimmed.indexOf(bucketPrefix);
  if (idx !== -1) {
    // If it is a full URL with scheme, verify the domain belongs to this project's exact Supabase instance
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      try {
        const parsed = new URL(trimmed);
        const projectHost = new URL(SUPABASE_URL).hostname.toLowerCase();
        if (parsed.hostname.toLowerCase() !== projectHost) {
          return null; // Reject all other hostnames, including other *.supabase.co projects
        }
      } catch {
        return null;
      }
    }

    const candidate = trimmed.substring(idx + bucketPrefix.length).split('?')[0].split('#')[0];
    if (candidate && (candidate.startsWith('images/') || candidate.startsWith('videos/'))) {
      if (/^[a-zA-Z0-9_\-\.\/]+$/.test(candidate) && !candidate.includes('..')) {
        return candidate;
      }
    }
  }

  // Pattern 2: Direct relative path inside the bucket
  if (trimmed.startsWith('images/') || trimmed.startsWith('videos/')) {
    const clean = trimmed.split('?')[0].split('#')[0];
    if (/^[a-zA-Z0-9_\-\.\/]+$/.test(clean) && !clean.includes('..')) {
      return clean;
    }
  }

  return null;
}

/**
 * Delete an image or video file directly from the Supabase "portfolio-media" Storage bucket.
 * Protects against deleting external URLs, baseline project assets, or invalid paths.
 */
export async function deletePortfolioMedia(
  mediaUrlOrPath: string
): Promise<MediaDeleteResult> {
  const relativePath = extractPortfolioStoragePath(mediaUrlOrPath);
  if (!relativePath) {
    return {
      path: mediaUrlOrPath,
      success: true,
      skipped: true,
      reason: 'Not a portfolio-media storage asset (external or baseline)',
    };
  }

  // Guard: Protect baseline studio assets
  const isBaseline = STUDIO_PROJECTS.some(
    (bp) =>
      (bp.image && bp.image.includes(relativePath)) ||
      (bp.videoUrl && bp.videoUrl.includes(relativePath))
  );
  if (isBaseline) {
    return {
      path: relativePath,
      success: true,
      skipped: true,
      reason: 'Protected baseline studio asset',
    };
  }

  if (!isSupabaseConfigured()) {
    return {
      path: relativePath,
      success: false,
      error: 'Supabase is not configured',
    };
  }

  try {
    const { error } = await supabase.storage
      .from(PORTFOLIO_STORAGE_BUCKET)
      .remove([relativePath]);

    if (error) {
      console.warn(`Supabase Storage remove warning for ${relativePath}:`, error.message);
      return {
        path: relativePath,
        success: false,
        error: error.message,
      };
    }

    return {
      path: relativePath,
      success: true,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Storage remove failed';
    return {
      path: relativePath,
      success: false,
      error: msg,
    };
  }
}
