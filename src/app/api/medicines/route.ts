import { NextResponse } from "next/server";
import { MASTER_CATALOG } from "@/data/medicinesCatalog";
import fs from "fs";
import path from "path";

let cachedCatalog: any[] | null = null;

function loadFullDatabase() {
  if (cachedCatalog) return cachedCatalog;
  try {
    const filePath = path.join(process.cwd(), "public/data/all_medicines.json");
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        cachedCatalog = [...MASTER_CATALOG, ...parsed];
        return cachedCatalog;
      }
    }
  } catch (e) {
    console.error("Failed loading all_medicines.json:", e);
  }
  return MASTER_CATALOG;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") || "").trim().toLowerCase();
  const generic = (searchParams.get("generic") || "").trim().toLowerCase();
  const category = (searchParams.get("category") || "ALL").trim();
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(500, Math.max(1, parseInt(searchParams.get("limit") || "60", 10)));

  const allItems = loadFullDatabase();

  let filtered = allItems;

  if (category && category !== "ALL") {
    filtered = filtered.filter(
      (m: any) => (m.category || "").toLowerCase() === category.toLowerCase()
    );
  }

  if (generic) {
    filtered = filtered.filter(
      (m: any) => (m.generic || "").toLowerCase() === generic
    );
  } else if (q) {
    filtered = filtered.filter(
      (m: any) =>
        (m.brand || "").toLowerCase().includes(q) ||
        (m.generic || "").toLowerCase().includes(q) ||
        (m.company || "").toLowerCase().includes(q)
    );
  }

  const total = filtered.length;
  const start = (page - 1) * limit;
  const items = filtered.slice(start, start + limit);

  return NextResponse.json({
    total,
    totalDatabase: allItems.length,
    page,
    limit,
    items,
  });
}