/**
 * JibonJotno (জীবনযত্ন) — Drizzle Database Schema
 * Includes users, audit_logs, medicines, product_skus, and educational_videos
 */

import { pgTable, serial, text, timestamp, integer, boolean, uuid } from "drizzle-orm/pg-core";

// ইউজার টেবিল
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull().default("customer"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// অডিট লগ টেবিল
export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  adminId: integer("admin_id").notNull(),
  action: text("action").notNull(),
  targetEntity: text("target_entity").notNull(),
  ipAddress: text("ip_address"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ঔষধ টেবিল
export const medicines = pgTable("medicines", {
  id: serial("id").primaryKey(),
  brandName: text("brand_name").notNull(),
  genericName: text("generic_name").notNull(),
  strength: text("strength").notNull(),
  form: text("form").notNull(), // Tablet, Syrup, Capsule, etc.
  manufacturer: text("manufacturer").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// প্রোডাক্ট এসকেইউ ও প্রাইসিং (পয়সায় হিসাব)
export const productSkus = pgTable("product_skus", {
  id: serial("id").primaryKey(),
  medicineId: integer("medicine_id").notNull(),
  skuCode: text("sku_code").notNull().unique(),
  pricePaisa: integer("price_paisa").notNull(), // Integer Paisa currency handling
  stockQuantity: integer("stock_quantity").notNull().default(0),
  isAvailable: boolean("is_available").notNull().default(true),
});

// শিক্ষামূলক ভিডিও পাইপলাইন টেবিল (Phase 3)
export const educationalVideos = pgTable("educational_videos", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  titleEn: text("title_en").notNull(),
  youtubeUrl: text("youtube_url").notNull(),
  durationSeconds: integer("duration_seconds").notNull(),
  category: text("category").notNull(), // Cardiology, Diabetes, General, etc.
  isPublished: boolean("is_published").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});