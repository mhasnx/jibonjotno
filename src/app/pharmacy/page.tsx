"use client";

import React, { useState, useEffect } from "react";
import PublicNavbar from "@/components/layout/PublicNavbar";
import { useLanguage } from "@/context/LanguageContext";
import { useCart, PlacedOrder } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { checkCartInteractions } from "@/lib/medical/drugInteractions";

const STORE_MEDICINES = [
  { id: "1", name: "Napa Extend (665 mg)", generic: "Paracetamol", company: "Beximco Pharmaceuticals Ltd.", price: 2.00, requiresRx: false, dosageForm: "Tablet", category: "Fever" },
  { id: "2", name: "Ace Plus (500mg+65mg)", generic: "Paracetamol + Caffeine", company: "Square Pharmaceuticals PLC", price: 3.00, requiresRx: false, dosageForm: "Tablet", category: "Fever" },
  { id: "3", name: "Sergel 20 (20 mg)", generic: "Esomeprazole Magnesium", company: "Healthcare Pharmaceuticals Ltd.", price: 7.00, requiresRx: false, dosageForm: "Capsule", category: "Gastric" },
  { id: "4", name: "3-C (200 mg) Antibiotic", generic: "Cefixime Trihydrate", company: "Edruc Limited", price: 35.00, requiresRx: true, dosageForm: "Capsule", category: "Antibiotic" },
  { id: "5", name: "Zimax 500 (500 mg)", generic: "Azithromycin", company: "Square Pharmaceuticals PLC", price: 35.00, requiresRx: true, dosageForm: "Tablet", category: "Antibiotic" },
  { id: "6", name: "Tori 90 (90 mg)", generic: "Etoricoxib", company: "Square Pharmaceuticals PLC", price: 14.00, requiresRx: false, dosageForm: "Tablet", category: "Pain" },
  { id: "7", name: "Rolac 10 (10 mg)", generic: "Ketorolac Tromethamine", company: "Renata Limited", price: 12.00, requiresRx: false, dosageForm: "Tablet", category: "Pain" },
  { id: "8", name: "3 Bion (Neuro Vitamin)", generic: "Vitamin B1, B6 & B12", company: "Jenphar Bangladesh Ltd.", price: 12.00, requiresRx: false, dosageForm: "Tablet", category: "Vitamin" },
  { id: "9", name: "Omron BP Monitor (HEM-7120)", generic: "Digital BP Device", company: "Omron Japan", price: 3200.00, requiresRx: false, dosageForm: "Device", category: "Equipment" },
];

