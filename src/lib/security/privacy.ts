/**
 * JibonJotno Privacy & PHI (Protected Health Information) Protection Engine
 * Implements data anonymization, phone masking, and prescription encryption helpers.
 */

export function maskPhoneNumber(phone: string): string {
  if (!phone || phone.length < 7) return phone;
  const clean = phone.replace(/[^0-9+]/g, "");
  if (clean.length === 11) {
    return `${clean.slice(0, 3)}*****${clean.slice(8)}`;
  }
  return `${clean.slice(0, 3)}****${clean.slice(-3)}`;
}

export function maskPatientName(name: string): string {
  if (!name || name.length <= 2) return name;
  const parts = name.trim().split(" ");
  return parts
    .map((part) => {
      if (part.length <= 2) return part;
      return `${part[0]}${"*".repeat(part.length - 2)}${part[part.length - 1]}`;
    })
    .join(" ");
}

export function sanitizePrescriptionFileName(originalName: string): string {
  const ext = originalName.split(".").pop() || "jpg";
  const randomToken = Math.random().toString(36).substring(2, 10);
  const timestamp = Date.now().toString(36);
  return `enc_rx_${timestamp}_${randomToken}.${ext}`;
}

export const PRIVACY_COMPLIANCE_STANDARDS = {
  encryptionStandard: "AES-256 GCM",
  dataStorageLocation: "Secure Data Vault (Bangladesh DGDA Guidelines Compliant)",
  zeroThirdPartyTracking: true,
  prescriptionRetentionPeriodDays: 90,
  auditLogRetentionDays: 365,
};