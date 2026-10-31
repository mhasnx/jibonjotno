export type Category = string | any;
export type DosageForm = string | any;

export interface CatalogItem {
  id: string;
  brand: string;
  generic: string;
  company: string;
  priceTk: string;
  strength: string;
  category: any;
  dosageForm: any;
  requiresRx?: boolean;
  imageUrl?: string | any;
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
    imageUrl: "https://medex.com.bd/cdn/img/medicines/napa-extend-665-mg.png",
    indications: "জ্বর, মাথাব্যথা, দাঁতের ব্যথা, পিঠের ব্যথা এবং আর্থ্রাইটিসের ব্যথায় কার্যকর।",
    dosage: "প্রাপ্তবয়স্ক: ১-২টি ট্যাবলেট প্রতি ৬-৮ ঘণ্টা পর পর। দিনে সর্বোচ্চ ৪ গ্রামের বেশি নয়।",
    sideEffects: "সাধারণ মাত্রায় নিরাপদ। অতিরিক্ত সেবনে লিভারের ক্ষতি হতে পারে।"
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
    imageUrl: "https://medex.com.bd/cdn/img/medicines/sergel-20-mg.png",
    indications: "গ্যাস্ট্রোইসোফেজিয়াল রিফ্লাক্স ডিজিজ (GERD), এসিডিটি এবং পেপটিক আলসারে নির্দেশিত।",
    dosage: "১টি ক্যাপসুল খাবার ৩০ মিনিট আগে দিনে ১ বা ২ বার চিকিৎসকের পরামর্শ অনুযায়ী সেব্য।"
  },
  {
    id: "med-3",
    brand: "3 Bion",
    generic: "Vitamin B1 + Vitamin B6 + Vitamin B12",
    company: "Jenphar Bangladesh Ltd.",
    strength: "100mg+200mg+200mcg",
    category: "Vitamin",
    dosageForm: "Tablet",
    priceTk: "12.00",
    requiresRx: false,
    imageUrl: "https://medex.com.bd/cdn/img/medicines/3-bion.png",
    indications: "ভিটামিন বি১, বি৬ এবং বি১২ এর ঘাটতি পূরণ, নিউরোপ্যাথি এবং স্নায়বিক ব্যথায় নির্দেশিত।",
    dosage: "প্রতিদিন ১টি করে ট্যাবলেট দিনে ১ থেকে ৩ বার চিকিৎসকের পরামর্শ অনুযায়ী সেব্য।"
  }
];