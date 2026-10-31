/**
 * JibonJotno (জীবনযত্ন) — Bangla Text & Digit Normalizer
 * Section 5.3: Normalize Unicode (NFC) and handle Bangla digits (০-৯) to English digits.
 */

// বাংলা সংখ্যা থেকে ইংরেজি সংখ্যায় রূপান্তর করার ম্যাপ
const banglaToEnglishMap: Record<string, string> = {
  '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
  '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9'
};

const englishToBanglaMap: Record<string, string> = {
  '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
  '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯'
};

/**
 * টেক্সটকে Unicode NFC ফরম্যাটে নরমাইজ করে এবং অতিরিক্ত হোয়াইটস্পেস দূর করে।
 */
export function normalizeText(input: string): string {
  if (!input) return "";
  return input.normalize("NFC").trim().toLowerCase();
}

/**
 * বাংলা সংখ্যাকে ইংরেজি সংখ্যায় রূপান্তর করে (সার্চ কুয়েরি ও ডোজের হিসেব সহজ করার জন্য)।
 */
export function convertBanglaToEnglishDigits(input: string): string {
  if (!input) return "";
  return input.replace(/[০-৯]/g, (match) => banglaToEnglishMap[match] || match);
}

/**
 * ইংরেজি সংখ্যাকে বাংলা সংখ্যায় রূপান্তর করে (পাবলিক ডিসপ্লে বা লোকাল ফরম্যাটের জন্য)।
 */
export function convertEnglishToBanglaDigits(input: string): string {
  if (!input) return "";
  return input.replace(/[0-9]/g, (match) => englishToBanglaMap[match] || match);
}