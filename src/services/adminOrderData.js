// src/services/adminOrderData.js

export const ORDER_TABS = [
  { key: "Pending", label: "Pending Orders" },
  { key: "Finished", label: "Finished Orders" },
];

export const STATUS_OPTIONS = [
  "PREPARING",
  "PROCESSING PAYMENT",
  "COMPLETED",
  "CANCELLED",
];

// --- Formatting helpers ---
export function formatMoney(n) {
  return new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" })
    .format(n)
    .replace("PHP", "₱");
}

export function formatDate(d) {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yy = String(d.getFullYear()).slice(-2);
  return `${dd}/${mm}/${yy}`;
}

export function formatTime(d) {
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");
  return `${hh}:${min}:${ss}`;
}

export function isFinishedStatus(status) {
  return status === "COMPLETED" || status === "CANCELLED";
}

export function calcOrderTotal(items) {
  return items.reduce((sum, it) => sum + it.qty * it.price, 0);
}

// --- Placeholder dataset (replace with Firestore later) ---
const SEED_ORDERS = [
  {
    id: "MWK-2137",
    tableId: "001",
    status: "PROCESSING PAYMENT",
    createdAt: new Date("2025-11-16T09:25:57"),
    items: [{ name: "Amerikano 12oz", qty: 1, price: 115 }],
    type: "Dine-in",
    receiveAt: "Counter",
    instructions: "",
  },
  {
    id: "APQ-3429",
    tableId: "012",
    status: "PREPARING",
    createdAt: new Date("2025-11-16T09:17:03"),
    items: [{ name: "Amerikano 12oz", qty: 1, price: 115 }],
    type: "Dine-in",
    receiveAt: "Counter",
    instructions: "pls do not put too much ice",
  },
  {
    id: "NBK-2025",
    tableId: "001",
    status: "COMPLETED",
    createdAt: new Date("2025-11-16T09:25:57"),
    items: [{ name: "Amerikano 12oz", qty: 1, price: 115 }],
    type: "Dine-in",
    receiveAt: "Counter",
    instructions: "N/A",
  },
];

// Mimic “fetch” APIs (later: swap with Firestore)
export function getAllOrders() {
  return SEED_ORDERS;
}

export function getOrdersByTab(orders, activeTab) {
  if (activeTab === "Finished") {
    // Finished Orders = COMPLETED + CANCELLED
    return orders.filter((o) => isFinishedStatus(o.status));
  }

  // Pending Orders = everything NOT finished
  if (activeTab === "Pending") {
    return orders.filter((o) => !isFinishedStatus(o.status));
  }

  // fallback (optional)
  return orders;
}