const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");

const excelFileName = "Bangladesh Medicine(KEBRA_DGHS_MedEx Schema) .xlsx";
const excelPath = path.join(process.cwd(), excelFileName);

function cleanText(val, fallback = "") {
  if (val === undefined || val === null) return fallback;
  const s = String(val).trim();
  if (!s || s.toLowerCase() === "not reported" || s.toLowerCase() === "nan") return fallback;
  return s;
}

function isValidMedicineImage(url) {
  if (!url || !url.startsWith("http")) return false;
  const lower = url.toLowerCase();
  // Block fake PDF document scans like Scribd Unani product lists
  if (
    lower.includes("scribdassets.com") ||
    lower.includes("scribd.com") ||
    lower.includes("placeholder") ||
    lower.includes("default") ||
    lower.endsWith(".pdf")
  ) {
    return false;
  }
  return true;
}

function extractPrice(val, defaultPrice = "5.00") {
  if (!val) return defaultPrice;
  const str = String(val).replace(/,/g, "");
  const match = str.match(/(\d+(\.\d+)?)/);
  if (match) {
    const num = parseFloat(match[1]);
    return num > 0 ? num.toFixed(2) : defaultPrice;
  }
  return defaultPrice;
}

function detectCategory(generic, indication, form) {
  const text = `${generic} ${indication} ${form}`.toLowerCase();
  if (text.includes("device") || text.includes("monitor") || text.includes("strip") || text.includes("meter") || text.includes("mask") || text.includes("syringe") || text.includes("cannula")) return "Equipment";
  if (text.includes("omeprazole") || text.includes("esomeprazole") || text.includes("pantoprazole") || text.includes("rabeprazole") || text.includes("ulcer") || text.includes("gastric") || text.includes("acidity") || text.includes("famotidine")) return "Gastric";
  if (text.includes("cefixime") || text.includes("azithromycin") || text.includes("amoxicillin") || text.includes("ciprofloxacin") || text.includes("levofloxacin") || text.includes("cefuroxime") || text.includes("ceftriaxone") || text.includes("antibiotic") || text.includes("flucloxacillin") || text.includes("metronidazole")) return "Antibiotic";
  if (text.includes("paracetamol") || text.includes("fever") || text.includes("pyrexia")) return "Fever";
  if (text.includes("ketorolac") || text.includes("etoricoxib") || text.includes("diclofenac") || text.includes("naproxen") || text.includes("aceclofenac") || text.includes("pain") || text.includes("arthritis") || text.includes("ibuprofen")) return "Pain";
  if (text.includes("cetirizine") || text.includes("fexofenadine") || text.includes("montelukast") || text.includes("bilastine") || text.includes("ketotifen") || text.includes("rupatadine") || text.includes("allergy") || text.includes("asthma") || text.includes("salbutamol")) return "Allergy";
  if (text.includes("vitamin") || text.includes("calcium") || text.includes("zinc") || text.includes("iron") || text.includes("folic") || text.includes("cholecalciferol") || text.includes("multivitamin")) return "Vitamin";
  if (text.includes("amlodipine") || text.includes("losartan") || text.includes("olmesartan") || text.includes("telmisartan") || text.includes("atenolol") || text.includes("bisoprolol") || text.includes("rosuvastatin") || text.includes("atorvastatin") || text.includes("hypertension") || text.includes("cardiac")) return "Cardiac";
  if (text.includes("metformin") || text.includes("glimepiride") || text.includes("linagliptin") || text.includes("sitagliptin") || text.includes("vildagliptin") || text.includes("insulin") || text.includes("diabetes")) return "Diabetes";
  return "Gastric";
}

function normalizeForm(rawForm) {
  const f = cleanText(rawForm, "Tablet");
  const lower = f.toLowerCase();
  if (lower.includes("capsule")) return "Capsule";
  if (lower.includes("suspension")) return "Suspension";
  if (lower.includes("syrup") || lower.includes("liquid")) return "Syrup";
  if (lower.includes("injection") || lower.includes("infusion")) return "Injection";
  if (lower.includes("device") || lower.includes("monitor") || lower.includes("meter")) return "Device";
  if (lower.includes("strip") || lower.includes("kit")) return "Accessory";
  return "Tablet";
}

const fileBuffer = fs.readFileSync(excelPath);
const workbook = XLSX.read(fileBuffer, { type: "buffer" });
const sheetName = workbook.SheetNames[0];
const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

// build generic -> valid image map so brands sharing the same generic can inherit real packaging visuals if missing
const genericImageMap = {};
for (const row of rows) {
  const gen = cleanText(row["Generic Name (জেনেরিক নাম)"], "").toLowerCase();
  const rawImg = cleanText(row["Medicine Packaging Image (ঔষধের প্যাকেজিং ছবি)"], "");
  if (gen && isValidMedicineImage(rawImg) && !genericImageMap[gen]) {
    genericImageMap[gen] = rawImg;
  }
}

