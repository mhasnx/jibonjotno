"use client";

import React, { useState, useMemo } from "react";
import PublicNavbar from "@/components/layout/PublicNavbar";
import { useLanguage } from "@/context/LanguageContext";

interface HealthGuide {
  id: number;
  titleBn: string;
  titleEn: string;
  categoryBn: string;
  categoryEn: string;
  symptomsBn: string;
  symptomsEn: string;
  remedyBn: string;
  remedyEn: string;
  preventionBn: string;
  preventionEn: string;
  hospitalWarningBn: string;
  hospitalWarningEn: string;
}

const HEALTH_GUIDES_DB: HealthGuide[] = [
  { id: 1, titleBn: "১. ডেঙ্গু জ্বর ও প্রতিকার", titleEn: "1. Dengue Fever & Management", categoryBn: "সংক্রামক ও জ্বর", categoryEn: "Infectious & Fever", symptomsBn: "তীব্র জ্বর (১০৩-১০৪ ডিগ্রি), চোখের পেছনে ব্যথা, মাংসপেশিতে তীব্র ব্যথা ও শরীরে লালচে র‍্যাশ।", symptomsEn: "High fever (103-104°F), retro-orbital eye pain, severe muscle/joint ache, and skin rashes.", remedyBn: "প্রচুর তরল খাবার (ডাবের পানি, ওরস্যালাইন) পান করা। জ্বর কমাতে শুধুমাত্র প্যারাসিটামল সেবন করা। অ্যাসপিরিন সম্পূর্ণ নিষিদ্ধ।", remedyEn: "Ample hydration (ORS, coconut water). Paracetamol for fever. Avoid NSAIDs/Aspirin.", preventionBn: "জমে থাকা পানি পরিষ্কার রাখা এবং মশারি ব্যবহার করা।", preventionEn: "Eliminate stagnant water and use mosquito nets.", hospitalWarningBn: "প্লাটিলেট দ্রুত কমে গেলে বা মাড়ি দিয়ে রক্ত পড়লে অবিলম্বে হাসপাতালে নিন।", hospitalWarningEn: "Severe abdominal pain or bleeding requires urgent hospitalization." },
  { id: 2, titleBn: "২. উচ্চ রক্তচাপ (Hypertension)", titleEn: "2. Hypertension Management", categoryBn: "হৃদরোগ ও রক্তচাপ", categoryEn: "Cardiovascular", symptomsBn: "ঘাড়ে ব্যথা, মাথা ঘোরা, বুক ধড়ফড় করা এবং ঝাপসা দেখা।", symptomsEn: "Neck stiffness, dizziness, palpitations, and blurred vision.", remedyBn: "প্রতিদিন নিয়মিত রক্তচাপের ওষুধ খাওয়া এবং মানসিক চাপমুক্ত থাকা।", remedyEn: "Take prescribed antihypertensives consistently and avoid stress.", preventionBn: "কাঁচা লবণ সম্পূর্ণ বর্জন করা এবং প্রতিদিন ৩০ মিনিট হাঁটা।", preventionEn: "Eliminate raw table salt and exercise 30 minutes daily.", hospitalWarningBn: "রক্তচাপ ১৮০/১২০ এর উপরে উঠলে বা বুকে ব্যথা হলে দ্রুত হাসপাতালে নিন।", hospitalWarningEn: "BP above 180/120 or chest pain needs emergency evaluation." },
  { id: 3, titleBn: "৩. ডায়াবেটিস নিয়ন্ত্রণ", titleEn: "3. Diabetes Control", categoryBn: "মেটাবলিক ও হরমোন", categoryEn: "Metabolic", symptomsBn: "ঘন ঘন প্রস্রাব, অতিরিক্ত তৃষ্ণা, ওজন কমে যাওয়া এবং ক্লান্তি।", symptomsEn: "Frequent urination, excessive thirst, unintended weight loss, and fatigue.", remedyBn: "নিয়মিত রক্তের গ্লুকোজ পরীক্ষা এবং চিকিৎসকের নির্দেশ মতো ওষুধ/ইনসুলিন নেওয়া।", remedyEn: "Regular blood glucose monitoring and timely insulin/oral medications.", preventionBn: "চিনি ও মিষ্টি পরিহার এবং খাদ্যতালিকায় আঁশযুক্ত খাবার রাখা।", preventionEn: "Cut refined sugar and eat fiber-rich vegetables.", hospitalWarningBn: "সুগার হঠাৎ খুব কমে গেলে (হাইপোগ্লাইসেমিয়া) বা অতিবৃদ্ধি হলে।", hospitalWarningEn: "Sudden hypoglycemia (tremor/sweat) or severe hyperglycemia." },
  { id: 4, titleBn: "৪. গ্যাস্ট্রিক ও পেপটিক আলসার", titleEn: "4. Gastritis & Peptic Ulcer", categoryBn: "পরিপাকতন্ত্র", categoryEn: "Gastrointestinal", symptomsBn: "বুক ও পেটে জ্বালাপোড়া, টক ঢেকুর এবং পেট ফাঁপা।", symptomsEn: "Epigastric burning, acid regurgitation, and bloating.", remedyBn: "খাবারের ৩০ মিনিট আগে অ্যান্টাসিড বা ইসোমিপ্রাজল সেবন।", remedyEn: "Antacids or PPIs taken 30 minutes before meals.", preventionBn: "ভাজাপোড়া বর্জন এবং সময়মতো খাবার খাওয়া।", preventionEn: "Avoid oily deep-fried foods and maintain consistent meal times.", hospitalWarningBn: "কালো পায়খানা বা রক্ত বমি হলে দ্রুত গ্যাস্ট্রোএন্টারোলজিস্ট দেখান।", hospitalWarningEn: "Black stools or hematemesis requires immediate attention." },
  { id: 5, titleBn: "৫. হাঁপানি বা অ্যাজমা", titleEn: "5. Bronchial Asthma", categoryBn: "শ্বাসনালী", categoryEn: "Respiratory", symptomsBn: "শ্বাসকষ্ট, বুকে বাঁশির মতো শব্দ ও রাতে শুকনো কাশি।", symptomsEn: "Dyspnea, wheezing, chest tightness, and nocturnal cough.", remedyBn: "তাৎক্ষণিক সালবিউটামল রিলিভার ইনহেলার বা নেবুলাইজার নেওয়া।", remedyEn: "Immediate salbutamol reliever inhaler or nebulization.", preventionBn: "ধুলাবালি, ঠান্ডা বাতাস ও অ্যালার্জেন এড়িয়ে চলা।", preventionEn: "Avoid dust, cold air, smoking, and known allergens.", hospitalWarningBn: "ইনহেলারে শ্বাসকষ্ট না কমলে বা ঠোঁট নীল হয়ে গেলে দ্রুত অক্সিজেন দিন।", hospitalWarningEn: "Persistent cyanosis or unresponsive wheezing needs oxygen." },
  { id: 6, titleBn: "৬. সর্দি ও ইনফ্লুয়েঞ্জা ফ্লু", titleEn: "6. Cold & Seasonal Flu", categoryBn: "সংক্রামক ও জ্বর", categoryEn: "Infectious & Fever", symptomsBn: "নাক বন্ধ, হাঁচি, গলা ব্যথা এবং হালকা জ্বর।", symptomsEn: "Nasal congestion, sneezing, sore throat, and mild fever.", remedyBn: "গরম পানির ভাপ নেওয়া, কুসুম লবণ-পানিতে গড়গড়া ও ভিটামিন সি গ্রহণ।", remedyEn: "Steam inhalation, warm saline gargling, and Vitamin C intake.", preventionBn: "মাস্ক ব্যবহার এবং নিয়মিত সাবান দিয়ে হাত ধোয়া।", preventionEn: "Wear masks in crowded spots and practice hand hygiene.", hospitalWarningBn: "এক সপ্তাহের বেশি জ্বর বা কফের সাথে রক্ত এলে।", hospitalWarningEn: "Fever persisting over 7 days or hemoptysis." },
  { id: 7, titleBn: "৭. মাইগ্রেন ও তীব্র মাথাব্যথা", titleEn: "7. Migraine & Headaches", categoryBn: "স্নায়ু ও মানসিক", categoryEn: "Neurological", symptomsBn: "মাথার একপাশে দপদপে তীব্র ব্যথা ও আলো-শব্দে অস্বস্তি।", symptomsEn: "Unilateral throbbing headache, photophobia, and nausea.", remedyBn: "অন্ধকার নিরিবিলি ঘরে বিশ্রাম ও চিকিৎসকের পরামর্শে ট্রিপটান গ্রহণ।", remedyEn: "Rest in a dark quiet room and use prescribed migraine medication.", preventionBn: "পর্যাপ্ত ৭-৮ ঘণ্টা ঘুম ও নির্দিষ্ট সময়ে খাবার খাওয়া।", preventionEn: "Maintain regular 7-8 hours sleep and regular hydration.", hospitalWarningBn: "হঠাৎ বিদ্যুৎ চমকানোর মতো তীব্র ব্যথা ও ঘাড় শক্ত হয়ে গেলে।", hospitalWarningEn: "Thunderclap sudden headache requires emergency brain scan." },
  { id: 8, titleBn: "৮. কিডনি রোগ ও ইউরিনারি ইনফেকশন", titleEn: "8. Kidney Health & UTI", categoryBn: "কিডনি ও মূত্রনালী", categoryEn: "Renal & Urology", symptomsBn: "কোমরের পেছনে ব্যথা, প্রস্রাবে জ্বালাপোড়া ও ঘোলাটে প্রস্রাব।", symptomsEn: "Flank pain, dysuria, burning sensation, and cloudy urine.", remedyBn: "দিনে অন্তত ৩-৪ লিটার বিশুদ্ধ পানি পান করা ও অ্যান্টিবায়োটিক সম্পন্ন করা।", remedyEn: "Drink 3-4 liters of pure water daily and complete antibiotic courses.", preventionBn: "প্রস্রাব আটকে না রাখা ও অতিরিক্ত লবণ বর্জন করা।", preventionEn: "Avoid withholding urine and reduce excess sodium intake.", hospitalWarningBn: "প্রস্রাব বন্ধ হয়ে গেলে বা কাঁপুনি দিয়ে উচ্চ জ্বর এলে।", hospitalWarningEn: "Anuria or high fever with rigors requires urgent hospital care." },
  { id: 9, titleBn: "৯. জন্ডিস (হেপাটাইটিস)", titleEn: "9. Viral Hepatitis & Jaundice", categoryBn: "পরিপাকতন্ত্র", categoryEn: "Gastrointestinal", symptomsBn: "চোখ ও প্রস্রাব হলুদ হওয়া, খাবারে অরুচি ও দুর্বলতা।", symptomsEn: "Scleral icterus, dark urine, anorexia, and profound fatigue.", remedyBn: "সম্পূর্ণ শারীরিক বিশ্রাম ও ফোটানো বিশুদ্ধ পানি পান করা।", remedyEn: "Absolute physical rest and safe boiled drinking water.", preventionBn: "রাস্তার খোলা পানীয় ও খাবার এড়িয়ে চলা এবং টিকা নেওয়া।", preventionEn: "Avoid unhygienic street drinks and get Hepatitis vaccination.", hospitalWarningBn: "রোগী প্রলাপ বকলে বা রক্তপাত হলে দ্রুত আইসিইউতে স্থানান্তর।", hospitalWarningEn: "Hepatic encephalopathy or bleeding requires intensive care." },
  { id: 10, titleBn: "১০. বাত ও হাড়ের জয়েন্টের ব্যথা", titleEn: "10. Arthritis & Joint Pain", categoryBn: "অর্থোপেডিক্স", categoryEn: "Orthopedics", symptomsBn: "হাঁটু ও আঙুলের গিঁটে ব্যথা, সকালে শক্ত হয়ে থাকা।", symptomsEn: "Morning stiffness, knee/finger joint pain, and swelling.", remedyBn: "হালকা গরম সেঁক, ক্যালসিয়াম-ডি ও ফিজিওথেরাপি।", remedyEn: "Warm compress, Calcium+Vitamin D supplements, and physiotherapy.", preventionBn: "ওজন নিয়ন্ত্রণ ও প্রতিদিন হালকা ব্যায়াম।", preventionEn: "Maintain optimal BMI and perform low-impact joint exercises.", hospitalWarningBn: "জয়েন্ট তীব্র ফুলে লাল হয়ে গেলে অর্থোপেডিক সার্জনের পরামর্শ নিন।", hospitalWarningEn: "Septic joint signs require urgent orthopedic drainage." },
  { id: 11, titleBn: "১১. চর্মরোগ ও অ্যালার্জি", titleEn: "11. Dermatitis & Allergies", categoryBn: "চর্মরোগ", categoryEn: "Dermatology", symptomsBn: "চামড়ায় লালচে চাকা, তীব্র চুলকানি ও র্যাশ।", symptomsEn: "Erythematous rashes, pruritus, and urticarial hives.", remedyBn: "অ্যান্টিহিস্টামিন গ্রহণ ও ময়েশ্চারাইজার ব্যবহার।", remedyEn: "Antihistamines and regular hypoallergenic moisturizers.", preventionBn: "অ্যালার্জি সৃষ্টিকারী খাদ্য চিহ্নিত করা ও রোদ থেকে বাঁচা।", preventionEn: "Avoid known food triggers and wear gentle cotton clothes.", hospitalWarningBn: "অ্যালার্জির কারণে গলা ফুলে শ্বাসকষ্ট (অ্যানাফিল্যাক্সিস) হলে।", hospitalWarningEn: "Anaphylaxis symptoms (throat swelling) require emergency Epinephrine." },
  { id: 12, titleBn: "১২. টাইফয়েড জ্বর", titleEn: "12. Enteric Typhoid Fever", categoryBn: "সংক্রামক ও জ্বর", categoryEn: "Infectious & Fever", symptomsBn: "ধাপে ধাপে বাড়া একটানা জ্বর, পেট ব্যথা ও দুর্বলতা।", symptomsEn: "Step-ladder rising fever, abdominal pain, and prostration.", remedyBn: "ব্লাড কালচার টেস্ট করিয়ে পূর্ণ মেয়াদের অ্যান্টিবায়োটিক সেবন।", remedyEn: "Blood culture diagnostics and complete antimicrobial course.", preventionBn: "নিরাপদ পানি পান ও রাস্তার খোলা খাবার বর্জন।", preventionEn: "Strict clean water protocols and hygienic food preparation.", hospitalWarningBn: "পেটে তীব্র যন্ত্রণা ও রক্তক্ষরণ হলে তাত্ক্ষণিক অস্ত্রোপচার প্রয়োজন।", hospitalWarningEn: "Intestinal perforation suspicion requires urgent hospital referral." },
  { id: 13, titleBn: "১৩. হার্ট অ্যাটাক সতর্কতা", titleEn: "13. Heart Attack Warning Signs", categoryBn: "হৃদরোগ ও রক্তচাপ", categoryEn: "Cardiovascular", symptomsBn: "বুকের মাঝে প্রচণ্ড চাপ যা বাম হাত বা চোয়ালে ছড়ায় ও ঘাম।", symptomsEn: "Crushing retrosternal chest pain radiating to left arm/jaw with diaphoresis.", remedyBn: "রোগীকে বসিয়ে রাখা এবং অবিলম্বে অ্যাসপিরিন চিবিয়ে খাওয়ানো।", remedyEn: "Keep patient calm at rest and chew 300mg Soluble Aspirin.", preventionBn: "ধূমপান সম্পূর্ণ ত্যাগ ও কোলেস্টেরল নিয়ন্ত্রণ।", preventionEn: "Absolute smoking cessation and lipid profile management.", hospitalWarningBn: "এক মুহূর্ত দেরি না করে কার্ডিয়াক সিসিইউ/হাসপাতালে নিন।", hospitalWarningEn: "Immediately transfer to a 24/7 CCU/Cath Lab facility." },
  { id: 14, titleBn: "১৪. প্যানিক ও মানসিক উদ্বেগ", titleEn: "14. Panic Attack & Anxiety", categoryBn: "স্নায়ু ও মানসিক", categoryEn: "Neurological", symptomsBn: "অকারণ ভয়, দম বন্ধ লাগা এবং তীব্র বুক ধড়ফড়।", symptomsEn: "Acute fear of impending doom, air hunger, and tachycardia.", remedyBn: "৪-৭-৮ শ্বাস-প্রশ্বাসের ব্যায়াম ও নিরাপদ আশ্বস্তকরণ।", remedyEn: "Box breathing techniques (4-7-8) and patient reassurance.", preventionBn: "নিয়মিত ঘুম ও অতিরিক্ত চা-কফি পরিহার।", preventionEn: "Adequate restorative sleep and limiting excessive caffeine.", hospitalWarningBn: "দৈনন্দিন স্বাভাবিক কাজকর্ম দীর্ঘমেয়াদে বাধাগ্রস্ত হলে মনোরোগ বিশেষজ্ঞের কাছে যান।", hospitalWarningEn: "Persistent debilitating anxiety requires psychiatric evaluation." },
  { id: 15, titleBn: "১৫. থাইরয়েড রোগ", titleEn: "15. Thyroid Disorders", categoryBn: "মেটাবলিক ও হরমোন", categoryEn: "Metabolic", symptomsBn: "ওজন হ্রাস বা বৃদ্ধি, ঠান্ডা-গরম সহ্য না হওয়া ও চুল পড়া।", symptomsEn: "Unexplained weight fluctuation, temperature intolerance, and alopecia.", remedyBn: "টিএসএইচ রক্ত পরীক্ষা করে নিয়মিত হরমোন ওষুধ গ্রহণ।", remedyEn: "Serum TSH profiling and consistent early-morning Levothyroxine.", preventionBn: "আয়োডিনযুক্ত লবণ ব্যবহার ও নিয়মিত রক্ত পরীক্ষা।", preventionEn: "Use iodized salt and regular endocrine follow-up.", hospitalWarningBn: "গলার গলগণ্ড ফোলা বড় হয়ে শ্বাস নিতে সমস্যা হলে।", hospitalWarningEn: "Rapid goiter enlargement causing stridor requires surgical opinion." },
  { id: 16, titleBn: "১৬. রক্তস্বল্পতা (অ্যানিমিয়া)", titleEn: "16. Iron Deficiency Anemia", categoryBn: "মেটাবলিক ও হরমোন", categoryEn: "Metabolic", symptomsBn: "ফ্যাকাশে চোখ ও ত্বক, অল্পতেই হাঁপিয়ে যাওয়া ও মাথা ঘোরা।", symptomsEn: "Pallor of conjunctiva and skin, exertion dyspnea, and lethargy.", remedyBn: "আয়রন ও ফলিক অ্যাসিড ট্যাবলেট এবং পুষ্টিকর খাবার।", remedyEn: "Elemental iron supplements alongside Vitamin C for absorption.", preventionBn: "শাকসবজি, ডালিম, কলিজা ও ছোট মাছ গ্রহণ।", preventionEn: "Consume dark leafy greens, pomegranate, liver, and eggs.", hospitalWarningBn: "হিমোগ্লোবিন ৭ এর নিচে নামলে রক্ত সঞ্চালন লাগতে পারে।", hospitalWarningEn: "Severe anemia with Hb < 7 g/dL may necessitate blood transfusion." },
  { id: 17, titleBn: "১৭. সাইনুসাইটিস", titleEn: "17. Acute Sinusitis", categoryBn: "শ্বাসনালী", categoryEn: "Respiratory", symptomsBn: "কপালে ও নাকের পাশে ভারী ব্যথা এবং ঘন হলুদ সর্দি।", symptomsEn: "Facial pressure, frontal headache, and purulent nasal discharge.", remedyBn: "গরম বাষ্পের ভাপ ও স্যালাইন নেসাল স্প্রে ব্যবহার।", remedyEn: "Steam inhalation and hypertonic nasal saline irrigations.", preventionBn: "ধুলাবালি পরিহার ও গোসলের পর দ্রুত মাথা মোছা।", preventionEn: "Avoid sudden cold shifts and keep sinuses clear.", hospitalWarningBn: "চোখের পাতা ফুলে লাল হয়ে গেলে চক্ষু বিশেষজ্ঞ দেখান।", hospitalWarningEn: "Periorbital swelling or diplopia needs urgent ENT assessment." },
  { id: 18, titleBn: "১৮. ডায়রিয়া ও ফুড পয়জনিং", titleEn: "18. Diarrhea & Gastroenteritis", categoryBn: "পরিপাকতন্ত্র", categoryEn: "Gastrointestinal", symptomsBn: "ঘন পাতলা পায়খানা, বমি ও পেটে তীব্র মোচড়।", symptomsEn: "Watery stools, repeated emesis, and abdominal cramps.", remedyBn: "প্রতিবার পায়খানার পর স্যালাইন ও ডাবের পানি খাওয়া।", remedyEn: "Oral Rehydration Salts (ORS) solution after every loose motion.", preventionBn: "খাওয়ার আগে সাবান দিয়ে হাত ধোয়া ও বিশুদ্ধ পানি পান।", preventionEn: "Wash hands with soap and consume safely cooked warm foods.", hospitalWarningBn: "প্রস্রাব বন্ধ হওয়া বা চোখ গর্তে ঢুকে গেলে স্যালাইন ইনজেকশন দিন।", hospitalWarningEn: "Signs of severe dehydration (lethargy, anuria) mandate IV fluids." },
  { id: 19, titleBn: "১৯. চোখের কনজাংটিভাইটিস (চোখ ওঠা)", titleEn: "19. Viral Conjunctivitis", categoryBn: "চক্ষু", categoryEn: "Ophthalmology", symptomsBn: "চোখ লাল হওয়া, চুলকানি, পানি পড়া ও পিঁচুটি জমা।", symptomsEn: "Conjunctival hyperaemia, foreign body sensation, and crusting.", remedyBn: "জীবাণুমুক্ত তুলা দিয়ে চোখ পরিষ্কার ও অ্যান্টিবায়োটিক ড্রপ।", remedyEn: "Gentle eyelid cleansing with boiled water cotton and antibiotic drops.", preventionBn: "চোখে হাত না দেওয়া ও কালো রোদচশমা ব্যবহার।", preventionEn: "Avoid rubbing eyes and maintain dedicated personal towels.", hospitalWarningBn: "দৃষ্টিশক্তি কমে গেলে বা তীব্র চোখের ব্যথায় জরুরি চক্ষু ডাক্তার দেখান।", hospitalWarningEn: "Visual acuity loss or severe ocular pain requires immediate eye clinic visit." },
  { id: 20, titleBn: "২০. কোমর ও স্পাইনাল ব্যথা", titleEn: "20. Low Back Pain & Ergonomics", categoryBn: "অর্থোপেডিক্স", categoryEn: "Orthopedics", symptomsBn: "দীর্ঘক্ষণ বসে থাকলে কোমরে টান ও পায়ে ঝিনঝিন অনুভূতি।", symptomsEn: "Lumbar pain, muscle spasm, and sciatic radiation down legs.", remedyBn: "শক্ত বিছানায় শোয়া, গরম সেঁক ও নির্দিষ্ট স্ট্রেচিং এক্সারসাইজ।", remedyEn: "Firm ergonomic mattress, warmth, and core strengthening exercises.", preventionBn: "সোজা হয়ে বসা ও প্রতি ৪০ মিনিট পরপর বিরতি নেওয়া।", preventionEn: "Maintain ergonomic posture and avoid prolonged sedentary postures.", hospitalWarningBn: "পা অসাড় হয়ে প্রস্রাব-পায়খানার নিয়ন্ত্রণ হারালে জরুরি অপারেশন।", hospitalWarningEn: "Cauda equina signs (saddle anesthesia/incontinence) need emergency neurosurgery." }
];

