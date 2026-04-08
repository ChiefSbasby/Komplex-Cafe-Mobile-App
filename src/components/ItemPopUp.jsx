import { useState, useRef, useEffect } from "react";
import { ADD_ONS, DIP_TIERS } from "../assets/data/menuData.js";
import "../css/PopUp.css";

const peso = (n) =>
  "₱" + Number(n).toLocaleString("en-PH", { minimumFractionDigits: 2 });

const PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect width='80' height='80' fill='%23d1d5db'/%3E%3C/svg%3E";

const IS_DRINK   = (item) => item.category?.toLowerCase() === "drink";
const IS_CHURROS = (item) => item.m_name?.toLowerCase().includes("churro");

export default function ItemPopup({ item, onClose, onAddToCart }) {
  const [qty, setQty]     = useState(1);
  const [addons, setAddons] = useState({});
  const [dipSelections, setDipSelections] = useState(() => {
    const init = {};
    DIP_TIERS.forEach((tier) => {
      if (!tier.required) {
        const noneOpt = tier.options.find((o) => o.id === "none");
        if (noneOpt) init[tier.id] = "none";
      }
    });
    return init;
  });

  const overlayRef = useRef();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "");
  }, []);

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  const toggleAddon = (id) =>
    setAddons((prev) => ({ ...prev, [id]: !prev[id] }));

  const setDip = (tierId, optionId) =>
    setDipSelections((prev) => ({ ...prev, [tierId]: optionId }));

  const isDrink   = IS_DRINK(item);
  const isChurros = IS_CHURROS(item);

  const addonTotal = isDrink
    ? ADD_ONS.filter((a) => addons[a.id]).reduce((s, a) => s + a.price, 0)
    : 0;

  const dipTotal = isChurros
    ? DIP_TIERS.reduce((sum, tier) => {
        const chosen = tier.options.find((o) => o.id === dipSelections[tier.id]);
        return sum + (chosen ? chosen.price : 0);
      }, 0)
    : 0;

  const lineTotal = (item.price + addonTotal + dipTotal) * qty;

  const dipsValid = !isChurros || DIP_TIERS.every(
    (tier) => !tier.required || dipSelections[tier.id]
  );

  const handleAdd = () => {
    if (!dipsValid) return;
    onAddToCart({
      item,
      serve: null,
      qty,
      addons: isDrink ? ADD_ONS.filter((a) => addons[a.id]) : [],
      dips: isChurros
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

        {/* Header */}
        <div className="popup-header">
          <h2 className="popup-name">{item.m_name}</h2>
          <span className="popup-price-tag"><strong>{peso(item.price)}</strong></span>
        </div>

        {/* Image */}
        <div className="popup-img-wrap">
          <img src={item.image_url || PLACEHOLDER} alt={item.m_name} className="popup-img" />
        </div>

        {/* Quantity */}
        <div className="popup-section">
          <div className="popup-section-label">Quantity</div>
          <div className="popup-qty-row">
            <button className="qty-btn" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
            <span className="qty-display">{qty}</span>
            <button className="qty-btn" onClick={() => setQty((q) => q + 1)}>+</button>
          </div>
        </div>

        {/* Add-ons — drinks only */}
        {isDrink && (
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

        {/* Dips — churros only */}
        {isChurros && DIP_TIERS.map((tier) => (
          <div key={tier.id} className="popup-section">
            <div className="popup-section-label">
              {tier.label}
              {tier.required && <span className="dip-required"> *</span>}
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

        {/* Footer */}
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