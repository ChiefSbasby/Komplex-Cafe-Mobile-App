// src/data/adminDashboardData.js

// Keep format/constants here so later you can replace these with Firestore queries.

export const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
export const MONTHS = [
  "Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"
];

// ----- Categories / items mapping -----
export const CATEGORY_ITEMS = {
  All: ["Strawberry Kream", "Oreo", "Karamel", "Biscoff Frappe"],
  Coffee: ["Karamel"],
  "Non-Coffee": ["Strawberry Kream", "Oreo", "Biscoff Frappe"],
  Frappe: ["Biscoff Frappe"],
  "Fruit Tea": [],
  "Rice Meal": [],
  Pasta: [],
  Sandwich: [],
};

// Line keys + labels (your chart series “schema”)
export const LINE_META = {
  strawberry: { label: "Strawberry Kream (non-coffee)", color: "#ff0000" }, // red
  oreo: { label: "Oreo (non-coffee)", color: "#0000ff" },                  // blue
  karamel: { label: "Karamel (coffee based)", color: "#f4b400" },           // yellow/orange
  biscoff: { label: "Biscoff Frappe (non-coffee)", color: "#00a000" },      // green
};

// Map category -> which line keys should be visible
export function getVisibleLines(category) {
  const allowed = new Set(CATEGORY_ITEMS[category] || []);
  if (category === "All") return ["strawberry", "oreo", "karamel", "biscoff"];

  const keys = [];
  if (allowed.has("Strawberry Kream")) keys.push("strawberry");
  if (allowed.has("Oreo")) keys.push("oreo");
  if (allowed.has("Karamel")) keys.push("karamel");
  if (allowed.has("Biscoff Frappe")) keys.push("biscoff");
  return keys;
}

// ----- Placeholder data generators -----
// Later: replace these functions with Firestore queries.

export function getOnlineSalesData(range) {
  if (range === "Hour") {
    // last 12 hours
    const now = new Date();
    const arr = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now);
      d.setHours(now.getHours() - i);
      arr.push({
        label: `${String(d.getHours()).padStart(2, "0")}:00`,
        orders: Math.floor(5 + Math.random() * 18),
      });
    }
    return arr;
  }

  if (range === "Week") {
    return DAYS.map((d) => ({
      label: d,
      orders: Math.floor(10 + Math.random() * 14),
    }));
  }

  if (range === "Month") {
    return ["W1", "W2", "W3", "W4"].map((w) => ({
      label: w,
      orders: Math.floor(40 + Math.random() * 55),
    }));
  }

  // Year
  return MONTHS.map((m) => ({
    label: m,
    orders: Math.floor(120 + Math.random() * 180),
  }));
}

export function getItemPerformanceData(range) {
  const x =
    range === "Week"
      ? DAYS
      : range === "Month"
      ? ["W1", "W2", "W3", "W4"]
      : range === "Year"
      ? MONTHS
      : Array.from({ length: 12 }, (_, i) => `${String(i + 1).padStart(2, "0")}:00`);

  return x.map((label) => ({
    label,
    strawberry: Math.floor(Math.random() * 25),
    oreo: Math.floor(8 + Math.random() * 10),
    karamel: Math.floor(12 + Math.random() * 14),
    biscoff: Math.floor(6 + Math.random() * 15),
  }));
}

// Summary placeholders (later from Firestore)
export function getDashboardSummary() {
  return {
    todaysSales: 6450,
    totalOrders: 87,
  };
}