# JibonJotno (জীবনযত্ন) — Project State & Architecture Record

## Current Phase: Phase 3 Completed (Educational Video Pipeline & Advanced CMS Features)
- **Status:** All unit tests passing (`npm test`), production build successful (`npm run build`).
- **Tech Stack:** Next.js 15 (App Router), TypeScript, Tailwind CSS, PostgreSQL, Drizzle ORM, Vitest.

## Completed Modules & Features:
1. **Security & Auth Baseline:** Secure bcryptjs password hashing, RBAC permission matrix (`super_admin`, `content_editor`, `medical_reviewer`, `pharmacist`, `price_manager`, `order_manager`, `customer`), and middleware route protection.
2. **Database & Schema:** Drizzle ORM connection pool and core tables (`users`, `audit_logs`, `medicines`, `product_skus`, `educational_videos`).
3. **Bangla Text & Utilities:** Unicode NFC normalization, Bangla-to-English digit conversion, and secure file upload validator (magic bytes & 5MB limit).
4. **Admin CMS & Pages:** 
   - Dashboard (`/admin`)
   - Medicines Catalog CMS (`/admin/medicines`)
   - Pharmacy Orders CMS (`/admin/orders`)
   - Audit Logs & Security Tracking (`/admin/audit-logs`)
   - Educational Video CMS (`/admin/videos`)
5. **Public Portal & Pipelines:** Public landing page with test mode banner (`COMMERCE_ENABLED="false"`), health check API (`/api/health`), public videos gallery (`/videos`), and video metadata/URL validators with comprehensive unit tests.

## Next Phase: Phase 4 — Online Pharmacy Commerce Integration & Legal Verification ([VERIFY-PRO])