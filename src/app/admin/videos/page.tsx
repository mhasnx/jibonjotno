/**
 * JibonJotno (জীবনযত্ন) — Admin Educational Videos Management CMS
 */

import React from "react";

export default function AdminVideosPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">শিক্ষামূলক ভিডিও পাইপলাইন (Video CMS)</h1>
        <button className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-lg text-sm font-medium shadow transition">
          + নতুন ভিডিও যুক্ত করুন
        </button>
      </div>

      {/* Videos Table Card */}
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <span className="text-sm font-semibold text-gray-700">সকল ভিডিওর তালিকা (Total: 0)</span>
          <input 
            type="text" 
            placeholder="ভিডিওর শিরোনাম বা ক্যাটাগরি দিয়ে খুঁজুন..." 
            className="px-3 py-1.5 border border-gray-300 rounded text-sm w-72 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-600 text-xs uppercase tracking-wider border-b border-gray-200">
                <th className="py-3 px-4">শিরোনাম (Title)</th>
                <th className="py-3 px-4">ক্যাটাগরি (Category)</th>
                <th className="py-3 px-4">স্থায়িত্ব (Duration)</th>
                <th className="py-3 px-4">পাবলিশড (Published)</th>
                <th className="py-3 px-4 text-right">কার্যক্রম (Actions)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm text-gray-700">
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-400">
                  কোনো শিক্ষামূলক ভিডিও পাওয়া যায়নি। নতুন ভিডিও যুক্ত করলে এখানে প্রদর্শিত হবে।
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}