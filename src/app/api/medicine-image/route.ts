import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { rateLimit, tooManyRequests } from "@/lib/rateLimit";

const imageCache = new Map<string, string>();

const MedicineImageQuerySchema = z.object({
  brand: z
    .string()
    .trim()
    .min(1)
    .max(100)
    .refine((value) => !/^https?:/i.test(value) && !value.includes("://"), "Invalid brand"),
  generic: z.string().trim().max(100).optional().default(""),
});

export async function GET(req: NextRequest) {
  const limited = rateLimit(req, { key: "medicine-image", limit: 60, windowMs: 60_000 });
  if (!limited.success) {
    return tooManyRequests(limited.retryAfterSeconds);
  }

  const { searchParams } = new URL(req.url);
  const parsed = MedicineImageQuerySchema.safeParse({
    brand: searchParams.get("brand") ?? "",
    generic: searchParams.get("generic") ?? "",
  });

  if (!parsed.success) {
    return NextResponse.json({ imageUrl: "" });
  }

  const brand = parsed.data.brand;
  const generic = parsed.data.generic;

  const cacheKey = `${brand.toLowerCase()}_${generic.toLowerCase()}`;
  if (imageCache.has(cacheKey)) {
    return NextResponse.json({ imageUrl: imageCache.get(cacheKey) });
  }

  const cleanBrand = brand.replace(/\s+\d+.*$/, "").trim();

  // 1. Try MedEasy Health Official Search API (https://medeasy.health)
  try {
    const medEasyRes = await fetch(
      `https://api.medeasy.health/api/patient/search-medicines/?q=${encodeURIComponent(cleanBrand)}&from=0&to=5`,
      { headers: { Accept: "application/json" }, next: { revalidate: 86400 } }
    );
    if (medEasyRes.ok) {
      const data = await medEasyRes.json();
      const items = data?.medicines || data?.data || data?.results || [];
      for (const item of items) {
        const img = item?.medicine_image || item?.image || item?.generic?.image;
        if (img && typeof img === "string") {
          const fullUrl = img.startsWith("http") ? img : `https://api.medeasy.health${img.startsWith("/") ? "" : "/"}${img}`;
          imageCache.set(cacheKey, fullUrl);
          return NextResponse.json({ imageUrl: fullUrl, source: "medeasy.health" });
        }
      }
    }
  } catch {
    // Continue to next pharmacy source
  }

  // 2. Try Arogga Official Search API (https://www.arogga.com)
  try {
    const aroggaRes = await fetch(
      `https://api.arogga.com/v1/search/?search=${encodeURIComponent(cleanBrand)}&per_page=5`,
      { headers: { Accept: "application/json" }, next: { revalidate: 86400 } }
    );
    if (aroggaRes.ok) {
      const data = await aroggaRes.json();
      const items = data?.data || [];
      for (const item of items) {
        const attached = item?.attachedFiles_pv_images || item?.pv?.[0]?.attachedFiles_pv_images || [];
        const src = attached?.[0]?.src || item?.image;
        if (src && typeof src === "string" && src.startsWith("http")) {
          imageCache.set(cacheKey, src);
          return NextResponse.json({ imageUrl: src, source: "arogga.com" });
        }
      }
    }
  } catch {
    // Continue to next pharmacy source
  }

  // 3. Try Osudpotro API (https://osudpotro.com)
  try {
    const osudRes = await fetch(
      `https://api.osudpotro.com/api/v1/search?q=${encodeURIComponent(cleanBrand)}`,
      { headers: { Accept: "application/json" }, next: { revalidate: 86400 } }
    );
    if (osudRes.ok) {
      const data = await osudRes.json();
      const items = data?.data?.medicines || data?.data || [];
      if (Array.isArray(items) && items.length > 0) {
        const img = items[0]?.image || items[0]?.thumb_image;
        if (img && typeof img === "string" && img.startsWith("http")) {
          imageCache.set(cacheKey, img);
          return NextResponse.json({ imageUrl: img, source: "osudpotro.com" });
        }
      }
    }
  } catch {
    // Fallback
  }

  return NextResponse.json({ imageUrl: "" });
}