import { describe, it, expect } from "vitest";
import { hasPermission, isAdminRole } from "../../src/lib/auth/rbac";

describe("RBAC Access Control Utility", () => {
  it("should allow super_admin all permissions", () => {
    expect(hasPermission("super_admin", "manage_users")).toBe(true);
    expect(hasPermission("super_admin", "manage_orders")).toBe(true);
  });

  it("should restrict content_editor from managing orders or users", () => {
    expect(hasPermission("content_editor", "manage_medicines")).toBe(true);
    expect(hasPermission("content_editor", "manage_orders")).toBe(false);
    expect(hasPermission("content_editor", "manage_users")).toBe(false);
  });

  it("should correctly identify admin roles vs customer", () => {
    expect(isAdminRole("pharmacist")).toBe(true);
    expect(isAdminRole("customer")).toBe(false);
  });
});