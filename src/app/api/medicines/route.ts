import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

let cachedCatalog: any[] | null = null;

async function loadDataset() {
  if (cachedCatalog && cachedCatalog.length > 0) {
    return cachedCatalog;
  }

  // 1. Local file JSON check
  try {
    const filePath = path.join(process.cwd(), "public", "data", "all_medicines.json");
    if (fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath, "utf8");
      if (!fileData.startsWith("version https://git-lfs")) {
        cachedCatalog = JSON.parse(fileData);
        return cachedCatalog;
      }
    }
  } catch (err) {
    console.error("Local read skipped:", err);
  }

  // 2. Fetch directly from GitHub LFS Media CDN if local file is a Git LFS pointer text
  try {
    const cdnUrl = "https://media.githubusercontent.com/media/mhasnx/JibonJotno/main/public/data/all_medicines.json";
    const res = await fetch(cdnUrl, { next: { revalidate: 86400 } });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        cachedCatalog = data;
        return cachedCatalog;
      }
    }
  } catch (err) {
    console.error("GitHub LFS CDN fetch failed:", err);
  }

  return null;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = (searchParams.get("q") || "").toLowerCase().trim();
    const category = searchParams.get("category") || "ALL";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "24", 10);

    const catalog = await loadDataset();

    if (!catalog || catalog.length === 0) {
      return NextResponse.json({ items: [], total: 0 });
    }

    let filtered = catalog;

    if (category !== "ALL") {
      filtered = filtered.filter(
        (item: any) => item.category?.toLowerCase() === category.toLowerCase()
      );
    }

    if (query) {
      filtered = filtered.filter(
        (item: any) =>
          item.brand?.toLowerCase().includes(query) ||
          item.generic?.toLowerCase().includes(query) ||
          item.company?.toLowerCase().includes(query)
      );
    }

    const total = filtered.length;
    const start = (page - 1) * limit;
    const paginatedItems = filtered.slice(start, start + limit);

    return NextResponse.json({ items: paginatedItems, total });
  } catch (error) {
    return NextResponse.json({ error: "API Server Error" }, { status: 500 });
  }
}