import { describe, it, expect } from "vitest";
import { clampMedicineLimit, clampMedicinePage, isGitLfsPointer } from "../../src/lib/data/loadMedicines";

describe("Medicines dataset helpers", () => {
  it("detects Git LFS pointer files", () => {
    const pointer = `version https://git-lfs.github.com/spec/v1
oid sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
size 12345
`;
    expect(isGitLfsPointer(pointer)).toBe(true);
    expect(isGitLfsPointer('[{"id":"med-1"}]')).toBe(false);
  });

  it("clamps pagination to 1-50 items per request", () => {
    expect(clampMedicineLimit("24")).toBe(24);
    expect(clampMedicineLimit("500")).toBe(50);
    expect(clampMedicineLimit("0")).toBe(1);
    expect(clampMedicinePage("-3")).toBe(1);
  });
});
