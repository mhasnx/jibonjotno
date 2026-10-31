export interface CatalogItem {
  id: string;
  brand: string;
  generic: string;
  company: string;
  priceTk: string;
  strength: string;
  category: string;
  dosageForm: string;
  requiresRx?: boolean;
  imageUrl?: string;
  youtubeUrl?: string;
  stripPriceTk?: string;
  boxPriceTk?: string;
  indications?: string;
  dosage?: string;
  sideEffects?: string;
  precautions?: string;
  [key: string]: any;
}

export const MASTER_CATALOG: CatalogItem[] = [
  {
    id: "med-1",
    brand: "Napa Extend",
    generic: "Paracetamol",
    company: "Beximco Pharmaceuticals Ltd.",
    strength: "665 mg",
    category: "Fever",
    dosageForm: "Tablet",
    priceTk: "2.00",
    requiresRx: false,
    indications: "জ্বর, মাথা ব্যথা, দাঁতে ব্যথা, শরীরের ব্যথায় নির্দেশিত।",
    dosage: "প্রাপ্তবয়স্ক: ১-২টি ট্যাবলেট প্রতি ৬-৮ ঘণ্টা পর পর। দিনে সর্বোচ্চ ৪ গ্রামের বেশি নয়।",
    sideEffects: "সাধারণ মাত্রায় নিরাপদ। মাত্রাতিরিক্ত সেবনে লিভারের ক্ষতি হতে পারে।"
  },
  {
    id: "med-2",
    brand: "Sergel 20",
    generic: "Esomeprazole Magnesium Trihydrate",
    company: "Healthcare Pharmaceuticals Ltd.",
    strength: "20 mg",
    category: "Gastric",
    dosageForm: "Capsule",
    priceTk: "7.00",
    requiresRx: false,
    indications: "গ্যাস্ট্রিক আলসার, এসিডিটি, বুক জ্বালাপোড়ায় নির্দেশিত।",
    dosage: "১টি ক্যাপসুল খাবার ৩০ মিনিট আগে দিনে ১ বা ২ বার সেব্য।",
    sideEffects: "মাথা ঘোরা, কোষ্ঠকাঠিন্য বা ডায়রিয়া হতে পারে।"
  },
  {
    id: "med-3",
    brand: "Seclo 20",
    generic: "Omeprazole",
    company: "Square Pharmaceuticals Ltd.",
    strength: "20 mg",
    category: "Gastric",
    dosageForm: "Capsule",
    priceTk: "6.00",
    requiresRx: false,
    indications: "গ্যাস্ট্রিক এসিডিটি ও পেপটিক আলসার চিকিৎসায় নির্দেশিত।",
    dosage: "১টি করে ক্যাপসুল দিনে ১-২ বার খাবারের পূর্বে সেব্য।"
  },
  {
    id: "med-4",
    brand: "Ceevit",
    generic: "Ascorbic Acid (Vitamin C)",
    company: "Square Pharmaceuticals Ltd.",
    strength: "250 mg",
    category: "Vitamin",
    dosageForm: "Tablet",
    priceTk: "1.75",
    requiresRx: false,
    indications: "ভিটামিন সি এর ঘাটতি পূরণ ও রোগ প্রতিরোধ ক্ষমতা বৃদ্ধিতে নির্দেশিত।"
  },
  {
    id: "med-5",
    brand: "Monas 10",
    generic: "Montelukast",
    company: "Acme Laboratories Ltd.",
    strength: "10 mg",
    category: "Allergy",
    dosageForm: "Tablet",
    priceTk: "16.00",
    requiresRx: true,
    indications: "অ্যাজমা, শ্বাসকষ্ট ও সিজনাল অ্যালার্জি নিরাময়ে নির্দেশিত।"
  }
];