import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = (searchParams.get("q") || "").toLowerCase().trim();
    const category = searchParams.get("category") || "ALL";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "24", 10);

    const filePath = path.join(process.cwd(), "public", "data", "all_medicines.json");
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ items: [], total: 0 });
    }

    const fileData = fs.readFileSync(filePath, "utf8");
    const catalog = JSON.parse(fileData);

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
    return NextResponse.json({ error: "Failed to read dataset" }, { status: 500 });
  }
}