import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword } from "../../src/lib/auth/password";

describe("Password Hashing & Verification Utility", () => {
  it("should hash a password securely and verify correctly", async () => {
    const plain = "SecureAdminPass123!";
    const hashed = await hashPassword(plain);

    expect(hashed).toBeTypeOf("string");
    expect(hashed).not.toBe(plain);

    const isValid = await verifyPassword(plain, hashed);
    expect(isValid).toBe(true);

    const isInvalid = await verifyPassword("WrongPassword", hashed);
    expect(isInvalid).toBe(false);
  });
});