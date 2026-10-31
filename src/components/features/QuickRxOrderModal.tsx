"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

export default function QuickRxOrderModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [fileName, setFileName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setName("");
      setPhone("");
      setAddress("");
      setFileName("");
      onClose();
    }, 2200);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-slate-900/65 backdrop-blur-xs z-[70] flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-slate-200 relative space-y-5"
          >
            <button
              onClick={onClose}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-500 font-bold flex items-center justify-center transition cursor-pointer"
            >
              ✕
            </button>

            <div>
              <span className="text-[10px] font-black uppercase bg-amber-100 text-amber-900 px-3 py-1 rounded-full">
                📷 {t("\u09E7-\u0995\u09CD\u09B2\u09BF\u0995 \u09AA\u09CD\u09B0\u09C7\u09B8\u0995\u09CD\u09B0\u09BF\u09AA\u09B6\u09A8 \u0985\u09B0\u09CD\u09A1\u09BE\u09B0", "1-Click Prescription Upload")}
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-2">
                {t("\u09AA\u09CD\u09B0\u09C7\u09B8\u0995\u09CD\u09B0\u09BF\u09AA\u09B6\u09A8\u09C7\u09B0 \u099B\u09AC\u09BF \u0986\u09AA\u09B2\u09CB\u09A1 \u0995\u09B0\u09C1\u09A8", "Upload Prescription for Home Delivery")}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {t(
                  "\u09B0\u09C7\u099C\u09BF\u09B8\u09CD\u099F\u09BE\u09B0\u09CD\u09A1 \u09AB\u09BE\u09B0\u09CD\u09AE\u09BE\u09B8\u09BF\u09B8\u09CD\u099F \u09AA\u09CD\u09B0\u09C7\u09B8\u0995\u09CD\u09B0\u09BF\u09AA\u09B6\u09A8 \u09AF\u09BE\u099A\u09BE\u0987 \u0995\u09B0\u09C7 \u09AB\u09CB\u09A8 \u0995\u09B0\u09C7 \u0985\u09B0\u09CD\u09A1\u09BE\u09B0 \u09A8\u09BF\u09B6\u09CD\u099A\u09BF\u09A4 \u0995\u09B0\u09AC\u09C7\u09A8 (\u09E7\u09E6\u09E6% \u0995\u09CD\u09AF\u09BE\u09B6 \u0985\u09A8 \u09A1\u09C7\u09B2\u09BF\u09AD\u09BE\u09B0\u09BF)\u0964",
                  "Our registered pharmacist will verify your Rx and call you to confirm (100% Cash on Delivery)."
                )}
              </p>
            </div>

            {submitted ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
                <div className="text-3xl">✓</div>
                <div className="text-sm font-black text-emerald-950">
                  {t("\u09AA\u09CD\u09B0\u09C7\u09B8\u0995\u09CD\u09B0\u09BF\u09AA\u09B6\u09A8 \u09B8\u09AB\u09B2\u09AD\u09BE\u09AC\u09C7 \u0997\u09C3\u09B9\u09C0\u09A4 \u09B9\u09DF\u09C7\u099B\u09C7!", "Prescription Received Successfully!")}
                </div>
                <p className="text-xs text-emerald-800">
                  {t("\u09E7\u09EB \u09AE\u09BF\u09A8\u09BF\u099F\u09C7\u09B0 \u09AE\u09A7\u09CD\u09AF\u09C7 \u09AB\u09BE\u09B0\u09CD\u09AE\u09BE\u09B8\u09BF\u09B8\u09CD\u099F \u0986\u09AA\u09A8\u09BE\u0995\u09C7 \u0995\u09B2 \u0995\u09B0\u09AC\u09C7\u09A8\u0964", "Our pharmacist will call you within 15 minutes.")}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5 text-xs font-semibold">
                <label className="block border-2 border-dashed border-emerald-300 hover:border-[#0f4c3a] bg-emerald-50/50 rounded-2xl p-4 text-center cursor-pointer transition">
                  <span className="text-2xl block mb-1">📄</span>
                  <span className="font-black text-[#0f4c3a] block">
                    {fileName || t("\u09AA\u09CD\u09B0\u09C7\u09B8\u0995\u09CD\u09B0\u09BF\u09AA\u09B6\u09A8\u09C7\u09B0 \u099B\u09AC\u09BF \u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09A8 \u0995\u09B0\u09C1\u09A8 (JPG/PNG)", "Tap to Select Prescription Image (JPG/PNG)")}
                  </span>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" required />
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 mb-1">{t("\u09B0\u09CB\u0997\u09C0 / \u0997\u09CD\u09B0\u09BE\u09B9\u0995\u09C7\u09B0 \u09A8\u09BE\u09AE *", "Patient / Customer Name *")}</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t("\u09A8\u09BE\u09AE \u09B2\u09BF\u0996\u09C1\u09A8", "Full Name")}
                      className="w-full p-3 rounded-xl border border-slate-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 mb-1">{t("\u09AE\u09CB\u09AC\u09BE\u0987\u09B2 \u09A8\u09AE\u09CD\u09AC\u09B0 *", "Mobile Number *")}</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="01XXXXXXXXX"
                      className="w-full p-3 rounded-xl border border-slate-200 font-mono"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 mb-1">{t("\u09A1\u09C7\u09B2\u09BF\u09AD\u09BE\u09B0\u09BF \u09A0\u09BF\u0995\u09BE\u09A8\u09BE *", "Delivery Address *")}</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder={t("\u09AC\u09BE\u09B8\u09BE, \u09B0\u09CB\u09A1, \u098F\u09B2\u09BE\u0995\u09BE \u0993 \u099C\u09C7\u09B2\u09BE...", "House, Road, Area & City...")}
                    className="w-full p-3 rounded-xl border border-slate-200"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#0f4c3a] hover:bg-emerald-900 text-white py-3.5 rounded-2xl font-black text-xs transition shadow-md cursor-pointer"
                >
                  ✓ {t("\u0995\u09CD\u09AF\u09BE\u09B6 \u0985\u09A8 \u09A1\u09C7\u09B2\u09BF\u09AD\u09BE\u09B0\u09BF\u09A4\u09C7 \u09AA\u09CD\u09B0\u09C7\u09B8\u0995\u09CD\u09B0\u09BF\u09AA\u09B6\u09A8 \u09AA\u09BE\u09A0\u09BE\u09A8", "Submit Prescription (Cash on Delivery)")}
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}