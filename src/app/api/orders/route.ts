import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { rateLimit, tooManyRequests } from "@/lib/rateLimit";

// Strict Zod schema validating input parameters and preventing injection
const OrderItemSchema = z.object({
  id: z.string().min(1).max(50),
  name: z.string().min(1).max(100),
  price: z.number().positive().max(100000),
  qty: z.number().int().min(1).max(100),
});

const PlaceOrderSchema = z.object({
  customerName: z.string().trim().min(2, "Name must be at least 2 characters").max(80),
  phone: z
    .string()
    .trim()
    .regex(/^(?:\+8801|01)[3-9]\d{8}$/, "Must be a valid 11-digit Bangladeshi mobile number"),
  address: z.string().trim().min(5, "Address must be at least 5 characters").max(250),
  city: z.enum(["Dhaka", "Chattogram", "Sylhet", "Other"]),
  items: z.array(OrderItemSchema).min(1, "Order must contain at least 1 medicine"),
});

export async function POST(req: NextRequest) {
  const limited = rateLimit(req, { key: "orders", limit: 8, windowMs: 60_000 });
  if (!limited.success) {
    return tooManyRequests(limited.retryAfterSeconds);
  }

  try {
    const rawBody: unknown = await req.json();
    const validatedData = PlaceOrderSchema.parse(rawBody);

    const subtotal = validatedData.items.reduce((acc, item) => acc + item.price * item.qty, 0);
    const deliveryFee = validatedData.city === "Dhaka" ? 60 : 120;
    const grandTotal = subtotal + deliveryFee;

    const orderRecord = {
      orderNumber: `JJ-${Math.floor(100000 + Math.random() * 900000)}`,
      customerName: validatedData.customerName,
      phone: validatedData.phone,
      address: validatedData.address,
      city: validatedData.city,
      total: grandTotal,
      paymentMethod: "Cash on Delivery",
      status: "Confirmed",
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(
      {
        success: true,
        message: "Order placed successfully via Cash on Delivery",
        order: orderRecord,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation Error",
          issues: error.issues.map((err) => ({ field: err.path.join("."), message: err.message })),
        },
        { status: 422 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}