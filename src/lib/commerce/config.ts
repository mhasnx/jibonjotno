/**
 * JibonJotno (জীবনযত্ন) — Online Pharmacy Commerce Configuration & Feature Flags
 * Section 9.1: COMMERCE_ENABLED lock and legal verification [VERIFY-PRO]
 */

export interface CommerceStatus {
  isCommerceEnabled: boolean;
  testModeBanner: boolean;
  legalVerificationStatus: string;
}

/**
 * বর্তমান কমার্স স্ট্যাটাস এবং ফিচার ফ্ল্যাগ চেক করার ফাংশন।
 */
export function getCommerceStatus(): CommerceStatus {
  // লিগ্যাল ভেরিফিকেশন সম্পন্ন হওয়ার আগ পর্যন্ত কমার্স লক থাকবে
  const isEnabled = process.env.COMMERCE_ENABLED === "true";
  const testMode = process.env.TEST_MODE_BANNER !== "false";

  return {
    isCommerceEnabled: isEnabled,
    testModeBanner: testMode,
    legalVerificationStatus: isEnabled ? "VERIFIED" : "PENDING_VERIFY_PRO",
  };
}