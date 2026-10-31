export interface InteractionWarning {
  level: "DANGER" | "WARNING" | "INFO";
  titleBn: string;
  titleEn: string;
  messageBn: string;
  messageEn: string;
}

export function checkCartInteractions(items: { name: string; generic: string }[]): InteractionWarning[] {
  const warnings: InteractionWarning[] = [];
  if (!items || items.length < 2) return warnings;

  const names = items.map((i) => i.name.toLowerCase());
  const generics = items.map((i) => i.generic.toLowerCase());

  // Check 1: Duplicate Paracetamol Overdose (e.g. Napa + Fast + Ace)
  const paracetamolCount = generics.filter((g) => g.includes("paracetamol")).length;
  if (paracetamolCount >= 2) {
    warnings.push({
      level: "DANGER",
      titleBn: "⚠️ মারাত্মক লিভার ঝুঁকির সতর্কতা (প্যারাসিটামল ওভারডোজ)",
      titleEn: "Dangerous Overdose Alert: Multiple Paracetamol Brands",
      messageBn: "আপনার ব্যাগে একাধিক প্যারাসিটামল জাতীয় ওষুধ রয়েছে। ভিন্ন ব্র্যান্ডের প্যারাসিটামল একসাথে খেলে মারাত্মক লিভারের ক্ষতি হতে পারে। যেকোনো একটি ব্র্যান্ড সেবন করুন।",
      messageEn: "Multiple medicines containing Paracetamol detected in your cart. Concurrently taking different brands can cause toxic hepatic failure.",
    });
  }

  // Check 2: Cefixime / Azithromycin + Antacid absorption block
  const hasAntibiotic = generics.some((g) => g.includes("cefixime") || g.includes("azithromycin") || g.includes("ciprofloxacin"));
  const hasAntacid = generics.some((g) => g.includes("magnesium") || g.includes("aluminium") || g.includes("antacid"));
  if (hasAntibiotic && hasAntacid) {
    warnings.push({
      level: "WARNING",
      titleBn: "⚠️ কার্যকারিতা হ্রাস সতর্কতা (অ্যান্টিবায়োটিক + অ্যান্টাসিড)",
      titleEn: "Absorption Interaction: Antibiotic with Antacid",
      messageBn: "অ্যান্টাসিড ও অ্যান্টিবায়োটিক একসাথে খেলে শরীরে অ্যান্টিবায়োটিকের শোষণ বাধাগ্রস্ত হয়। অ্যান্টাসিড খাওয়ার অন্তত ২ ঘণ্টা পূর্বে বা পরে অ্যান্টিবায়োটিক সেবন করুন।",
      messageEn: "Antacids reduce the gastrointestinal absorption of antibiotics. Take antibiotic at least 2 hours apart.",
    });
  }

  // Check 3: Multiple NSAIDs (Gastric ulcer risk e.g. Tori + Rolac + Diclofenac)
  const nsaidMatches = generics.filter((g) => g.includes("etoricoxib") || g.includes("ketorolac") || g.includes("diclofenac") || g.includes("naproxen"));
  if (nsaidMatches.length >= 2) {
    warnings.push({
      level: "DANGER",
      titleBn: "⚠️ গ্যাস্ট্রিক আলসার ও রক্তক্ষরণের উচ্চ ঝুঁকি",
      titleEn: "High Gastrointestinal Risk: Multiple NSAIDs",
      messageBn: "একাধিক ব্যথানাশক (NSAIDs) একসাথে সেবনে তীব্র পাকস্থলীর আলসার এবং রক্তক্ষরণের ঝুঁকি তৈরি হয়। চিকিৎসকের লিখিত পরামর্শ ব্যতীত একাধিক ব্যথানাশক একসাথে খাবেন না।",
      messageEn: "Simultaneous use of multiple NSAIDs significantly increases stomach ulceration and bleeding.",
    });
  }

  return warnings;
}