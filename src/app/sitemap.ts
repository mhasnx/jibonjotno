import type { MetadataRoute } from "next";
import { MASTER_CATALOG } from "@/data/medicinesCatalog";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://jibonjotno.com";
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/medicines",
    "/compare",
    "/videos",
    "/map",
    "/pharmacy",
    "/blood-bank",
    "/refill",
    "/ambulance",
    "/lab-tests",
    "/pediatric-dose",
    "/symptom-checker",
    "/track-order",
    "/privacy",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "" || route === "/medicines" ? "daily" : "weekly",
    priority: route === "" ? 1.0 : route === "/medicines" ? 0.9 : 0.8,
  }));

  const medicineRoutes: MetadataRoute.Sitemap = MASTER_CATALOG.slice(0, 100).map((med) => ({
    url: `${baseUrl}/medicines?q=${encodeURIComponent(med.brand)}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...medicineRoutes];
}