import { describe, it, expect } from "vitest";
import { validateUploadedFile, ALLOWED_IMAGE_TYPES, MAX_FILE_SIZE_BYTES } from "../../src/lib/security/upload";

describe("Secure File Upload Validator", () => {
  it("should accept valid image files (JPEG, PNG, WebP) within size limit", () => {
    const validFile = {
      name: "prescription.jpg",
      size: 2 * 1024 * 1024, // 2 MB
      type: "image/jpeg",
    };

    const result = validateUploadedFile(validFile);
    expect(result.isValid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it("should reject files exceeding the maximum size limit (5 MB)", () => {
    const oversizedFile = {
      name: "large-scan.png",
      size: 6 * 1024 * 1024, // 6 MB
      type: "image/png",
    };

    const result = validateUploadedFile(oversizedFile);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain("৫ মেগাবাইটের বেশি");
  });

  it("should reject unauthorized file types (e.g., .exe, .svg, .html)", () => {
    const invalidTypeFile = {
      name: "script.exe",
      size: 1 * 1024 * 1024,
      type: "application/x-msdownload",
    };

    const result = validateUploadedFile(invalidTypeFile);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain("নিষিদ্ধ ফাইল ফরম্যাট");
  });
});