import { NextRequest, NextResponse } from "next/server";
import { rateLimit, tooManyRequests } from "@/lib/rateLimit";
import {
  clampMedicineLimit,
  clampMedicinePage,
  filterMedicines,
  loadFullDatabase,
  topGenericGroups,
} from "@/lib/data/loadMedicines";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const limited = rateLimit(request, { key: "medicines", limit: 60, windowMs: 60_000 });
  if (!limited.success) {
    return tooManyRequests(limited.retryAfterSeconds);
  }

  try {
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get("q") || "").trim();
    const generic = (searchParams.get("generic") || "").trim();
    const category = (searchParams.get("category") || "ALL").trim();
    const page = clampMedicinePage(searchParams.get("page"));
    const limit = clampMedicineLimit(searchParams.get("limit"), 24);
    const wantGroups = searchParams.get("groups") === "1";

    const allItems = await loadFullDatabase();

    if (wantGroups) {
      return NextResponse.json(
        {
          total: allItems.length,
          totalDatabase: allItems.length,
          page: 1,
          limit,
          items: [],
          groups: topGenericGroups(allItems, 40),
        },
        { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } }
      );
    }

    const filtered = filterMedicines(allItems, { q, generic, category });
    const total = filtered.length;
    const start = (page - 1) * limit;
    const items = filtered.slice(start, start + limit);

    return NextResponse.json(
      {
        total,
        totalDatabase: allItems.length,
        page,
        limit,
        items,
      },
      { headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=120" } }
    );
  } catch {
    return NextResponse.json(
      { total: 0, totalDatabase: 0, page: 1, limit: 24, items: [], error: "Unable to load medicines" },
      { status: 500 }
    );
  }
}