export default function HealthArticlesPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeGuide, setActiveGuide] = useState<HealthGuide | null>(null);
  const { t } = useLanguage();

  const categories = [
    { label: t("সকল রোগ (২০টি)", "All Diseases (20)"), value: "All" },
    { label: t("সংক্রামক ও জ্বর", "Infectious & Fever"), value: "Infectious" },
    { label: t("হৃদরোগ ও রক্তচাপ", "Cardiovascular"), value: "Cardio" },
    { label: t("পরিপাকতন্ত্র", "Gastrointestinal"), value: "GI" },
    { label: t("শ্বাসনালী", "Respiratory"), value: "Respiratory" },
    { label: t("মেটাবলিক ও হরমোন", "Metabolic"), value: "Metabolic" },
    { label: t("অর্থোপেডিক্স", "Orthopedics"), value: "Ortho" },
  ];

  const filteredGuides = useMemo(() => {
    return HEALTH_GUIDES_DB.filter((g) => {
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        g.titleBn.toLowerCase().includes(q) ||
        g.titleEn.toLowerCase().includes(q) ||
        g.symptomsBn.toLowerCase().includes(q) ||
        g.symptomsEn.toLowerCase().includes(q);

      if (selectedCategory === "All") return matchesSearch;
      if (selectedCategory === "Infectious") return matchesSearch && g.categoryEn.includes("Infectious");
      if (selectedCategory === "Cardio") return matchesSearch && g.categoryEn.includes("Cardiovascular");
      if (selectedCategory === "GI") return matchesSearch && g.categoryEn.includes("Gastrointestinal");
      if (selectedCategory === "Respiratory") return matchesSearch && g.categoryEn.includes("Respiratory");
      if (selectedCategory === "Metabolic") return matchesSearch && g.categoryEn.includes("Metabolic");
      if (selectedCategory === "Ortho") return matchesSearch && g.categoryEn.includes("Orthopedics");
      return matchesSearch;
    });
  }, [search, selectedCategory]);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-between font-sans text-slate-800 pb-16 lg:pb-0">
      <PublicNavbar />

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 flex-1 w-full">
        <div className="bg-[#0f4c3a] text-white rounded-3xl p-7 md:p-11 shadow-lg mb-8">
          <span className="text-xs font-bold uppercase tracking-wider bg-emerald-800 text-emerald-200 px-3 py-1 rounded-full">
            🩺 {t("যাচাইকৃত স্বাস্থ্য নির্দেশিকা ও প্রাথমিক চিকিৎসা", "Verified Primary Treatment Guides")}
          </span>
          <h1 className="text-2xl md:text-4xl font-extrabold mt-3 mb-2">
            {t("স্বাস্থ্য আর্টিকেলে: ২০+ রোগের লক্ষণ ও প্রতিকার", "Health Guides: 20+ Diseases & Primary Treatments")}
          </h1>
          <p className="text-emerald-100/80 text-xs md:text-sm max-w-2xl mb-6">
            {t(
              "বাংলাদেশের সচরাচর ঘটে থাকা ২০টি প্রধান রোগের লক্ষণ, ঘরোয়া ও প্রাথমিক চিকিৎসা, প্রতিরোধের উপায় এবং কখন দ্রুত হাসপাতালে যাবেন তার পূর্ণাঙ্গ নির্দেশিকা।",
              "Comprehensive clinical guidance covering signs, immediate primary remedies, preventive measures, and red-flag hospital symptoms for 20 major health conditions."
            )}
          </p>

          <div className="max-w-xl bg-white rounded-full p-1.5 flex items-center shadow-md">
            <span className="pl-4 text-slate-400">🔍</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t(
                "রোগের নাম বা লক্ষণ লিখে খুঁজুন (যেমন: ডেঙ্গু, ডায়াবেটিস, বুকে ব্যথা)...",
                "Search disease name or symptoms (e.g., Dengue, Diabetes, Chest Pain)..."
              )}
              className="w-full px-3 py-2 text-sm text-slate-800 focus:outline-none rounded-full"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${
                selectedCategory === cat.value
                  ? "bg-[#0f4c3a] text-white shadow-xs"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGuides.map((g) => (
            <div
              key={g.id}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-emerald-600 transition flex flex-col justify-between"
            >
              <div>
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full">
                  {t(g.categoryBn, g.categoryEn)}
                </span>
                <h3 className="font-extrabold text-slate-900 text-base mt-3 mb-2">{t(g.titleBn, g.titleEn)}</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  <strong className="text-slate-800">{t("লক্ষণ:", "Signs:")}</strong> {t(g.symptomsBn, g.symptomsEn)}
                </p>
                <p className="text-xs text-emerald-900 bg-emerald-50/70 p-3 rounded-xl leading-relaxed mb-4">
                  <strong>{t("প্রাথমিক করণীয়:", "Primary Remedy:")}</strong> {t(g.remedyBn, g.remedyEn)}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">✓ {t("ভেরিফাইড গাইড", "Verified Clinical Info")}</span>
                <button
                  onClick={() => setActiveGuide(g)}
                  className="bg-[#0f4c3a] hover:bg-emerald-900 text-white px-4 py-1.5 rounded-full font-bold transition"
                >
                  {t("বিস্তারিত ও সতর্কতা ›", "Full Details ›")}
                </button>
              </div>
            </div>
          ))}
        </div>

        {activeGuide && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-xl w-full p-6 md:p-8 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                    {t(activeGuide.categoryBn, activeGuide.categoryEn)}
                  </span>
                  <h2 className="text-xl md:text-2xl font-black text-slate-900 mt-2">
                    {t(activeGuide.titleBn, activeGuide.titleEn)}
                  </h2>
                </div>
                <button
                  onClick={() => setActiveGuide(null)}
                  className="text-slate-400 hover:text-slate-700 text-lg font-bold p-1"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs md:text-sm text-slate-700">
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <strong className="text-slate-900 block mb-1">🔍 {t("প্রধান লক্ষণসমূহ:", "Key Symptoms:")}</strong>
                  <p>{t(activeGuide.symptomsBn, activeGuide.symptomsEn)}</p>
                </div>
                <div className="bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-100">
                  <strong className="text-emerald-950 block mb-1">💊 {t("প্রাথমিক চিকিৎসা ও করণীয়:", "Primary Care & Treatment:")}</strong>
                  <p>{t(activeGuide.remedyBn, activeGuide.remedyEn)}</p>
                </div>
                <div className="bg-blue-50/70 p-3.5 rounded-2xl border border-blue-100">
                  <strong className="text-blue-950 block mb-1">🛡️ {t("রোগ প্রতিরোধের উপায়:", "Preventive Measures:")}</strong>
                  <p>{t(activeGuide.preventionBn, activeGuide.preventionEn)}</p>
                </div>
                <div className="bg-rose-50 p-3.5 rounded-2xl border border-rose-200">
                  <strong className="text-rose-900 block mb-1">🚨 {t("কখন দ্রুত হাসপাতালে যাবেন:", "Red Flags (When to visit Emergency):")}</strong>
                  <p className="text-rose-800">{t(activeGuide.hospitalWarningBn, activeGuide.hospitalWarningEn)}</p>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setActiveGuide(null)}
                  className="bg-[#0f4c3a] text-white px-6 py-2.5 rounded-xl text-xs font-bold"
                >
                  {t("বন্ধ করুন", "Close")}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-[#072e23] text-slate-300 py-8 text-center text-xs mt-12">
        <p className="font-bold text-white text-sm mb-1">জীবনযত্ন (JibonJotno)</p>
        <p className="text-slate-400">&copy; 2026 JibonJotno. All rights reserved.</p>
      </footer>
    </div>
  );
}