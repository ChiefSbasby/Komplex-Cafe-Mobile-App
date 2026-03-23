import { useState, useEffect, useRef } from "react";
import { MENU, ADD_ONS, DIP_TIERS, CATEGORIES } from "../assets/data/menuData.js";
import "../css/MenuPage.css";
import NavBar from "../components/NavBar";
import { useNavigate } from "react-router-dom";

/* ─── Placeholder image ────────────────────────────────────────── */
const PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect width='80' height='80' fill='%23d1d5db'/%3E%3C/svg%3E";

/* ─── Currency formatter ───────────────────────────────────────── */
const peso = (n) =>
  "₱" + Number(n).toLocaleString("en-PH", { minimumFractionDigits: 2 });

/* ─── Resolve serve options for an individual item ─────────────── */
// Item-level serveOptions overrides group-level when present.
const getServeOptions = (item, group) =>
  item.serveOptions !== undefined ? item.serveOptions : group.serveOptions;

/* ─── Get the starting serve mode for an item ──────────────────── */
const defaultServe = (item, group) => {
  const mode = getServeOptions(item, group);
  if (mode === "iced_only") return "iced";
  return "hot"; // hot_iced, hot_only, null → default hot
};

/* ─── Resolve display price for a cart-entry item ──────────────── */
const resolveBasePrice = (item, serve) => {
  if (item.hotPrice !== undefined) {
    // has hot/iced prices
    return serve === "iced" ? item.icedPrice : item.hotPrice;
  }
  return item.price;
};

