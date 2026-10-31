/**
 * JibonJotno (জীবনযত্ন) — 20+ Health Guides & Rog Protikar
 */

import React from "react";

export default function HealthGuidesPage() {
  const healthGuides = [
    { title: "১. ডেঙ্গু জ্বর ও প্রতিকার", category: "ভাইরাল জ্বর", desc: "প্রচণ্ড জ্বর, গায়ে ব্যথা, প্লাটিলেট কমে যাওয়া। করণীয়: প্রচুর তরল খাবার খাওয়া, প্যারাসিটামল সেবন এবং চিকিৎসকের পরামর্শ নেওয়া।" },
    { title: "২. উচ্চ রক্তচাপ (Hypertension)", category: "হৃদরোগ", desc: "মাথা ঘোরা, বুক ধড়ফড় করা। করণীয়: লবণ কম খাওয়া, নিয়মিত হাঁটাহাঁটি করা এবং প্রেসার মাপা।" },
    { title: "৩. ডায়াবেটিস নিয়ন্ত্রণ", category: "মেটাবলিক", desc: "অতিরিক্ত তৃষ্ণা ও ক্লান্তি। করণীয়: মিষ্টিজাতীয় খাবার পরিহার করা, সুগার চেক করা এবং ইনসুলিন/ওষুধ নিয়মমতো নেওয়া।" },
    { title: "৪. গ্যাস্ট্রিক ও পেটের আলসার", category: "পরিপাক", desc: "বুক জ্বালাপোড়া ও বমি ভাব। করণীয়: সময়মতো খাবার খাওয়া, অতিরিক্ত তেল-মসলাযুক্ত খাবার বর্জন করা।" },
    { title: "৫. হাঁপানি বা অ্যাজমা", category: "শ্বাসনালী", desc: "শ্বাসকষ্ট ও বুকে শোঁ শোঁ শব্দ। করণীয়: ধুলাবালি থেকে দূরে থাকা, ইনহেলার ব্যবহার করা।" },
    { title: "৬. সর্দি, কাশি ও ফ্লু", category: "সংক্রামক", desc: "গলা ব্যথা ও নাক দিয়ে পানি পড়া। করণীয়: কুসুম গরম পানি পান করা, ভিটামিন সি খাওয়া।" },
    { title: "৭. মাইগ্রেন ও তীব্র মাথা ব্যথা", category: "স্নায়ু", desc: "মাথার একপাশে দপদপে ব্যথা। করণীয়: অন্ধকার ঘরে বিশ্রাম নেওয়া, অতিরিক্ত শব্দ ও আলো থেকে দূরে থাকা।" },
    { title: "৮. কিডনি পাথুরে রোগ", category: "রেনাল", desc: "পিঠে তীব্র ব্যথা ও প্রস্রাবে সমস্যা। করণীয়: দিনে অন্তত ৩-৪ লিটার পানি পান করা।" },
    { title: "৯. জন্ডিস (হেপাটাইটিস)", category: "লিভার", desc: "চোখ ও প্রস্রাব হলুদ হওয়া। করণীয়: সম্পূর্ণ বিশ্রাম, ফোটানো পানি ও সহজপাচ্য খাবার খাওয়া।" },
    { title: "১০. বাত ও হাড়ের সংযোগস্থলের ব্যথা", category: "অর্থোপেডিক্স", desc: "সন্ধান বা গিঁটে ব্যথা ও ফুলে যাওয়া। করণীয়: হালকা ব্যায়াম, ক্যালসিয়াম ও ভিটামিন ডি গ্রহণ।" },
    { title: "১১. চর্মরোগ ও এলার্জি", category: "ডার্মাটোলজি", desc: "ত্বকে চুলকানি ও লালচে দানা। করণীয়: পরিষ্কার-পরিচ্ছন্ন থাকা, এলার্জিক খাবার বর্জন করা।" },
    { title: "১২. টাইফয়েড জ্বর", category: "সংক্রামক", desc: "দীর্ঘস্থায়ী জ্বর ও পেটে ব্যথা। করণীয়: রক্ত পরীক্ষা করানো এবং সম্পূর্ণ কোর্স অ্যান্টিবায়োটিক খাওয়া।" },
    { title: "১৩. হৃদরোগ বা হার্ট অ্যাটাক সতর্কতা", category: "কার্ডিওলজি", desc: "বুকে চাপ বা ব্যথা যা বাম হাতে ছড়িয়ে পড়ে। করণীয়: অবিলম্বে হাসপাতালে নেওয়া, এসপিরিন বা ডিসপিরিন সেবন।" },
    { title: "১৪. প্যানিক অ্যাটাক ও মানসিক উদ্বেগ", category: "মানসিক স্বাস্থ্য", desc: "অতিরিক্ত ভয় ও বুক ধড়ফড় করা। করণীয়: দীর্ঘ শ্বাস নেওয়া, মন শান্ত রাখা।" },
    { title: "১৫. থাইরয়েড জটিলতা", category: "হরমোন", desc: "ওজন বৃদ্ধি বা হ্রাস এবং অতিরিক্ত ক্লান্তি। করণীয়: টিএসএইচ পরীক্ষা ও হরমোন বিশেষজ্ঞের পরামর্শ।" },
    { title: "১৬. রক্তস্বল্পতা বা অ্যানিমিয়া", category: "রক্তরোগ", desc: "শরীর ফ্যাকাশে হওয়া ও দুর্বলতা। করণীয়: আয়রন সমৃদ্ধ খাবার (ডাল, শাকসবজি, কলিজা) খাওয়া।" },
    { title: "১৭. সাইনুসাইটিস", category: "নাক-কান-গলা", desc: "মাথা ভারী লাগা ও নাক বন্ধ থাকা। করণীয়: ভাব নেওয়া ও চিকিৎসকের পরামর্শে ড্রপ ব্যবহার।" },
    { title: "১৮. ফুড পয়জনং", category: "পরিপাক", desc: "বমি, পাতলা পায়খানা ও পেটে মোচড়। করণীয়: ওরস্যালাইন খাওয়া, হালকা খাবার খাওয়া।" },
    { title: "১৯. চোখের ইনফেকশন (কনজাংটিভাইটিস)", category: "চক্ষু", desc: "চোখ লাল হওয়া ও পানি পড়া। করণীয়: চশমা ব্যবহার করা, হাত পরিষ্কার রাখা।" },
    { title: "২০. কোমর ও পিঠের ব্যথা", category: "ফিজিওথেরাপি", desc: "দীর্ঘক্ষণ বসে কাজ করার ফলে ব্যথা। করণীয়: সঠিক ভঙ্গিতে বসা, নিয়মিত স্ট্রেচিং করা।" }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans text-slate-800">
      {/* Header */}
      <header className="bg-emerald-800 text-white shadow-md px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <a href="/" className="text-xl font-bold">জীবনযত্ন (JibonJotno)</a>
          <span className="bg-teal-700 text-xs px-2.5 py-1 rounded font-semibold">স্বাস্থ্য গাইড ও প্রাথমিক চিকিৎসা (২০+ রোগ)</span>
        </div>
        <div>
          <a href="/" className="text-sm bg-emerald-700 hover:bg-emerald-600 px-3.5 py-1.5 rounded transition">হোম পেজ</a>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12 flex-1 w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">স্বাস্থ্য নির্দেশিকা ও রোগ প্রতিকার</h1>
          <p className="text-slate-600 text-sm">বাংলাদেশের সাধারণ রোগসমূহ, লক্ষণ এবং প্রাথমিক করণীয় সম্পর্কে বিস্তারিত জানুন।</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {healthGuides.map((guide, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-500 transition flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">{guide.category}</span>
                <h3 className="font-bold text-slate-900 text-base mt-3 mb-2">{guide.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">{guide.desc}</p>
              </div>
              <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-xs">
                <span className="text-slate-400">যাচাইকৃত তথ্য</span>
                <span className="text-emerald-700 font-bold">পরামর্শ পড়ুন →</span>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        &copy; ২০২৬ জীবনযত্ন (JibonJotno). সর্বস্বত্ব সংরক্ষিত।
      </footer>
    </div>
  );
}