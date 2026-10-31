import { describe, it, expect } from "vitest";
import { normalizeText, convertBanglaToEnglishDigits, convertEnglishToBanglaDigits } from "../../src/lib/bangla/normalizer";

describe("Bangla Text & Digit Normalizer Utility", () => {
  it("should normalize text with NFC and trim/lowercase", () => {
    const input = "  নাপা এক্সট্রা ৫০০ মিগ্রা  ";
    const result = normalizeText(input);
    expect(result).toBe("নাপা এক্সট্রা ৫০০ মিগ্রা");
  });

  it("should convert Bangla digits to English digits correctly", () => {
    const input = "নাপা ৫৫০ মিলিগ্রাম - ১০টি";
    const result = convertBanglaToEnglishDigits(input);
    expect(result).toBe("নাপা 550 মিলিগ্রাম - 10টি");
  });

  it("should convert English digits to Bangla digits correctly", () => {
    const input = "Napa 500mg - 10 tablets";
    const result = convertEnglishToBanglaDigits(input);
    expect(result).toBe("Napa ৫০০mg - ১০ tablets");
  });
});