/* ═══════════════════════════════════════════════════════════════════
   ITEM POPUP
═══════════════════════════════════════════════════════════════════ */
function ItemPopup({ item, group, onClose, onAddToCart }) {
  const serveMode = getServeOptions(item, group);
  const [serve, setServe]   = useState(defaultServe(item, group));
  const [qty, setQty]       = useState(1);
  const [addons, setAddons] = useState({});
  // dipSelections: { [tierId]: optionId }
  const [dipSelections, setDipSelections] = useState(() => {
    const init = {};
    DIP_TIERS.forEach((tier) => {
      if (!tier.required) {
        // default optional tiers to "none"
        const noneOpt = tier.options.find((o) => o.id === "none");
        if (noneOpt) init[tier.id] = "none";
      }
    });
    return init;
  });
  const overlayRef = useRef();

  /* lock body scroll */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "");
  }, []);

  /* click outside */
  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  const toggleAddon = (id) =>
    setAddons((prev) => ({ ...prev, [id]: !prev[id] }));

  const setDip = (tierId, optionId) =>
    setDipSelections((prev) => ({ ...prev, [tierId]: optionId }));

  /* ── Price calc ── */
  const basePrice = resolveBasePrice(item, serve);

  const addonTotal = item.hasAddOns
    ? ADD_ONS.filter((a) => addons[a.id]).reduce((s, a) => s + a.price, 0)
    : 0;

  const dipTotal = item.dips
    ? DIP_TIERS.reduce((sum, tier) => {
        const chosen = tier.options.find((o) => o.id === dipSelections[tier.id]);
        return sum + (chosen ? chosen.price : 0);
      }, 0)
    : 0;

  const lineTotal = (basePrice + addonTotal + dipTotal) * qty;

  /* ── Validate dips (required tiers must have a selection) ── */
  const dipsValid = !item.dips || DIP_TIERS.every(
    (tier) => !tier.required || dipSelections[tier.id]
  );

  const handleAdd = () => {
    if (!dipsValid) return;
    onAddToCart({
      item,
      serve: serveMode ? serve : null,
      qty,
      addons: item.hasAddOns ? ADD_ONS.filter((a) => addons[a.id]) : [],
      dips: item.dips
        ? DIP_TIERS.map((tier) => ({
            tier: tier.label,
            chosen: tier.options.find((o) => o.id === dipSelections[tier.id]),
          })).filter((d) => d.chosen && d.chosen.id !== "none")
        : [],
      lineTotal,
    });
    onClose();
  };

  return (
    <div className="popup-overlay" ref={overlayRef} onClick={handleOverlayClick}>
      <div className="popup">

        {/* ── Header ── */}
        <div className="popup-header">
          <div className="popup-header-left">
            <h2 className="popup-name">
              {item.name}
              {item.bestSeller && <span className="best-seller-badge">♥</span>}
            </h2>
            {group.brand && <span className="popup-brand">{group.brand}</span>}
          </div>
          {/* Show price(s) in header */}
          <div className="popup-prices">
            {serveMode === "hot_iced" && (
              <>
                <span className="popup-price-tag">Hot <strong>{peso(item.hotPrice)}</strong></span>
                <span className="popup-price-tag">Iced <strong>{peso(item.icedPrice)}</strong></span>
              </>
            )}
            {serveMode === "hot_only" && (
              <span className="popup-price-tag"><strong>{peso(item.hotPrice)}</strong></span>
            )}
            {serveMode === "iced_only" && (
              <span className="popup-price-tag"><strong>{peso(item.icedPrice)}</strong></span>
            )}
            {!serveMode && (
              <span className="popup-price-tag"><strong>{peso(item.price)}</strong></span>
            )}
          </div>
        </div>

        {/* ── Image ── */}
        <div className="popup-img-wrap">
          <img src={item.image || PLACEHOLDER} alt={item.name} className="popup-img" />
        </div>

        {/* ── Serve type (only when hot_iced) ── */}
        {serveMode === "hot_iced" && (
          <div className="popup-section">
            <div className="popup-section-label">Type</div>
            <div className="popup-serve-row">
              {[
                { key: "hot",  label: "Hot",  price: item.hotPrice  },
                { key: "iced", label: "Iced", price: item.icedPrice },
              ].map(({ key, label, price }) => (
                <button
                  key={key}
                  className={`serve-btn ${serve === key ? "serve-btn--active" : ""}`}
                  onClick={() => setServe(key)}
                >
                  {label}
                  <span className="serve-price">{peso(price)}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Serve label only (hot_only / iced_only) ── */}
        {(serveMode === "hot_only" || serveMode === "iced_only") && (
          <div className="popup-section">
            <div className="popup-section-label">Served</div>
            <div className="popup-serve-row">
              <span className="serve-static">
                {serveMode === "hot_only" ? "Hot" : "Iced"}
              </span>
            </div>
          </div>
        )}

        {/* ── Quantity ── */}
        <div className="popup-section">
          <div className="popup-section-label">Quantity</div>
          <div className="popup-qty-row">
            <button className="qty-btn" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
            <span className="qty-display">{qty}</span>
            <button className="qty-btn" onClick={() => setQty((q) => q + 1)}>+</button>
          </div>
        </div>

        {/* ── Add-ons ── */}
        {item.hasAddOns && (
          <div className="popup-section">
            <div className="popup-section-label">Add-ons</div>
            <div className="popup-addons">
              {ADD_ONS.map((addon) => (
                <label key={addon.id} className="addon-row">
                  <input
                    type="checkbox"
                    checked={!!addons[addon.id]}
                    onChange={() => toggleAddon(addon.id)}
                    className="addon-checkbox"
                  />
                  <span className="addon-label">{addon.label}</span>
                  <span className="addon-price">+{peso(addon.price)}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* ── Dips ── */}
        {item.dips && DIP_TIERS.map((tier) => (
          <div key={tier.id} className="popup-section">
            <div className="popup-section-label">
              {tier.label}
              {tier.required && <span className="dip-required">*</span>}
            </div>
            <div className="popup-dips">
              {tier.options.map((opt) => (
                <label key={opt.id} className="dip-row">
                  <input
                    type="radio"
                    name={tier.id}
                    checked={dipSelections[tier.id] === opt.id}
                    onChange={() => setDip(tier.id, opt.id)}
                    className="dip-radio"
                  />
                  <span className="addon-label">{opt.label}</span>
                  <span className="addon-price">
                    {opt.price === 0 ? "Free" : `+${peso(opt.price)}`}
                  </span>
                </label>
              ))}
            </div>
          </div>
        ))}

        {/* ── Footer ── */}
        <div className="popup-footer">
          <span className="popup-total-label">
            Total: <strong>{peso(lineTotal)}</strong>
          </span>
          <button
            className="btn-add-item"
            onClick={handleAdd}
            disabled={!dipsValid}
          >
            Add Item
          </button>
        </div>

      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MENU PAGE
═══════════════════════════════════════════════════════════════════ */
export default function MenuPage() {
  const navigate = useNavigate();

  const [activeCategory, setActiveCategory] = useState(null);
  const [popup, setPopup]                   = useState(null);
  const [cart, setCart]                     = useState([]);

  const sections = ["Drinks", "Meals"];

  const visibleGroups = activeCategory
    ? MENU.filter((g) => g.category === activeCategory)
    : MENU;

  const cartTotal = cart.reduce((s, e) => s + e.lineTotal, 0);

  const handleAddToCart = (entry) => setCart((prev) => [...prev, entry]);

  /* ── Resolve the display price shown on the menu card ── */
  const cardPrice = (item, group) => {
    const mode = getServeOptions(item, group);
    if (mode === "hot_iced")   return `${peso(item.hotPrice)} | ${peso(item.icedPrice)}`;
    if (mode === "hot_only")   return peso(item.hotPrice);
    if (mode === "iced_only")  return peso(item.icedPrice);
    return peso(item.price);
  };

  return (
    <div className="menu-page">
      <NavBar />

      {/* ── Hero ── */}
      <div className="menu-hero">
        <h1 className="menu-hero-title">Menu</h1>
      </div>

      {/* ── Category chips ── */}
      <div className="menu-chips-wrap">
        <div className="menu-chips">
          <button
            className={`chip ${activeCategory === null ? "chip--active" : ""}`}
            onClick={() => setActiveCategory(null)}
          >
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`chip ${activeCategory === cat ? "chip--active" : ""}`}
              onClick={() => setActiveCategory((prev) => (prev === cat ? null : cat))}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── Menu list ── */}
      <div className="menu-list">
        {sections.map((section) => {
          const sectionGroups = visibleGroups.filter((g) => g.section === section);
          if (!sectionGroups.length) return null;
          return (
            <div key={section} className="menu-section">
              <h2 className="menu-section-title">{section}</h2>
              {sectionGroups.map((group) => (
                <div key={group.category}>
                  <p className="menu-category-label">{group.category}</p>
                  {group.items.map((item) => (
                    <button
                      key={item.id}
                      className="menu-item"
                      onClick={() => setPopup({ item, group })}
                    >
                      <img
                        src={item.image || PLACEHOLDER}
                        alt={item.name}
                        className="menu-item-img"
                      />
                      <div className="menu-item-info">
                        <span className="menu-item-name">
                          {item.name}
                          {item.bestSeller && (
                            <span className="best-seller-icon" title="Best Seller">♥</span>
                          )}
                        </span>
                        <span className="menu-item-price">{cardPrice(item, group)}</span>
                      </div>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* ── Sticky footer ── */}
      <div className="menu-footer">
        <span className="menu-footer-total">
          Total: <strong>{peso(cartTotal)}</strong>
        </span>
        <button
          className="btn-checkout"
          disabled={cart.length === 0}
          onClick={() => navigate("/checkout/cart", { state: { cart } })}
        >
          Checkout
          {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
        </button>
      </div>

      {/* ── Popup ── */}
      {popup && (
        <ItemPopup
          item={popup.item}
          group={popup.group}
          onClose={() => setPopup(null)}
          onAddToCart={handleAddToCart}
        />
      )}
    </div>
  );
}
