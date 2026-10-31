import { NextRequest, NextResponse } from "next/server";

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

type RateLimitOptions = {
  /** Unique bucket name per endpoint (e.g. "orders", "session"). */
  key: string;
  /** Maximum allowed requests inside the window. */
  limit?: number;
  /** Window length in milliseconds. Defaults to 60 seconds. */
  windowMs?: number;
};

export type RateLimitResult = {
  success: boolean;
  remaining: number;
  retryAfterSeconds: number;
};

const buckets = new Map<string, RateLimitEntry>();
const MAX_BUCKETS = 10_000;

function pruneExpired(now: number) {
  if (buckets.size < MAX_BUCKETS / 2) {
    return;
  }
  for (const [id, entry] of buckets) {
    if (entry.resetAt <= now) {
      buckets.delete(id);
    }
  }
  if (buckets.size >= MAX_BUCKETS) {
    const oldest = buckets.keys().next().value;
    if (oldest) buckets.delete(oldest);
  }
}

export function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first.slice(0, 128);
  }

  const realIp = req.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp.slice(0, 128);

  const cfIp = req.headers.get("cf-connecting-ip")?.trim();
  if (cfIp) return cfIp.slice(0, 128);

  return "unknown";
}

export function rateLimit(req: NextRequest, options: RateLimitOptions): RateLimitResult {
  const limit = options.limit ?? 30;
  const windowMs = options.windowMs ?? 60_000;
  const ip = getClientIp(req);
  const bucketKey = `${options.key}:${ip}`;
  const now = Date.now();

  pruneExpired(now);

  const existing = buckets.get(bucketKey);
  if (!existing || existing.resetAt <= now) {
    buckets.set(bucketKey, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: Math.max(0, limit - 1), retryAfterSeconds: 0 };
  }

  if (existing.count >= limit) {
    return {
      success: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    };
  }

  existing.count += 1;
  return { success: true, remaining: Math.max(0, limit - existing.count), retryAfterSeconds: 0 };
}

export function tooManyRequests(retryAfterSeconds: number) {
  return NextResponse.json(
    { success: false, error: "Too many requests. Please try again shortly." },
    {
      status: 429,
      headers: {
        "Retry-After": String(retryAfterSeconds),
        "Cache-Control": "no-store",
      },
    }
  );
}
