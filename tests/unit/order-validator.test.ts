import { describe, it, expect } from "vitest";
import { validateOrderCheckout } from "../../src/lib/commerce/order-validator";

describe("Order Checkout & Prescription Validator", () => {
  it("should calculate total paisa correctly and pass when no prescription required", () => {
    const result = validateOrderCheckout({
      items: [
        { medicineId: 1, name: "Paracetamol", pricePaisa: 2500, quantity: 2, requiresPrescription: false }
      ],
      hasPrescriptionUploaded: false,
    });

    expect(result.isValid).toBe(true);
    expect(result.totalPaisa).toBe(5000); // 50.00 BDT
  });

  it("should reject order requiring prescription if prescription is missing", () => {
    const result = validateOrderCheckout({
      items: [
        { medicineId: 2, name: "Antibiotic", pricePaisa: 15000, quantity: 1, requiresPrescription: true }
      ],
      hasPrescriptionUploaded: false,
    });

    expect(result.isValid).toBe(false);
    expect(result.error).toContain("প্রেসক্রিপশন বাধ্যতামূলক");
  });

  it("should pass order requiring prescription if prescription is uploaded", () => {
    const result = validateOrderCheckout({
      items: [
        { medicineId: 2, name: "Antibiotic", pricePaisa: 15000, quantity: 1, requiresPrescription: true }
      ],
      hasPrescriptionUploaded: true,
    });

    expect(result.isValid).toBe(true);
    expect(result.totalPaisa).toBe(15000);
  });
});