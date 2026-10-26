/**
 * KC NEXUS - Media Utilities
 * Comprehensive URL validation, ImgBB detection, and YouTube conversion.
 */

export interface ImageValidationResult {
  isValid: boolean;
  isImgBB: boolean;
  error?: string;
  sanitizedUrl: string;
}

export interface VideoValidationResult {
  isValid: boolean;
  isEmbeddable: boolean;
  platform: 'youtube' | 'vimeo' | 'direct' | 'none';
  videoId?: string;
  embedUrl: string;
  error?: string;
}

/**
 * Validates external image URL.
 * - Enforces HTTP or HTTPS.
 * - Prevents raw data: Base64 strings from polluting Firestore.
 * - Identifies ImgBB direct links (i.ibb.co) or page links (ibb.co).
 */
export function validateImageUrl(rawUrl: string): ImageValidationResult {
  const trimmed = (rawUrl || '').trim();
  if (!trimmed) {
    return {
      isValid: false,
      isImgBB: false,
      error: 'Image URL is empty.',
      sanitizedUrl: '',
    };
  }

  // Reject Base64 data URLs to prevent Firestore 1MB document exhaustion and browser OOM
  if (trimmed.startsWith('data:')) {
    return {
      isValid: false,
      isImgBB: false,
      error: 'Base64 data URLs are not allowed. Please paste a direct HTTP/HTTPS image URL (e.g. from ImgBB).',
      sanitizedUrl: '',
    };
  }

  // Verify URL syntax
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(trimmed);
  } catch {
    return {
      isValid: false,
      isImgBB: false,
      error: 'Invalid URL format. Please include http:// or https://',
      sanitizedUrl: trimmed,
    };
  }

  if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
    return {
      isValid: false,
      isImgBB: false,
      error: 'Only HTTP and HTTPS protocols are allowed.',
      sanitizedUrl: trimmed,
    };
  }

  const host = parsedUrl.hostname.toLowerCase();
  const isImgBB = host.includes('ibb.co');

  return {
    isValid: true,
    isImgBB,
    sanitizedUrl: parsedUrl.toString(),
  };
}

/**
 * Validates and converts YouTube, Vimeo, or direct video streams into safe embed URLs.
 * Supports:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://m.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/shorts/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://vimeo.com/VIDEO_ID
 * - Direct MP4/WebM video links
 */
export function parseAndConvertVideoUrl(rawUrl: string): VideoValidationResult {
  const trimmed = (rawUrl || '').trim();
  if (!trimmed) {
    return {
      isValid: false,
      isEmbeddable: false,
      platform: 'none',
      embedUrl: '',
      error: 'Video URL is empty.',
    };
  }

  // Prevent data: URLs
  if (trimmed.startsWith('data:')) {
    return {
      isValid: false,
      isEmbeddable: false,
      platform: 'none',
      embedUrl: '',
      error: 'Base64 video URLs are not supported. Please paste a YouTube or video stream URL.',
    };
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(trimmed);
  } catch {
    return {
      isValid: false,
      isEmbeddable: false,
      platform: 'none',
      embedUrl: '',
      error: 'Invalid URL format. Please provide a full link starting with https://',
    };
  }

  if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
    return {
      isValid: false,
      isEmbeddable: false,
      platform: 'none',
      embedUrl: '',
      error: 'Only HTTP and HTTPS protocols are allowed.',
    };
  }

  const hostname = parsedUrl.hostname.toLowerCase();
  const pathname = parsedUrl.pathname;

  // 1. YouTube Shorts: youtube.com/shorts/VIDEO_ID
  if ((hostname.includes('youtube.com') || hostname === 'youtube.com') && pathname.includes('/shorts/')) {
    const parts = pathname.split('/shorts/');
    const id = parts[1]?.split('/')[0]?.split('?')[0];
    if (id && /^[a-zA-Z0-9_-]{6,15}$/.test(id)) {
      return {
        isValid: true,
        isEmbeddable: true,
        platform: 'youtube',
        videoId: id,
        embedUrl: `https://www.youtube-nocookie.com/embed/${id}?autoplay=0&rel=0`,
      };
    }
  }

  // 2. YouTube Standard: youtube.com/watch?v=VIDEO_ID or m.youtube.com/watch?v=VIDEO_ID
  if (hostname.includes('youtube.com') && pathname.includes('/watch')) {
    const vParam = parsedUrl.searchParams.get('v');
    if (vParam && /^[a-zA-Z0-9_-]{6,15}$/.test(vParam)) {
      return {
        isValid: true,
        isEmbeddable: true,
        platform: 'youtube',
        videoId: vParam,
        embedUrl: `https://www.youtube-nocookie.com/embed/${vParam}?autoplay=0&rel=0`,
      };
    }
  }

  // 3. YouTube Embed: youtube.com/embed/VIDEO_ID
  if (hostname.includes('youtube.com') && pathname.includes('/embed/')) {
    const parts = pathname.split('/embed/');
    const id = parts[1]?.split('/')[0]?.split('?')[0];
    if (id && /^[a-zA-Z0-9_-]{6,15}$/.test(id)) {
      return {
        isValid: true,
        isEmbeddable: true,
        platform: 'youtube',
        videoId: id,
        embedUrl: `https://www.youtube-nocookie.com/embed/${id}?autoplay=0&rel=0`,
      };
    }
  }

  // 4. YouTube Short Link: youtu.be/VIDEO_ID
  if (hostname.includes('youtu.be')) {
    const id = pathname.replace('/', '').split('/')[0]?.split('?')[0];
    if (id && /^[a-zA-Z0-9_-]{6,15}$/.test(id)) {
      return {
        isValid: true,
        isEmbeddable: true,
        platform: 'youtube',
        videoId: id,
        embedUrl: `https://www.youtube-nocookie.com/embed/${id}?autoplay=0&rel=0`,
      };
    }
  }

  // 5. Vimeo: vimeo.com/VIDEO_ID or player.vimeo.com/video/VIDEO_ID
  if (hostname.includes('vimeo.com')) {
    const matches = pathname.match(/(?:videos\/|video\/|^\/)([0-9]+)/);
    const vimeoId = matches ? matches[1] : pathname.replace(/[^0-9]/g, '');
    if (vimeoId) {
      return {
        isValid: true,
        isEmbeddable: true,
        platform: 'vimeo',
        videoId: vimeoId,
        embedUrl: `https://player.vimeo.com/video/${vimeoId}`,
      };
    }
  }

  // 6. Direct Video Stream (.mp4, .webm, .ogg)
  if (/\.(mp4|webm|ogg|m4v|mov)($|\?)/i.test(pathname)) {
    return {
      isValid: true,
      isEmbeddable: false,
      platform: 'direct',
      embedUrl: parsedUrl.toString(),
    };
  }

  // Fallback: general external URL
  return {
    isValid: true,
    isEmbeddable: false,
    platform: 'direct',
    embedUrl: parsedUrl.toString(),
  };
}

/**
 * Universal helper for checking if a URL is an iframe-embeddable video.
 */
export function isEmbedVideo(url?: string): boolean {
  if (!url) return false;
  const res = parseAndConvertVideoUrl(url);
  return res.isValid && res.isEmbeddable;
}

/**
 * Universal helper for returning the sanitized iframe embed URL.
 */
export function getEmbedVideoUrl(url?: string): string {
  if (!url) return '';
  const res = parseAndConvertVideoUrl(url);
  return res.embedUrl || url;
}
