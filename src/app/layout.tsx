import type { Metadata, Viewport } from "next";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import ClientRenderGuard from "@/components/layout/ClientRenderGuard";
import CookieConsent from "@/components/features/CookieConsent";
import WhatsAppButton from "@/components/common/WhatsAppButton";
import StructuredData from "@/components/seo/StructuredData";

export const viewport: Viewport = {
  themeColor: "#0f4c3a",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://jibonjotno.com"),
  title: {
    default: "JibonJotno (জীবনযত্ন) — Bangladesh Digital Health & Pharmacy Platform",
    template: "%s | JibonJotno Bangladesh",
  },
  description: "Verified Bangladeshi medicines, generic price comparison, clinical guides, and live ICU hospital maps.",
  manifest: "/manifest.json",
  authors: [{ name: "JibonJotno Healthcare Security Team" }],
  keywords: [
    "medicine price bangladesh",
    "online pharmacy bd",
    "blood donor bangladesh",
    "icu hospital map dhaka",
    "cash on delivery medicine bd",
    "medex alternative bangladesh",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className="antialiased bg-[#f4f7f6] text-slate-800 selection:bg-emerald-800 selection:text-white"
      >
        <StructuredData type="MedicalWebPage" />
        <ClientRenderGuard>
          <AuthProvider>
            <LanguageProvider>
              <CartProvider>
                {children}
                <WhatsAppButton />
                <CookieConsent />
              </CartProvider>
            </LanguageProvider>
          </AuthProvider>
        </ClientRenderGuard>
      </body>
    </html>
  );
}