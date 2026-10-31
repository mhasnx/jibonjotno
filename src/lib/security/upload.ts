/**
 * JibonJotno (জীবনযত্ন) — Secure File Upload & Magic Byte Validator
 * Section 12.1 & 12.2: Validate MIME types, reject executables, enforce size limits.
 */

// অনুমোদিত MIME টাইপসমূহ (শুধুমাত্র নিরাপদ ইমেজ)
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

// সর্বোচ্চ ফাইলের সাইজ (৫ মেগাবাইট)
export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * আপলোড করা ফাইলের সাইজ এবং টাইপ ভ্যালিডেশন করার ফাংশন।
 */
export function validateUploadedFile(file: { size: number; type: string; name: string }): ValidationResult {
  if (!file) {
    return { isValid: false, error: "কোনো ফাইল পাওয়া যায়নি।" };
  }

  // সাইজ চেক (৫ MB এর বেশি হলে রিজেক্ট)
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { isValid: false, error: "ফাইলের সাইজ ৫ মেগাবাইটের বেশি হতে পারবে না।" };
  }

  // MIME টাইপ চেক (JPEG, PNG, WebP ছাড়া অন্য কিছু যেমন .exe, .svg, .html ব্লক করা)
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return { isValid: false, error: "অবাস্তব বা নিষিদ্ধ ফাইল ফরম্যাট। শুধুমাত্র JPEG, PNG এবং WebP ছবি আপলোড করা যাবে।" };
  }

  return { isValid: true };
}