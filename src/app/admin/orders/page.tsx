"use client";

import React, { useState, useEffect } from "react";
import { useCart, PlacedOrder } from "@/context/CartContext";

export default function AdminOrdersPage() {
  const [mounted, setMounted] = useState(false);
  const { orders, updateOrderStatus } = useCart();
  const [selectedFilter, setSelectedFilter] = useState("ALL");
  const [selectedOrder, setSelectedOrder] = useState<PlacedOrder | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleStatusChange = (
    orderId: string,
    newStatus: "Pending" | "Approved" | "Delivered" | "Cancelled"
  ) => {
    if (typeof updateOrderStatus === "function") {
      updateOrderStatus(orderId, newStatus);
    }
    if (selectedOrder && (selectedOrder.id === orderId || selectedOrder.orderNumber === orderId)) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const handleDeleteOrder = (orderId: string) => {
    if (confirm("Apni ki shotti ei order-ti muche felte chan?")) {
      const stored = localStorage.getItem("jj_placed_orders");
      if (stored) {
        try {
          const list = JSON.parse(stored);
          const filtered = list.filter((o: any) => o.id !== orderId && o.orderNumber !== orderId);
          localStorage.setItem("jj_placed_orders", JSON.stringify(filtered));
          window.location.reload();
        } catch {}
      }
    }
  };

  const filteredOrders = (orders || []).filter((o) => {
    if (selectedFilter === "ALL") return true;
    return o.status === selectedFilter;
  });

  if (!mounted) {
    return <div className="p-8 text-center text-xs font-bold text-slate-400 font-sans">অর্ডার ডাটা লোড হচ্ছে...</div>;
  }

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xl font-black text-slate-900">রিয়েল-টাইম অর্ডার ড্যাশবোর্ড</span>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-0.5 rounded-full animate-pulse">
              ● LIVE
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            গ্রাহকদের লাইভ প্রেসক্রিপশন ও ক্যাশ অন ডেলিভারি অর্ডারের তালিকা (কোনো ফেক বা ডামি ডাটা ছাড়া)।
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1 rounded-2xl">
          {["ALL", "Pending", "Approved", "Delivered", "Cancelled"].map((f) => (
            <button
              key={f}
              onClick={() => setSelectedFilter(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                selectedFilter === f ? "bg-[#0f4c3a] text-white shadow-2xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {f === "ALL" ? `সব (${orders.length})` : f}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table or Empty State */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
          <div className="text-4xl">📭</div>
          <h3 className="text-base font-black text-slate-800">কোনো রিয়েল অর্ডার পাওয়া যায়নি</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            এখনও কোনো গ্রাহক নতুন অর্ডার দেননি। ওয়েবসাইট থেকে নতুন প্রেসক্রিপশন বা ফার্মেসি অর্ডার প্লেস হলে এখানে সাথে সাথে রিয়েল-টাইমে চলে আসবে।
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200/80 text-[11px] uppercase tracking-wider">
                  <th className="py-3.5 px-4">ট্র্যাকিং আইডি ও সময়</th>
                  <th className="py-3.5 px-4">গ্রাহক ও মোবাইল</th>
                  <th className="py-3.5 px-4">ঠিকানা</th>
                  <th className="py-3.5 px-4">ওষুধের তালিকা</th>
                  <th className="py-3.5 px-4">মোট বিল (COD)</th>
                  <th className="py-3.5 px-4 text-center">স্ট্যাটাস</th>
                  <th className="py-3.5 px-4 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-black text-[#0f4c3a] block text-xs">
                        {ord.orderNumber}
                      </span>
                      <span className="text-[10px] text-slate-400 block">{ord.createdAt}</span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <div>{ord.customerName}</div>
                      <a href={`tel:${ord.phone}`} className="text-[11px] text-emerald-800 font-mono block hover:underline">
                        📞 {ord.phone}
                      </a>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 max-w-[180px] truncate">
                      {ord.address}, {ord.city}
                    </td>
                    <td className="py-3.5 px-4">
                      {ord.rxFileName ? (
                        <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded text-[10px] font-black">
                          📷 Rx: {ord.rxFileName}
                        </span>
                      ) : (
                        <span className="text-slate-700 font-medium">
                          {ord.items?.length || 0} টি ওষুধ
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-black text-slate-900 text-sm">
                      ৳ {ord.total ? ord.total.toFixed(2) : "0.00"}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <select
                        value={ord.status}
                        onChange={(e: any) => handleStatusChange(ord.id, e.target.value)}
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border outline-none cursor-pointer ${
                          ord.status === "Delivered"
                            ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                            : ord.status === "Approved"
                            ? "bg-blue-50 text-blue-800 border-blue-300"
                            : ord.status === "Cancelled"
                            ? "bg-rose-50 text-rose-800 border-rose-300"
                            : "bg-amber-50 text-amber-800 border-amber-300"
                        }`}
                      >
                        <option value="Pending">Pending (অপেক্ষমাণ)</option>
                        <option value="Approved">Approved (ভেরিফাইড)</option>
                        <option value="Delivered">Delivered (ডেলিভার্ড)</option>
                        <option value="Cancelled">Cancelled (বাতিল)</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => setSelectedOrder(ord)}
                          className="bg-slate-900 hover:bg-black text-white px-2.5 py-1 rounded-lg text-xs font-bold transition shadow-2xs"
                        >
                          বিস্তারিত
                        </button>
                        <button
                          onClick={() => handleDeleteOrder(ord.id)}
                          className="bg-rose-600 hover:bg-rose-700 text-white px-2.5 py-1 rounded-lg text-xs font-bold transition shadow-2xs"
                        >
                          ✕
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                  অর্ডার পূর্ণ বিবরণী
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-1 font-mono">
                  {selectedOrder.orderNumber}
                </h3>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-slate-400 font-bold text-lg">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1">
                <div><strong>গ্রাহকের নাম:</strong> {selectedOrder.customerName}</div>
                <div><strong>মোবাইল:</strong> <a href={`tel:${selectedOrder.phone}`} className="text-emerald-800 underline font-bold">{selectedOrder.phone}</a></div>
                <div><strong>ঠিকানা:</strong> {selectedOrder.address}, {selectedOrder.city}</div>
                <div><strong>পেমেন্ট:</strong> ক্যাশ অন ডেলিভারি (COD)</div>
              </div>

              {selectedOrder.items && selectedOrder.items.length > 0 && (
                <div className="space-y-2">
                  <div className="font-bold text-slate-800 border-b pb-1">অর্ডারকৃত পণ্য তালিকা:</div>
                  {selectedOrder.items.map((it: any, i: number) => (
                    <div key={i} className="flex justify-between items-center bg-white p-2 border border-slate-100 rounded-xl">
                      <span>• {it.name} × {it.qty}</span>
                      <span className="font-mono font-bold">৳ {(it.price * it.qty).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center font-black text-sm pt-1 border-t text-[#0f4c3a]">
                    <span>সর্বমোট বিল:</span>
                    <span>৳ {selectedOrder.total?.toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
              <button onClick={() => setSelectedOrder(null)} className="px-4 py-2 rounded-xl border font-bold text-xs">
                বন্ধ করুন
              </button>
              <button
                onClick={() => {
                  window.print();
                }}
                className="bg-[#0f4c3a] text-white px-5 py-2 rounded-xl font-bold text-xs shadow-xs"
              >
                🖨️ ইনভয়েস প্রিন্ট
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}