export default function OnlinePharmacyPage() {
  const { t } = useLanguage();
  const { cart, addToCart, removeFromCart, updateQty, subtotal, placeOrder } = useCart();
  const { currentUser } = useAuth();

  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<PlacedOrder | null>(null);
  
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Dhaka");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (currentUser) {
      setCustomerName(currentUser.name || "");
      setPhone(currentUser.phone || "");
      setAddress(currentUser.address || "");
    }
  }, [currentUser]);

  const interactions = checkCartInteractions(cart);
  const deliveryFee = city === "Dhaka" ? 60 : 120;
  const grandTotal = subtotal > 0 ? subtotal + deliveryFee : 0;

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim() || !address.trim()) {
      setErrorMsg("অনুগ্রহ করে নাম, মোবাইল নম্বর এবং পূর্ণাঙ্গ ডেলিভারি ঠিকানা দিন।");
      return;
    }
    const order = placeOrder({
      customerName,
      phone,
      address,
      city,
      paymentMethod: "Cash on Delivery",
    });
    setCheckoutOpen(false);
    setConfirmedOrder(order);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-between font-sans text-slate-800 pb-16 lg:pb-0">
      <PublicNavbar />

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 flex-1 w-full space-y-8">
        <div className="bg-[#0f4c3a] text-white rounded-3xl p-7 md:p-11 shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="bg-amber-400 text-slate-950 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                💵 ১০০% ক্যাশ অন ডেলিভারি (Cash on Delivery)
              </span>
              <span className="bg-emerald-900/90 text-emerald-200 text-xs font-bold px-3 py-1 rounded-full border border-emerald-600">
                লগইন ছাড়াও সরাসরি অর্ডার করা যাবে
              </span>
            </div>
            <h1 className="text-2xl md:text-4xl font-extrabold mt-2 mb-2">
              {t("জীবনযত্ন অনলাইন ফার্মেসি ও মেডিসিন শপ", "JibonJotno Model E-Pharmacy")}
            </h1>
            <p className="text-emerald-100/85 text-xs md:text-sm max-w-2xl">
              {t(
                "ওষুধ হাতে পেয়ে দেখে মূল্য পরিশোধ করুন। ড্রাগ ইন্টারঅ্যাকশন গার্ড ও কোল্ড-চেইন ডেলিভারি সুরক্ষিত।",
                "Pay cash upon receiving and verifying your medicines. Cold-chain delivery & prescription audited."
              )}
            </p>
          </div>
          <div className="bg-white/10 border border-white/20 p-4 rounded-2xl text-xs space-y-1 shrink-0">
            <div className="font-bold text-amber-300">🚚 ডেলিভারি চার্জ:</div>
            <div>• ঢাকা সিটি: মাত্র ৬০ টাকা</div>
            <div>• ঢাকার বাইরে: ১২০ টাকা</div>
            <div className="text-emerald-200 font-bold pt-1">✓ গেস্ট বা লগইন চেকআউট উন্মুক্ত</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Catalog */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {STORE_MEDICINES.map((item) => (
              <div key={item.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold bg-slate-100 px-2.5 py-0.5 rounded-full">{item.dosageForm}</span>
                    {item.requiresRx && <span className="text-[10px] font-bold bg-rose-50 text-rose-700 px-2 py-0.5 rounded">Rx আবশ্যক</span>}
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-base">{item.name}</h3>
                  <p className="text-xs text-emerald-800 font-semibold mt-0.5">🧬 {item.generic}</p>
                  <p className="text-[11px] text-slate-500 mt-1">🏢 {item.company}</p>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-100 flex justify-between items-center">
                  <span className="text-lg font-black text-[#0f4c3a]">৳ {item.price.toFixed(2)}</span>
                  <button
                    onClick={() => addToCart({ id: item.id, name: item.name, generic: item.generic, company: item.company, price: item.price, requiresRx: item.requiresRx, dosageForm: item.dosageForm })}
                    className="bg-[#0f4c3a] hover:bg-emerald-900 text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs"
                  >
                    + ব্যাগে যোগ
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Cart & Safety Interaction Alerts */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm sticky top-20 space-y-4">
            <h2 className="text-base font-black text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-3">
              <span>🛒</span>
              <span>আপনার অর্ডার ব্যাগ ({cart.length} টি)</span>
            </h2>

            {/* Drug-Drug Interaction Warnings */}
            {interactions.length > 0 && (
              <div className="space-y-2">
                {interactions.map((warn, i) => (
                  <div key={i} className={`p-3 rounded-2xl text-xs space-y-1 border ${warn.level === "DANGER" ? "bg-rose-50 border-rose-300 text-rose-900" : "bg-amber-50 border-amber-300 text-amber-900"}`}>
                    <div className="font-black flex items-center space-x-1">
                      <span>{warn.titleBn}</span>
                    </div>
                    <p className="text-[11px] leading-relaxed">{warn.messageBn}</p>
                  </div>
                ))}
              </div>
            )}

            {cart.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">ব্যাগ বর্তমানে খালি রয়েছে</div>
            ) : (
              <div className="space-y-3">
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {cart.map((c) => (
                    <div key={c.id} className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex justify-between items-center text-xs">
                      <div>
                        <div className="font-bold text-slate-800">{c.name}</div>
                        <div className="text-[11px] text-slate-500">৳{c.price.toFixed(2)} × {c.qty}</div>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <button onClick={() => updateQty(c.id, -1)} className="w-5 h-5 rounded bg-white border font-bold">-</button>
                        <span className="font-bold text-xs">{c.qty}</span>
                        <button onClick={() => updateQty(c.id, 1)} className="w-5 h-5 rounded bg-white border font-bold">+</button>
                        <button onClick={() => removeFromCart(c.id)} className="text-slate-400 hover:text-rose-600 pl-1 font-bold">✕</button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-100 pt-3 space-y-1 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>ওষুধের মোট মূল্য:</span>
                    <span className="font-bold">৳ {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>ডেলিভারি চার্জ:</span>
                    <span className="font-bold">৳ {deliveryFee}</span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-slate-900 pt-1 border-t border-slate-100">
                    <span>সর্বমোট প্রদেয় বিল:</span>
                    <span className="text-lg text-[#0f4c3a]">৳ {grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Pure Cash On Delivery Highlight */}
                <div className="bg-emerald-50 border border-emerald-200/90 rounded-2xl p-3 text-[11px] text-emerald-950 flex items-center space-x-2">
                  <span className="text-lg">💵</span>
                  <div>
                    <strong>পেমেন্ট পদ্ধতি: ১০০% ক্যাশ অন ডেলিভারি</strong>
                    <div className="text-emerald-800 text-[10px]">লগইন ছাড়াই গেস্ট হিসেবে অর্ডার করা যাবে।</div>
                  </div>
                </div>

                <button
                  onClick={() => setCheckoutOpen(true)}
                  className="w-full bg-[#0f4c3a] hover:bg-emerald-900 text-white py-3.5 rounded-2xl text-xs font-bold transition shadow-md"
                >
                  ক্যাশ অন ডেলিভারিতে অর্ডার করুন →
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Checkout Modal (Guest or Logged In) */}
      {checkoutOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
                  {currentUser ? `স্বাগতম, ${currentUser.name}` : "গেস্ট বা লগইন ছাড়া চেকআউট"}
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-2">ডেলিভারির ঠিকানা ও তথ্য</h3>
              </div>
              <button onClick={() => setCheckoutOpen(false)} className="text-slate-400 font-bold text-lg">✕</button>
            </div>

            {errorMsg && (
              <div className="bg-rose-50 text-rose-700 p-2.5 rounded-xl text-xs font-bold">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleCheckoutSubmit} className="space-y-4 text-xs font-medium">
              <div>
                <label className="block text-slate-700 font-bold mb-1">গ্রাহকের পুরো নাম *</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="আপনার নাম লিখুন"
                  className="w-full p-3 rounded-xl border border-slate-200"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">মোবাইল নম্বর * (ডেলিভারি নিশ্চিতকরণের জন্য)</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className="w-full p-3 rounded-xl border border-slate-200 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">ডেলিভারি এলাকা / শহর *</label>
                <select value={city} onChange={(e) => setCity(e.target.value)} className="w-full p-3 rounded-xl border border-slate-200 bg-white font-semibold">
                  <option value="Dhaka">ঢাকা শহর (চার্জ: ৳৬০ - দ্রুততম ডেলিভারি)</option>
                  <option value="Chattogram">চট্টগ্রাম (চার্জ: ৳১২০)</option>
                  <option value="Sylhet">সিলেট (চার্জ: ৳১২০)</option>
                  <option value="Other">অন্যান্য জেলা (চার্জ: ৳১২০)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">পূর্ণাঙ্গ ঠিকানা (বাসা / রোড / এলাকা) *</label>
                <textarea
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="বাড়ি নং, রোড নং, ফ্ল্যাট, থানা ও এলাকার নাম..."
                  className="w-full p-3 rounded-xl border border-slate-200"
                  required
                />
              </div>

              {/* Locked 100% Cash On Delivery Card */}
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-300 p-3.5 rounded-2xl flex items-center space-x-3">
                <span className="text-2xl">💵</span>
                <div>
                  <div className="text-xs font-black text-emerald-950">পেমেন্ট মেথড: ক্যাশ অন ডেলিভারি (Cash on Delivery)</div>
                  <div className="text-[11px] text-emerald-800">কোনো অগ্রিম পেমেন্টের প্রয়োজন নেই। রাইডারের কাছ থেকে পণ্য বুঝে পেয়ে সর্বমোট <strong>৳ {grandTotal.toFixed(2)}</strong> পরিশোধ করবেন।</div>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
                <button type="button" onClick={() => setCheckoutOpen(false)} className="px-4 py-2.5 rounded-xl border border-slate-200 font-bold">বাতিল</button>
                <button type="submit" className="bg-[#0f4c3a] hover:bg-emerald-900 text-white px-6 py-2.5 rounded-xl font-bold transition shadow-md">
                  ✓ অর্ডার কনফার্ম করুন (৳ {grandTotal.toFixed(2)})
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmed Order Modal */}
      {confirmedOrder && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center text-3xl mx-auto">✓</div>
            <h3 className="text-xl font-black text-slate-900">ক্যাশ অন ডেলিভারি অর্ডার গৃহীত হয়েছে!</h3>
            <p className="text-xs text-slate-500">আপনার অর্ডার ট্র্যাকিং আইডি: <strong className="text-[#0f4c3a] font-mono text-sm">{confirmedOrder.orderNumber}</strong></p>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-700 text-left space-y-1">
              <div>• গ্রাহক: {confirmedOrder.customerName}</div>
              <div>• ডেলিভারির ঠিকানা: {confirmedOrder.address}, {confirmedOrder.city}</div>
              <div className="font-bold text-[#0f4c3a] pt-1">• প্রদেয় মোট মূল্য (ক্যাশ): ৳ {confirmedOrder.total.toFixed(2)}</div>
            </div>
            <div className="flex gap-2">
              <a
                href="/track-order"
                className="flex-1 bg-[#0f4c3a] text-white py-2.5 rounded-xl text-xs font-bold text-center hover:bg-emerald-900 transition"
              >
                লাইভ ট্র্যাকিং দেখুন ›
              </a>
              <button
                onClick={() => setConfirmedOrder(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold"
              >
                ঠিক আছে
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="bg-[#072e23] text-slate-300 py-8 text-center text-xs mt-12">
        <p className="font-bold text-white text-sm mb-1">জীবনযত্ন (JibonJotno)</p>
        <p className="text-slate-400">&copy; 2026 JibonJotno. All rights reserved.</p>
      </footer>
    </div>
  );
}