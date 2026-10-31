/**
 * JibonJotno (জীবনযত্ন) — Admin Audit Logs CMS
 * Section 7.1: Track administrative actions and security events.
 */

import React from "react";

export default function AdminAuditLogsPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">অডিট লগ ও সিকিউরিটি ট্র্যাকিং (Audit Logs)</h1>
        <span className="bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-lg text-sm font-semibold">
          সিস্টেম সিকিউরিটি মনিটরিং
        </span>
      </div>

      {/* Audit Logs Table Card */}
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <span className="text-sm font-semibold text-gray-700">সিস্টেম ইভেন্ট তালিকা (Total: 0)</span>
          <input 
            type="text" 
            placeholder="অ্যাডমিন আইডি বা অ্যাকশন দিয়ে খুঁজুন..." 
            className="px-3 py-1.5 border border-gray-300 rounded text-sm w-72 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-600 text-xs uppercase tracking-wider border-b border-gray-200">
                <th className="py-3 px-4">সময় (Timestamp)</th>
                <th className="py-3 px-4">অ্যাডমিন (Admin User)</th>
                <th className="py-3 px-4">অ্যাকশন (Action)</th>
                <th className="py-3 px-4">টার্গেট রিসোর্স (Target Entity)</th>
                <th className="py-3 px-4">আইপি ঠিকানা (IP Address)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm text-gray-700">
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-400">
                  কোনো অডিট লগ রেকর্ড পাওয়া যায়নি।
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}