import { describe, it, expect } from "vitest";
import { validateYouTubeUrl, validateVideoMetadata } from "../../src/lib/video/validator";

describe("Educational Video Pipeline Validator", () => {
  it("should validate correct YouTube URLs", () => {
    expect(validateYouTubeUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe(true);
    expect(validateYouTubeUrl("https://youtu.be/dQw4w9WgXcQ")).toBe(true);
    expect(validateYouTubeUrl("https://invalid-url.com/video")).toBe(false);
  });

  it("should accept valid video metadata", () => {
    const validVideo = {
      title: "ডায়াবেটিস সচেতনতা ও প্রতিকার",
      youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      durationSeconds: 300,
    };
    const result = validateVideoMetadata(validVideo);
    expect(result.isValid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it("should reject video metadata with invalid YouTube URL", () => {
    const invalidVideo = {
      title: "উচ্চ রক্তচাপ নিয়ন্ত্রণ",
      youtubeUrl: "https://badurl.com/watch?v=123",
      durationSeconds: 120,
    };
    const result = validateVideoMetadata(invalidVideo);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain("ইউটিউব ভিডিওর ইউআরএল");
  });
});