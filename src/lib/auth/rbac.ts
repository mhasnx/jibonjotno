/**
 * JibonJotno (জীবনযত্ন) — Role-Based Access Control (RBAC) Matrix
 * Section 3.1: Strict Admin Role Boundaries & Permissions
 */

export type UserRole = 
  | "super_admin" 
  | "content_editor" 
  | "medical_reviewer" 
  | "pharmacist" 
  | "price_manager" 
  | "order_manager" 
  | "customer";

export type Permission = 
  | "manage_users"
  | "manage_medicines"
  | "review_clinical"
  | "manage_inventory"
  | "manage_pricing"
  | "manage_orders"
  | "view_audit_logs";

// রোল অনুযায়ী পারমিশন ম্যাট্রিক্স
const rolePermissions: Record<UserRole, Permission[]> = {
  super_admin: [
    "manage_users",
    "manage_medicines",
    "review_clinical",
    "manage_inventory",
    "manage_pricing",
    "manage_orders",
    "view_audit_logs",
  ],
  content_editor: [
    "manage_medicines",
  ],
  medical_reviewer: [
    "review_clinical",
    "manage_medicines",
  ],
  pharmacist: [
    "manage_inventory",
    "manage_orders",
  ],
  price_manager: [
    "manage_pricing",
  ],
  order_manager: [
    "manage_orders",
  ],
  customer: [],
};

/**
 * নির্দিষ্ট কোনো রোল নির্দিষ্ট পারমিশন হোল্ড করে কি না তা চেক করার ফাংশন।
 */
export function hasPermission(role: UserRole, permission: Permission): boolean {
  const permissions = rolePermissions[role];
  if (!permissions) return false;
  return permissions.includes(permission);
}

/**
 * কোনো রোলের অ্যাডমিন অ্যাক্সেস আছে কি না তা যাচাই করা।
 */
export function isAdminRole(role: string): boolean {
  return role !== "customer" && Object.keys(rolePermissions).includes(role);
}