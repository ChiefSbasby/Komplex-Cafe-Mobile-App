// menuData.js — Komplex Cafe Menu Database
//
// ── SERVE OPTIONS ────────────────────────────────────────────────
// serveOptions: null            → no hot/iced choice (single price on item)
//               "hot_iced"      → item has separate hot & iced prices
//               "hot_only"      → only hot available
//               "iced_only"     → only iced available
//
// For items with serveOptions "hot_iced" | "hot_only" | "iced_only",
// individual items carry: { hotPrice, icedPrice }
// (set the unavailable one to null)
//
// ── CUSTOMISATION PER ITEM ───────────────────────────────────────
// hasAddOns: true  → ADD_ONS checklist is shown in the popup
// dips: true       → DIP_TIERS radio groups are shown instead of add-ons
//
// ── BEST SELLERS ─────────────────────────────────────────────────
// bestSeller: true → shows a ♥ badge on the card / popup
// To update best-sellers, toggle this flag per item — no other change needed.

// ─── ADD-ONS (checklist, shown only when hasAddOns: true) ────────
export const ADD_ONS = [
  { id: "espresso_shot",   label: "Espresso Shot",   price: 45 },
  { id: "full_cream_milk", label: "Full Cream Milk", price: 20 },
  { id: "syrup",           label: "Syrup",           price: 45 },
  { id: "sauce",           label: "Sauce",           price: 20 },
  { id: "sea_salt_cream",  label: "Sea Salt Cream",  price: 40 },
];

// ─── DIP TIERS (radio groups, shown only when dips: true) ────────
// Each tier: one choice, required if no "none" option is wanted.
// Add { id: "none", label: "None", price: 0 } to a tier to make it optional.
export const DIP_TIERS = [
  {
    id: "dip_base",
    label: "Dip",
    required: true,          // must pick one
    options: [
      { id: "choco",    label: "Choco",    price: 0 },
      { id: "caramel",  label: "Caramel",  price: 0 },
    ],
  },
  {
    id: "dip_topping",
    label: "Topping (optional)",
    required: false,          // optional tier
    options: [
      { id: "none",           label: "None",           price: 0  },
      { id: "whip_cream",     label: "Whip Cream",     price: 15 },
      { id: "sea_salt_cream", label: "Sea Salt Cream", price: 15 },
    ],
  },
];

