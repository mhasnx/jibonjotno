"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CartItem {
  id: string;
  name: string;
  generic: string;
  company: string;
  price: number;
  qty: number;
  requiresRx: boolean;
  dosageForm: string;
}

export interface PlacedOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  address: string;
  city: string;
  paymentMethod: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: "Pending" | "Approved" | "Delivered" | "Cancelled";
  createdAt: string;
  rxFileName?: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "qty">, qty?: number) => void;
  removeFromCart: (id: string) => void;
  updateQty: (id: string, delta: number) => void;
  clearCart: () => void;
  subtotal: number;
  totalItems: number;
  hasRxItem: boolean;
  orders: PlacedOrder[];
  placeOrder: (details: {
    customerName: string;
    phone: string;
    address: string;
    city: string;
    paymentMethod: string;
    rxFileName?: string;
  }) => PlacedOrder;
  updateOrderStatus: (orderId: string, status: "Pending" | "Approved" | "Delivered" | "Cancelled") => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<PlacedOrder[]>([]);

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("jj_cart");
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedOrders = localStorage.getItem("jj_placed_orders");
      if (savedOrders) setOrders(JSON.parse(savedOrders));
    } catch {}
  }, []);

  const addToCart = (item: Omit<CartItem, "qty">, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      let updated;
      if (existing) {
        updated = prev.map((i) =>
          i.id === item.id ? { ...i, qty: i.qty + qty } : i
        );
      } else {
        updated = [...prev, { ...item, qty }];
      }
      localStorage.setItem("jj_cart", JSON.stringify(updated));
      return updated;
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => {
      const updated = prev.filter((i) => i.id !== id);
      localStorage.setItem("jj_cart", JSON.stringify(updated));
      return updated;
    });
  };

  const updateQty = (id: string, delta: number) => {
    setCart((prev) => {
      const updated = prev
        .map((i) => (i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i))
        .filter((i) => i.qty > 0);
      localStorage.setItem("jj_cart", JSON.stringify(updated));
      return updated;
    });
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("jj_cart");
  };

  const subtotal = cart.reduce((acc, it) => acc + it.price * it.qty, 0);
  const totalItems = cart.reduce((acc, it) => acc + it.qty, 0);
  const hasRxItem = cart.some((it) => it.requiresRx);

  const placeOrder = (details: {
    customerName: string;
    phone: string;
    address: string;
    city: string;
    paymentMethod: string;
    rxFileName?: string;
  }): PlacedOrder => {
    const deliveryFee = details.city === "Dhaka" ? 60 : 120;
    const total = subtotal + deliveryFee;
    const newOrder: PlacedOrder = {
      id: `ord-${Date.now()}`,
      orderNumber: `JJ-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: details.customerName,
      phone: details.phone,
      address: details.address,
      city: details.city,
      paymentMethod: details.paymentMethod || "Cash on Delivery",
      items: [...cart],
      subtotal,
      deliveryFee,
      total,
      status: "Pending",
      createdAt: new Date().toLocaleString("bn-BD", { hour12: true }),
      rxFileName: details.rxFileName,
    };

    setOrders((prev) => {
      const updated = [newOrder, ...prev];
      localStorage.setItem("jj_placed_orders", JSON.stringify(updated));
      return updated;
    });

    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (
    orderId: string,
    status: "Pending" | "Approved" | "Delivered" | "Cancelled"
  ) => {
    setOrders((prev) => {
      const updated = prev.map((o) =>
        o.id === orderId || o.orderNumber === orderId ? { ...o, status } : o
      );
      localStorage.setItem("jj_placed_orders", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        subtotal,
        totalItems,
        hasRxItem,
        orders,
        placeOrder,
        updateOrderStatus,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}