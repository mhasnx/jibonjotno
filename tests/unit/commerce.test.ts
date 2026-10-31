import { describe, it, expect } from "vitest";
import { getCommerceStatus } from "../../src/lib/commerce/config";

describe("Pharmacy Commerce Feature Flag Utility", () => {
  it("should have commerce disabled by default under test mode", () => {
    const status = getCommerceStatus();
    expect(status.isCommerceEnabled).toBe(false);
    expect(status.testModeBanner).toBe(true);
    expect(status.legalVerificationStatus).toBe("PENDING_VERIFY_PRO");
  });
});