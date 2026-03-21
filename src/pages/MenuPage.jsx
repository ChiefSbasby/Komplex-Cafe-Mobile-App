import { useState, useEffect, useRef } from "react";
import { MENU, ADD_ONS, CATEGORIES } from "../assets/data/menuData.js";
import "../css/MenuPage.css";
import NavBar from "../components/NavBar";


import { useNavigate } from "react-router-dom";

/* ─── Placeholder image (grey square SVG) ─────────────────────── */
const PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect width='80' height='80' fill='%23d1d5db'/%3E%3C/svg%3E";

/* ─── Currency formatter ───────────────────────────────────────── */
const peso = (n) =>
  "₱" + Number(n).toLocaleString("en-PH", { minimumFractionDigits: 2 });

/* ═══════════════════════════════════════════════════════════════════
   ITEM POPUP
═══════════════════════════════════════════════════════════════════ */
function ItemPopup({ item, group, onClose, onAddToCart }) {
  const [serve, setServe] = useState("hot");
  const [qty, setQty] = useState(1);
  const [addons, setAddons] = useState({});
  const overlayRef = useRef();

  /* lock body scroll while open */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "");
  }, []);

  /* click outside to close */
  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  const toggleAddon = (id) =>
    setAddons((prev) => ({ ...prev, [id]: !prev[id] }));

  const addonTotal = ADD_ONS.filter((a) => addons[a.id]).reduce(
    (s, a) => s + a.price,
    0
  );
  const upcharge =
    group.serveOptions === "hot_iced" && serve === "iced"
      ? group.icedUpcharge
      : 0;
  const lineTotal = (item.price + upcharge + addonTotal) * qty;

  const handleAdd = () => {
    onAddToCart({
      item,
      serve: group.serveOptions ? serve : null,
      qty,
      addons: ADD_ONS.filter((a) => addons[a.id]),
      lineTotal,
    });
    onClose();
  };

  return (
    <div className="popup-overlay" ref={overlayRef} onClick={handleOverlayClick}>
      <div className="popup">
        {/* Header */}
        <div className="popup-header">
          <div>
            <h2 className="popup-name">{item.name}</h2>
            {group.brand && (
              <span className="popup-brand">{group.brand}</span>
            )}
          </div>
          <span className="popup-base-price">{peso(item.price)}</span>
        </div>

        {/* Image */}
        <div className="popup-img-wrap">
          <img
            src={item.image || PLACEHOLDER}
            alt={item.name}
            className="popup-img"
          />
        </div>

        {/* Serve type */}
        {group.serveOptions === "hot_iced" && (
          <div className="popup-section">
            <div className="popup-section-label">Type</div>
            <div className="popup-serve-row">
              {["hot", "iced"].map((opt) => (
                <button
                  key={opt}
                  className={`serve-btn ${serve === opt ? "serve-btn--active" : ""}`}
                  onClick={() => setServe(opt)}
                >
                  {opt.charAt(0).toUpperCase() + opt.slice(1)}
                  {opt === "iced" && group.icedUpcharge > 0 && (
                    <span className="serve-upcharge">
                      (+{group.icedUpcharge}.00)
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity */}
        <div className="popup-section">
          <div className="popup-section-label">Quantity</div>
          <div className="popup-qty-row">
            <button
              className="qty-btn"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
            >
              −
            </button>
            <span className="qty-display">{qty}</span>
            <button className="qty-btn" onClick={() => setQty((q) => q + 1)}>
              +
            </button>
          </div>
        </div>

        {/* Add-ons */}
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

        {/* Footer */}
        <div className="popup-footer">
          <span className="popup-total-label">
            Total: <strong>{peso(lineTotal)}</strong>
          </span>
          <button className="btn-add-item" onClick={handleAdd}>
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

  /* ── Menu ── */  

  const [activeCategory, setActiveCategory] = useState(null);
  const [popup, setPopup] = useState(null); // { item, group }
  const [cart, setCart] = useState([]);

  /* group items by section for the list */
  const sections = ["Drinks", "Meals"];

  /* filter by active category chip */
  const visibleGroups = activeCategory
    ? MENU.filter((g) => g.category === activeCategory)
    : MENU;

  const cartTotal = cart.reduce((s, e) => s + e.lineTotal, 0);

  const handleAddToCart = (entry) => {
    setCart((prev) => [...prev, entry]);
  };

  return (
    <div className="menu-page">
      <NavBar />

      {/* ── Hero banner ── */}
      <div className="menu-hero">
        <h1 className="menu-hero-title">Menu</h1>
      </div>

      {/* ── Category chips ── */}
      <div className="menu-chips-wrap">
        <div className="menu-chips">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`chip ${activeCategory === cat ? "chip--active" : ""}`}
              onClick={() =>
                setActiveCategory((prev) => (prev === cat ? null : cat))
              }
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── Menu list ── */}
      <div className="menu-list">
        {sections.map((section) => {
          const sectionGroups = visibleGroups.filter(
            (g) => g.section === section
          );
          if (!sectionGroups.length) return null;
          return (
            <div key={section} className="menu-section">
              <h2 className="menu-section-title">{section === "Drinks" ? "Drinks" : "Meals"}</h2>
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
                        <span className="menu-item-name">{item.name}</span>
                        <span className="menu-item-price">{peso(item.price)}</span>
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
        <button className="btn-checkout" 
          disabled={cart.length === 0}
          onClick={() => navigate("/checkout/cart", {state: {cart}})}
        >
          Checkout
          {cart.length > 0 && (
            <span className="cart-badge">{cart.length}</span>
          )}
        </button>
      </div>

      {/* ── Item Popup ── */}
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
