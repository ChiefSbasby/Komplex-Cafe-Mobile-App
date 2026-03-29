import { useState, useEffect, useRef } from "react";
import { ADD_ONS, DIP_TIERS } from "../assets/data/menuData.js";
import "../css/PopUp.css";
import "../css/CheckoutEditItem.css";

/* ─── Currency formatter ───────────────────────────────────────── */
const peso = (n) =>
  "₱" + Number(n).toLocaleString("en-PH", { minimumFractionDigits: 2 });

/* ─── Placeholder image ────────────────────────────────────────── */
const PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect width='80' height='80' fill='%23d1d5db'/%3E%3C/svg%3E";

/* ─── Resolve serve options for an individual item ─────────────── */
const getServeOptions = (item, group) =>
  item.serveOptions !== undefined ? item.serveOptions : group?.serveOptions ?? null;

/* ─── Resolve display price for a cart-entry item ──────────────── */
const resolveBasePrice = (item, serve) => {
  if (item.hotPrice !== undefined) {
    return serve === "iced" ? item.icedPrice : item.hotPrice;
  }
  return item.price;
};

/* ═══════════════════════════════════════════════════════════════════
   EDIT ITEM POPUP
   Props:
     entry      — the cart entry object to edit (with item, group, serve, qty, addons, dips, lineTotal)
     entryIndex — index in cart array (used to update the right entry)
     onClose    — () => void
     onSave     — (updatedEntry, entryIndex) => void
═══════════════════════════════════════════════════════════════════ */
export default function EditItem({ entry, entryIndex, onClose, onSave }) {
  const { item, group } = entry;
  const serveMode = getServeOptions(item, group ?? {});

  /* ── Pre-fill state from existing cart entry ── */
  const [serve, setServe] = useState(() => entry.serve ?? "hot");
  const [qty, setQty]     = useState(entry.qty ?? 1);

  /* Pre-fill addons: build a map of { addonId: true } from entry.addons array */
  const [addons, setAddons] = useState(() => {
    const map = {};
    (entry.addons ?? []).forEach((a) => { map[a.id] = true; });
    return map;
  });

  /* Pre-fill dip selections from entry.dips array */
  const [dipSelections, setDipSelections] = useState(() => {
    const init = {};
    // Set defaults first (same as ItemPopup)
    DIP_TIERS.forEach((tier) => {
      if (!tier.required) {
        const noneOpt = tier.options.find((o) => o.id === "none");
        if (noneOpt) init[tier.id] = "none";
      }
    });
    // Overwrite with what was previously selected
    (entry.dips ?? []).forEach((d) => {
      if (d.chosen) {
        const tier = DIP_TIERS.find((t) =>
          t.options.some((o) => o.id === d.chosen.id)
        );
        if (tier) init[tier.id] = d.chosen.id;
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

  /* ── Validate dips ── */
  const dipsValid = !item.dips || DIP_TIERS.every(
    (tier) => !tier.required || dipSelections[tier.id]
  );

  /* ── Save handler ── */
  const handleSave = () => {
    if (!dipsValid) return;
    const updatedEntry = {
      ...entry,
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
    };
    onSave(updatedEntry, entryIndex);
    onClose();
  };

  return (
    <div className="popup-overlay" ref={overlayRef} onClick={handleOverlayClick}>
      <div className="popup edit-popup">

        {/* ── Edit badge ── */}
        <div className="edit-popup-badge">Editing Item</div>

        {/* ── Header ── */}
        <div className="popup-header">
          <div className="popup-header-left">
            <h2 className="popup-name">
              {item.name}
              {item.bestSeller && <span className="best-seller-badge">♥</span>}
            </h2>
            {group?.brand && <span className="popup-brand">{group.brand}</span>}
          </div>
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
                    name={`edit-${tier.id}`}
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
            className="btn-add-item btn-save-item"
            onClick={handleSave}
            disabled={!dipsValid}
          >
            Save Changes
          </button>
        </div>

      </div>
    </div>
  );
}