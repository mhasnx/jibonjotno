import { describe, it, expect } from "vitest";
import { saltedPasswordDigest, timingSafeEqualHex } from "../../src/lib/auth/sha256";

describe("Salted SHA-256 admin digest", () => {
  it("creates a 64-character digest and does not echo the password", async () => {
    const digest = await saltedPasswordDigest("mahmudulhm2003@gmail.com", "example-pass", "test-salt");
    expect(digest).toHaveLength(64);
    expect(digest).not.toContain("example-pass");
    expect(timingSafeEqualHex(digest, digest)).toBe(true);
  });

  it("is case-insensitive for email and changes with salt", async () => {
    const a = await saltedPasswordDigest("Admin@Example.com", "secret", "salt-a");
    const b = await saltedPasswordDigest("admin@example.com", "secret", "salt-a");
    const c = await saltedPasswordDigest("admin@example.com", "secret", "salt-b");
    expect(a).toBe(b);
    expect(a).not.toBe(c);
  });
});
