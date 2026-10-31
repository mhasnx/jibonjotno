import { NextRequest, NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { db } from "@/db";
import { logger } from "@/lib/logger";
import { rateLimit, tooManyRequests } from "@/lib/rateLimit";

export async function GET(req: NextRequest) {
  const limited = rateLimit(req, { key: "health", limit: 30, windowMs: 60_000 });
  if (!limited.success) {
    return tooManyRequests(limited.retryAfterSeconds);
  }

  try {
    await db.execute(sql`SELECT 1`);

    return NextResponse.json(
      {
        status: "healthy",
        timestamp: new Date().toISOString(),
        database: "connected",
        environment: process.env.NODE_ENV || "development",
      },
      { status: 200 }
    );
  } catch (error) {
    logger.error("Health check failed", error);
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        database: "disconnected",
      },
      { status: 500 }
    );
  }
}
