"use client";

import React from "react";
import { CatalogItem } from "@/data/medicinesCatalog";

interface StructuredDataProps {
  type: "Drug" | "MedicalCondition" | "FAQPage" | "MedicalWebPage";
  medicine?: CatalogItem;
  conditionName?: string;
  conditionDesc?: string;
  faqs?: Array<{ question: string; answer: string }>;
}

export default function StructuredData({
  type,
  medicine,
  conditionName,
  conditionDesc,
  faqs,
}: StructuredDataProps) {
  let schemaData: Record<string, any> = {
    "@context": "https://schema.org",
  };

  if (type === "Drug" && medicine) {
    schemaData = {
      "@context": "https://schema.org",
      "@type": "Drug",
      name: `${medicine.brand} (${medicine.strength})`,
      nonProprietaryName: medicine.generic,
      dosageForm: medicine.dosageForm,
      ActiveIngredient: medicine.generic,
      prescriptionStatus: medicine.requiresRx ? "PrescriptionOnly" : "OTC",
      manufacturer: {
        "@type": "Organization",
        name: medicine.company,
      },
      description: medicine.indicationsEn || `${medicine.brand} containing ${medicine.generic} by ${medicine.company}.`,
      offers: {
        "@type": "Offer",
        priceCurrency: "BDT",
        price: medicine.priceTk,
        availability: "https://schema.org/InStock",
        url: `https://jibonjotno.com/medicines?q=${encodeURIComponent(medicine.brand)}`,
      },
    };
  } else if (type === "MedicalCondition") {
    schemaData = {
      "@context": "https://schema.org",
      "@type": "MedicalCondition",
      name: conditionName || "Primary Healthcare & Disease Prevention Guide",
      description:
        conditionDesc ||
        "Clinical symptoms, home management, red-flag warnings, and primary treatment guidelines for Bangladesh.",
      possibleTreatment: {
        "@type": "MedicalTherapy",
        name: "Primary Clinical Management & Registered Physician Consultation",
      },
    };
  } else if (type === "FAQPage" && faqs && faqs.length > 0) {
    schemaData = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: f.answer,
        },
      })),
    };
  } else {
    schemaData = {
      "@context": "https://schema.org",
      "@type": "MedicalOrganization",
      name: "JibonJotno Digital Health & Pharmacy Bangladesh",
      url: "https://jibonjotno.com",
      logo: "https://jibonjotno.com/favicon.ico",
      areaServed: "BD",
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+8801700000000",
        contactType: "customer service",
        availableLanguage: ["Bengali", "English"],
      },
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}