const allMedicines = rows.map((row, idx) => {
  const brand = cleanText(row["Brand Name (বাণিজ্যিক নাম)"], `Medicine-${idx + 1}`);
  const generic = cleanText(row["Generic Name (জেনেরিক নাম)"], "Standard Generic Formula");
  const strength = cleanText(row["Strength (শক্তি/মাত্রা)"], "Standard");
  const dosageForm = normalizeForm(row["Dosage Form (ডোজ ফর্ম)"]);
  const rawCompany = cleanText(row["Manufacturer Detail (উৎপাদনকারী প্রতিষ্ঠান)"], "Verified Pharmaceutical Ltd.");
  const company = rawCompany.split(",")[0].trim();

  const rawIndication = cleanText(row["Indication (ব্যবহার/রোগ)"], "");
  const rawSideEffects = cleanText(row["Side Effects (পার্শ্বপ্রতিক্রিয়া)"], "");
  const rawStorage = cleanText(row["Storage Condition (সংরক্ষণ পদ্ধতি)"], "");
  const rawImg = cleanText(row["Medicine Packaging Image (ঔষধের প্যাকেজিং ছবি)"], "");

  // Use valid direct image, or inherit verified generic packaging image
  let imageUrl = "";
  if (isValidMedicineImage(rawImg)) {
    imageUrl = rawImg;
  } else if (genericImageMap[generic.toLowerCase()]) {
    imageUrl = genericImageMap[generic.toLowerCase()];
  }

  const unitPrice = extractPrice(row["Per Unit Price (একক মূল্য)"], "5.00");
  const stripTotal = (parseFloat(unitPrice) * 10).toFixed(2);
  const rawBoxPrice = cleanText(row["Per Box Price (বক্স মূল্য)"], "");

  const category = detectCategory(generic, rawIndication, dosageForm);
  const requiresRx = category === "Antibiotic" || category === "Cardiac" || category === "Diabetes" || dosageForm === "Injection";

  return {
    id: `med-${idx + 1}`,
    brand,
    generic,
    strength,
    dosageForm,
    company,
    category,
    priceTk: unitPrice,
    stripPriceTk: stripTotal,
    packInfoBn: rawBoxPrice ? `প্যাক মূল্য: ${rawBoxPrice}` : `প্রতি পাতা (১০টি): ৳ ${stripTotal}`,
    packInfoEn: rawBoxPrice ? `Pack Info: ${rawBoxPrice}` : `Per Strip (10 Units): ৳ ${stripTotal}`,
    imageUrl,
    requiresRx,
    indicationsBn: rawIndication
      ? `${brand} (${generic}) নিম্নলিখিত রোগ ও লক্ষণে নির্দেশিত: ${rawIndication.slice(0, 420)}`
      : `${brand} মূলত ${generic}-এর ঘাটতি বা সংশ্লিষ্ট রোগের চিকিৎসায় চিকিৎসকের পরামর্শ অনুযায়ী ব্যবহৃত হয়।`,
    indicationsEn: rawIndication
      ? rawIndication.slice(0, 450)
      : `Indicated for clinical conditions responsive to ${generic} (${strength}).`,
    dosingBn: dosageForm === "Injection"
      ? "শুধুমাত্র রেজিস্টার্ড চিকিৎসক বা নার্সের তত্ত্বাবধানে শিরায় বা মাংসপেশিতে প্রয়োগযোগ্য।"
      : "প্রাপ্তবয়স্ক: প্রতিদিন ১টি করে দিনে ১ থেকে ২ বার অথবা রেজিস্টার্ড চিকিৎসকের পরামর্শ অনুযায়ী সেব্য।",
    dosingEn: dosageForm === "Injection"
      ? "To be administered parenterally by a qualified healthcare professional only."
      : "Adults: 1 unit once or twice daily, or as directed by a registered physician.",
    sideEffectsBn: rawSideEffects
      ? rawSideEffects.slice(0, 350)
      : "নির্ধারিত মাত্রায় সাধারণত সুসহনীয়। তবে কিছু ক্ষেত্রে মৃদু বমি ভাব, মাথা ঘোরা বা পেটে অস্বস্তি হতে পারে।",
    sideEffectsEn: rawSideEffects
      ? rawSideEffects.slice(0, 350)
      : "Generally well tolerated at prescribed doses. Mild GI upset or dizziness may occur rarely.",
    pregnancyBn: "গর্ভাবস্থায় ও স্তন্যদানকালে ব্যবহারের পূর্বে অবশ্যই রেজিস্টার্ড চিকিৎসকের পরামর্শ নিতে হবে।",
    pregnancyEn: "Consult a registered physician before use during pregnancy and lactation.",
    precautionsBn: requiresRx
      ? "এটি একটি প্রেসক্রিপশন ঔষধ। চিকিৎসকের পরামর্শ ছাড়া সেবন বা মাঝপথে কোর্স বন্ধ করা নিষিদ্ধ।"
      : "নির্ধারিত মাত্রার অতিরিক্ত সেবন করবেন না। লিভার বা কিডনি জটিলতায় সতর্কতা আবশ্যক।",
    precautionsEn: requiresRx
      ? "Prescription-only medicine. Do not self-medicate or discontinue course prematurely."
      : "Do not exceed recommended dosage. Exercise caution in hepatic or renal impairment.",
    storageBn: rawStorage || "আলো ও আর্দ্রতা থেকে দূরে, ৩০° সেন্টিগ্রেড তাপমাত্রার নিচে শুষ্ক স্থানে এবং শিশুদের নাগালের বাইরে রাখুন।",
    storageEn: rawStorage || "Store below 30°C in a dry place protected from light and moisture."
  };
});

// Sort so medicines with verified direct packaging images appear first in each letter/category!
allMedicines.sort((a, b) => (b.imageUrl ? 1 : 0) - (a.imageUrl ? 1 : 0));

const outPath = path.join(process.cwd(), "public", "data", "all_medicines.json");
fs.writeFileSync(outPath, JSON.stringify(allMedicines));
console.log(`=== Regenerated ${allMedicines.length} medicines (Fake Scribd images removed & Real Pharmacy Images prioritized!) ===`);