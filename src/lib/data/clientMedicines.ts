import type { CatalogItem } from "@/data/medicinesCatalog";

export type MedicinesApiResponse = {
  total: number;
  totalDatabase: number;
  page: number;
  limit: number;
  items: CatalogItem[];
  groups?: Array<{ generic: string; count: number }>;
};

export function readLocalMedicineOverlays(): {
  custom: CatalogItem[];
  overrides: Record<string, Partial<CatalogItem>>;
} {
  if (typeof window === "undefined") return { custom: [], overrides: {} };
  try {
    const custom = JSON.parse(localStorage.getItem("jj_custom_medicines") || "[]");
    const overrides = JSON.parse(localStorage.getItem("jj_medicine_overrides") || "{}");
    return {
      custom: Array.isArray(custom) ? custom : [],
      overrides: overrides && typeof overrides === "object" ? overrides : {},
    };
  } catch {
    return { custom: [], overrides: {} };
  }
}

export function applyLocalMedicineOverlays(items: CatalogItem[], prependCustom = false): CatalogItem[] {
  const { custom, overrides } = readLocalMedicineOverlays();
  const mapped = items.map((item) => (overrides[item.id] ? { ...item, ...overrides[item.id] } : item));
  if (!prependCustom || custom.length === 0) return mapped;
  return [...custom, ...mapped];
}

export async function fetchMedicinesPage(
  params: {
    q?: string;
    generic?: string;
    category?: string;
    page?: number;
    limit?: number;
    groups?: boolean;
  },
  signal?: AbortSignal
): Promise<MedicinesApiResponse> {
  const search = new URLSearchParams();
  if (params.q) search.set("q", params.q);
  if (params.generic) search.set("generic", params.generic);
  if (params.category) search.set("category", params.category);
  if (params.page) search.set("page", String(params.page));
  if (params.limit) search.set("limit", String(params.limit));
  if (params.groups) search.set("groups", "1");

  const response = await fetch(`/api/medicines?${search.toString()}`, {
    signal,
    credentials: "same-origin",
  });
  if (!response.ok) {
    throw new Error("Failed to load medicines");
  }
  return (await response.json()) as MedicinesApiResponse;
}