// ─── MENU ────────────────────────────────────────────────────────
export const MENU = [

  // ── COFFEE ──────────────────────────────────────────────────────
  // All coffee items have add-ons.
  // serveOptions drives the hot/iced UI; hotPrice/icedPrice are the
  // actual prices (null = that temp is not available).
  {
    category: "Coffee",
    section: "Drinks",
    serveOptions: "hot_iced",   // group default; overridden per item below
    items: [
      { id: "c01", name: "Americano",          hotPrice: 140, icedPrice: 150, hasAddOns: true, bestSeller: false, image: null },
      { id: "c02", name: "Latte",              hotPrice: 150, icedPrice: 160, hasAddOns: true, bestSeller: false, image: null },
      { id: "c03", name: "Spanish Latte",      hotPrice: 160, icedPrice: 185, hasAddOns: true, bestSeller: true,  image: null },
      { id: "c04", name: "Oreo Latte",         hotPrice: null,icedPrice: 185, hasAddOns: true, bestSeller: true,  image: null, serveOptions: "iced_only" },
      { id: "c05", name: "Vietnamese",         hotPrice: null,icedPrice: 185, hasAddOns: true, bestSeller: false, image: null, serveOptions: "iced_only" },
      { id: "c06", name: "Caramel Macchiato",  hotPrice: 160, icedPrice: 185, hasAddOns: true, bestSeller: false, image: null },
      { id: "c07", name: "Muscovado Cinnamon", hotPrice: 160, icedPrice: 185, hasAddOns: true, bestSeller: true,  image: null },
      { id: "c08", name: "Cacao Latte",        hotPrice: 160, icedPrice: 185, hasAddOns: true, bestSeller: false, image: null },
      { id: "c09", name: "White Mocha",        hotPrice: 160, icedPrice: 185, hasAddOns: true, bestSeller: false, image: null },
      { id: "c10", name: "Seasalt Latte",      hotPrice: null,icedPrice: 200, hasAddOns: true, bestSeller: true,  image: null, serveOptions: "iced_only" },
      { id: "c11", name: "Dirty Horchata",     hotPrice: null,icedPrice: 200, hasAddOns: true, bestSeller: false, image: null, serveOptions: "iced_only" },
      { id: "c12", name: "Biscoff Latte",      hotPrice: null,icedPrice: 210, hasAddOns: true, bestSeller: false, image: null, serveOptions: "iced_only" },
    ],
  },

  // ── NON-COFFEE ──────────────────────────────────────────────────
  {
    category: "Non-Coffee",
    section: "Drinks",
    serveOptions: "hot_iced",
    items: [
      { id: "nc01", name: "Matcha",           hotPrice: 160, icedPrice: 180, hasAddOns: true, bestSeller: false, image: null },
      { id: "nc02", name: "Strawberry Milk",  hotPrice: null,icedPrice: 180, hasAddOns: true, bestSeller: true,  image: null, serveOptions: "iced_only" },
      { id: "nc03", name: "Horchata",         hotPrice: 170, icedPrice: 190, hasAddOns: true, bestSeller: true,  image: null },
      { id: "nc04", name: "Strawberry Matcha",hotPrice: null,icedPrice: 200, hasAddOns: true, bestSeller: false, image: null, serveOptions: "iced_only" },
      { id: "nc05", name: "Batirol (with nuts)",hotPrice: 200,icedPrice: 220,hasAddOns: true, bestSeller: false, image: null },
      { id: "nc06", name: "Choco (Ghirardelli)",hotPrice: 200,icedPrice: 220,hasAddOns: true, bestSeller: false, image: null },
    ],
  },

  // ── FRAPPES ─────────────────────────────────────────────────────
  // Frappes are always iced — serveOptions: null, single price field used as `price`.
  // Sub-tagged with coffeeBase for display if needed.
  {
    category: "Frappes",
    section: "Drinks",
    serveOptions: null,
    items: [
      { id: "f01", name: "Strawberry Kream", price: 185, coffeeBase: false, hasAddOns: true, bestSeller: true,  image: null },
      { id: "f02", name: "Oreo",             price: 195, coffeeBase: false, hasAddOns: true, bestSeller: false, image: null },
      { id: "f03", name: "Mocha",            price: 200, coffeeBase: true,  hasAddOns: true, bestSeller: true,  image: null },
      { id: "f04", name: "Karamel",          price: 200, coffeeBase: true,  hasAddOns: true, bestSeller: false, image: null },
      { id: "f05", name: "Biscoff Frappe",   price: 210, coffeeBase: false, hasAddOns: true, bestSeller: false, image: null },
    ],
  },

  // ── FRUIT TEAS (Twinings) ────────────────────────────────────────
  // No add-ons for fruit teas.
  {
    category: "Fruit Teas",
    section: "Drinks",
    serveOptions: "hot_iced",
    brand: "Twinings",
    items: [
      { id: "t01", name: "Peach and Passionfruit",    hotPrice: 100, icedPrice: 160, hasAddOns: false, bestSeller: true,  image: null },
      { id: "t02", name: "Strawberry Mango Peach",    hotPrice: 100, icedPrice: 160, hasAddOns: false, bestSeller: true,  image: null },
      { id: "t03", name: "Passion Fruit Orange",      hotPrice: 100, icedPrice: 160, hasAddOns: false, bestSeller: false, image: null },
      { id: "t04", name: "Lemon Ginger",              hotPrice: 100, icedPrice: 160, hasAddOns: false, bestSeller: false, image: null },
    ],
  },

  // ── PASTA ───────────────────────────────────────────────────────
  {
    category: "Pasta",
    section: "Meals",
    serveOptions: null,
    items: [
      { id: "p01", name: "Bacon Carbonara",    price: 220, hasAddOns: false, bestSeller: true,  image: null },
      { id: "p02", name: "Tuna Creamy Pesto",  price: 220, hasAddOns: false, bestSeller: true,  image: null },
      { id: "p03", name: "Italian Hungarian",  price: 220, hasAddOns: false, bestSeller: false, image: null },
      { id: "p04", name: "Truffle Pasta",      price: 250, hasAddOns: false, bestSeller: false, image: null },
    ],
  },

  // ── RICE MEALS ──────────────────────────────────────────────────
  {
    category: "Rice Meal",
    section: "Meals",
    serveOptions: null,
    items: [
      { id: "r01", name: "Hungarian Sausage",    price: 180, hasAddOns: false, bestSeller: false, image: null },
      { id: "r02", name: "Spam",                 price: 180, hasAddOns: false, bestSeller: true,  image: null },
      { id: "r03", name: "Bacon",                price: 180, hasAddOns: false, bestSeller: false, image: null },
      { id: "r04", name: "Corned Beef",          price: 180, hasAddOns: false, bestSeller: false, image: null },
      { id: "r05", name: "Tapa",                 price: 220, hasAddOns: false, bestSeller: true,  image: null },
      { id: "r06", name: "Fried Chicken Chops",  price: 220, hasAddOns: false, bestSeller: true,  image: null },
      { id: "r07", name: "Chicken Parmigiana",   price: 250, hasAddOns: false, bestSeller: false, image: null },
    ],
  },

  // ── SNACKS ──────────────────────────────────────────────────────
  // Churros uses DIP_TIERS instead of add-ons.
  // Other snacks have neither add-ons nor dips.
  {
    category: "Snacks",
    section: "Meals",
    serveOptions: null,
    items: [
      { id: "s01", name: "Churros",        price: 150, hasAddOns: false, dips: true,  bestSeller: false, image: null },
      { id: "s02", name: "Crisscut Fries", price: 150, hasAddOns: false, dips: false, bestSeller: false, image: null },
      { id: "s03", name: "Cajun Fries",    price: 175, hasAddOns: false, dips: false, bestSeller: false, image: null },
      { id: "s04", name: "Nuggets",        price: 175, hasAddOns: false, dips: false, bestSeller: false, image: null },
      { id: "s05", name: "Nachos",         price: 200, hasAddOns: false, dips: false, bestSeller: false, image: null },
    ],
  },

  // ── SANDWICHES ──────────────────────────────────────────────────
  {
    category: "Sandwiches",
    section: "Meals",
    serveOptions: null,
    items: [
      { id: "sw01", name: "Chicken", price: 159, hasAddOns: false, bestSeller: false, image: null },
      { id: "sw02", name: "Spam",    price: 159, hasAddOns: false, bestSeller: false, image: null },
      { id: "sw03", name: "Bacon",   price: 159, hasAddOns: false, bestSeller: false, image: null },
      { id: "sw04", name: "Egg",     price: 159, hasAddOns: false, bestSeller: false, image: null },
    ],
  },
];

// ─── Helpers ─────────────────────────────────────────────────────
export const SECTIONS   = [...new Set(MENU.map((g) => g.section))];
export const CATEGORIES = MENU.map((g) => g.category);
