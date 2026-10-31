/**
 * JibonJotno (জীবনযত্ন) — Order & Prescription Validator
 * Section 9.2: Validate cart items, paisa currency total, and prescription requirement.
 */

export interface CartItem {
  medicineId: number;
  name: string;
  pricePaisa: number;
  quantity: number;
  requiresPrescription: boolean;
}

export interface OrderCheckoutInput {
  items: CartItem[];
  hasPrescriptionUploaded: boolean;
}

export interface OrderValidationResult {
  isValid: boolean;
  totalPaisa: number;
  error?: string;
}

/**
 * কার্ট আইটেম এবং প্রেসক্রিপশন প্রয়োজনীয়তা ভ্যালিডেশন
 */
export function validateOrderCheckout(input: OrderCheckoutInput): OrderValidationResult {
  if (!input.items || input.items.length === 0) {
    return { isValid: false, totalPaisa: 0, error: "কার্টে কোনো ঔষধ নেই।" };
  }

  let totalPaisa = 0;
  let needsPrescription = false;

  for (const item of input.items) {
    if (item.quantity <= 0 || item.pricePaisa < 0) {
      return { isValid: false, totalPaisa: 0, error: "অবৈধ পরিমাণ বা মূল্য।" };
    }
    totalPaisa += item.pricePaisa * item.quantity;
    if (item.requiresPrescription) {
      needsPrescription = true;
    }
  }

  if (needsPrescription && !input.hasPrescriptionUploaded) {
    return { 
      isValid: false, 
      totalPaisa, 
      error: "এই অর্ডারে প্রেসক্রিপশন বাধ্যতামূলক ঔষধ রয়েছে। অনুগ্রহ করে প্রেসক্রিপশন আপলোড করুন।" 
    };
  }

  return { isValid: true, totalPaisa };
}