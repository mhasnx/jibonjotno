import fs from "fs";
import path from "path";
import { MASTER_CATALOG, type CatalogItem } from "@/data/medicinesCatalog";

const LFS_POINTER_PREFIX = "version https://git-lfs.github.com/spec/v1";
const DEFAULT_GITHUB_REPO = "mhasnx/jibonjotno";
const DEFAULT_GITHUB_REF = "main";
const DATASET_RELATIVE_PATH = "public/data/all_medicines.json";
const MAX_DATASET_CHARS = 80_000_000;

let cachedCatalog: CatalogItem[] | null = null;
let inflight: Promise<CatalogItem[]> | null = null;

export function isGitLfsPointer(raw: string): boolean {
  return raw.trimStart().startsWith(LFS_POINTER_PREFIX);
}

export function clampMedicineLimit(raw: string | null | undefined, fallback = 24): number {
  const parsed = Number.parseInt(raw || "", 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(50, Math.max(1, parsed));
}

export function clampMedicinePage(raw: string | null | undefined): number {
  const parsed = Number.parseInt(raw || "", 10);
  if (!Number.isFinite(parsed) || parsed < 1) return 1;
  return parsed;
}

function normalizeItem(item: Partial<CatalogItem>, index: number): CatalogItem | null {
  if (!item || typeof item !== "object") return null;
  const brand = String(item.brand || "").trim();
  const generic = String(item.generic || "").trim();
  if (!brand && !generic) return null;
  return {
    ...item,
    id: String(item.id || `med-ext-${index}`),
    brand: brand || generic || `Medicine ${index}`,
    generic: generic || brand,
    company: String(item.company || "Unknown"),
    priceTk: String(item.priceTk || "0.00"),
    strength: String(item.strength || ""),
    category: item.category || "General",
    dosageForm: item.dosageForm || "Tablet",
  };
}

function mergeCatalog(extra: CatalogItem[]): CatalogItem[] {
  const seen = new Set<string>();
  const merged: CatalogItem[] = [];
  for (const item of [...MASTER_CATALOG, ...extra]) {
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    merged.push(item);
  }
  return merged;
}

function parseCatalogJson(raw: string): CatalogItem[] | null {
  if (!raw || isGitLfsPointer(raw)) return null;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed) || parsed.length === 0) return null;
    const normalized: CatalogItem[] = [];
    for (let i = 0; i < parsed.length; i++) {
      const item = normalizeItem(parsed[i] as Partial<CatalogItem>, i);
      if (item) normalized.push(item);
    }
    return normalized.length > 0 ? normalized : null;
  } catch {
    return null;
  }
}

function datasetFallbackUrls(): string[] {
  const repo = process.env.MEDICINES_GITHUB_REPO || DEFAULT_GITHUB_REPO;
  const ref = process.env.MEDICINES_GITHUB_REF || DEFAULT_GITHUB_REF;
  const custom = process.env.MEDICINES_DATASET_URL;
  return [
    custom,
    `https://media.githubusercontent.com/media/${repo}/${ref}/${DATASET_RELATIVE_PATH}`,
    `https://raw.githubusercontent.com/${repo}/${ref}/${DATASET_RELATIVE_PATH}`,
  ].filter((url): url is string => Boolean(url));
}

async function fetchRemoteCatalog(): Promise<CatalogItem[] | null> {
  for (const url of datasetFallbackUrls()) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 20_000);
    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: { Accept: "application/json" },
        cache: "no-store",
      });
      if (!response.ok) continue;
      const raw = await response.text();
      if (raw.length > MAX_DATASET_CHARS) continue;
      const parsed = parseCatalogJson(raw);
      if (parsed) return parsed;
    } catch {
      // Try the next CDN candidate.
    } finally {
      clearTimeout(timer);
    }
  }
  return null;
}

function readLocalCatalog(): CatalogItem[] | null {
  try {
    const filePath = path.join(process.cwd(), DATASET_RELATIVE_PATH);
    if (!fs.existsSync(filePath)) return null;
    const raw = fs.readFileSync(filePath, "utf-8");
    if (raw.length > MAX_DATASET_CHARS) return null;
    return parseCatalogJson(raw);
  } catch {
    return null;
  }
}

async function loadFullDatabaseUncached(): Promise<CatalogItem[]> {
  const local = readLocalCatalog();
  if (local) return mergeCatalog(local);

  const remote = await fetchRemoteCatalog();
  if (remote) return mergeCatalog(remote);

  return MASTER_CATALOG;
}

export async function loadFullDatabase(): Promise<CatalogItem[]> {
  if (cachedCatalog) return cachedCatalog;
  if (!inflight) {
    inflight = loadFullDatabaseUncached()
      .then((items) => {
        cachedCatalog = items;
        return items;
      })
      .finally(() => {
        inflight = null;
      });
  }
  return inflight;
}

export function filterMedicines(
  allItems: CatalogItem[],
  options: { q?: string; generic?: string; category?: string }
): CatalogItem[] {
  const q = (options.q || "").trim().toLowerCase();
  const generic = (options.generic || "").trim().toLowerCase();
  const category = (options.category || "ALL").trim();

  let filtered = allItems;

  if (category && category !== "ALL") {
    const cat = category.toLowerCase();
    filtered = filtered.filter((m) => String(m.category || "").toLowerCase() === cat);
  }

  if (generic) {
    filtered = filtered.filter((m) => String(m.generic || "").toLowerCase() === generic);
  } else if (q) {
    filtered = filtered.filter((m) => {
      return (
        String(m.brand || "").toLowerCase().includes(q) ||
        String(m.generic || "").toLowerCase().includes(q) ||
        String(m.company || "").toLowerCase().includes(q) ||
        String(m.category || "").toLowerCase().includes(q)
      );
    });
  }

  return filtered;
}

export function topGenericGroups(allItems: CatalogItem[], limit = 40): Array<{ generic: string; count: number }> {
  const map = new Map<string, number>();
  for (const item of allItems) {
    if (!item.generic) continue;
    map.set(item.generic, (map.get(item.generic) || 0) + 1);
  }
  return Array.from(map.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([generic, count]) => ({ generic, count }));
}
