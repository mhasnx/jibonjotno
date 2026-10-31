/**
 * JibonJotno (জীবনযত্ন) — Educational Video Validator
 * Section 8.1: Validate YouTube URLs and video metadata.
 */

export interface VideoMetadata {
  title: string;
  youtubeUrl: string;
  durationSeconds: number;
}

export interface VideoValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * ইউটিউব ভিডিও ইউআরএল সঠিক কি না তা যাচাই করার ফাংশন।
 */
export function validateYouTubeUrl(url: string): boolean {
  if (!url) return false;
  // YouTube standard & short domain regex check
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/)|youtu\.be\/)[a-zA-Z0-9_-]{11}$/;
  return youtubeRegex.test(url);
}

/**
 * ভিডিও মেটাডেটা ভ্যালিডেশন
 */
export function validateVideoMetadata(video: VideoMetadata): VideoValidationResult {
  if (!video.title || video.title.trim().length < 3) {
    return { isValid: false, error: "ভিডিওর শিরোনাম কমপক্ষে ৩ অক্ষরের হতে হবে।" };
  }

  if (!validateYouTubeUrl(video.youtubeUrl)) {
    return { isValid: false, error: "সঠিক ইউটিউব ভিডিওর ইউআরএল প্রদান করুন।" };
  }

  if (!video.durationSeconds || video.durationSeconds <= 0) {
    return { isValid: false, error: "ভিডিওর স্থায়িত্ব (duration) সঠিক হতে হবে।" };
  }

  return { isValid: true };
}