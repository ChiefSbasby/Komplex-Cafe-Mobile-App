import { useState } from "react";
import "../css/CheckoutPage.css";
import { useLocation, useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import NavBar from "../components/NavBar";
import EditItem from "../components/EditItem";

const peso = (n) =>
    "₱" + Number(n).toLocaleString("en-PH", { minimumFractionDigits: 2 });

/* ── Build a readable subtitle for a cart entry ── */
const entrySubtitle = (entry) => {
    const parts = [];

    // Serve type
    if (entry.serve) {
        parts.push(entry.serve.charAt(0).toUpperCase() + entry.serve.slice(1));
    }

    // Add-ons
    if (entry.addons && entry.addons.length > 0) {
        parts.push(entry.addons.map((a) => a.label).join(", "));
    } else if (entry.item?.hasAddOns) {
        parts.push("No Add-ons");
    }

    // Dips
    if (entry.dips && entry.dips.length > 0) {
        entry.dips.forEach((d) => {
            if (d.chosen && d.chosen.id !== "none") {
                parts.push(d.chosen.label);
            }
        });
    }

    return parts.join(" | ") || "No customizations";
};

export default function CheckoutPage_1() {
    const location  = useLocation();
    const navigate  = useNavigate();

    /* ── Cart state (mutable inside this page) ── */
    const [cart, setCart] = useState(location.state?.cart ?? []);

    /* ── Edit popup state ── */
    const [editTarget, setEditTarget] = useState(null); // { entry, index }

    const cartTotal = cart.reduce((s, e) => s + e.lineTotal, 0);

    /* ── Remove an item from cart ── */
    const handleRemove = (index) => {
        setCart((prev) => prev.filter((_, i) => i !== index));
    };

    /* ── Adjust quantity directly from cart row ── */
    const handleQtyChange = (index, delta) => {
        setCart((prev) =>
            prev.map((entry, i) => {
                if (i !== index) return entry;
                const newQty = Math.max(1, entry.qty + delta);
                const unitPrice = entry.lineTotal / entry.qty;
                return { ...entry, qty: newQty, lineTotal: unitPrice * newQty };
            })
        );
    };

    /* ── Save edited entry back to cart ── */
    const handleSaveEdit = (updatedEntry, index) => {
        setCart((prev) => prev.map((e, i) => (i === index ? updatedEntry : e)));
    };

    return (
        <div className="wrapper">
            <div className="checkout-page">

                <NavBar />

                {/* ── Hero banner ── */}
                <div className="checkout-hero">
                    <h1 className="checkout-hero-title">Checkout</h1>
                </div>

                {/* ── Cart items ── */}
                <div className="checkout-list">
                    {cart.length === 0 && (
                        <p className="checkout-empty">Your cart is empty.</p>
                    )}

                    {cart.map((entry, index) => (
                        <div key={index} className="checkout-item">
                            {/* Name + price */}
                            <div className="checkout-item-top">
                                <span className="checkout-item-name">{entry.item.name}</span>
                                <span className="checkout-item-price">{peso(entry.lineTotal)}</span>
                            </div>

                            {/* Subtitle (serve / addons / dips) */}
                            <p className="checkout-item-sub">{entrySubtitle(entry)}</p>

                            {/* Controls */}
                            <div className="checkout-item-controls">
                                <button
                                    className="btn-edit-item"
                                    onClick={() => setEditTarget({ entry, index })}
                                >
                                    Edit Item
                                </button>

                                <button
                                    className="btn-remove-item"
                                    onClick={() => handleRemove(index)}
                                >
                                    <FaTrash /> Remove
                                </button>

                                {/* Qty stepper */}
                                <div className="item-qty-stepper">
                                    <button
                                        className="item-qty-btn"
                                        onClick={() => handleQtyChange(index, -1)}
                                    >
                                        −
                                    </button>
                                    <span className="item-qty-display">{entry.qty}</span>
                                    <button
                                        className="item-qty-btn"
                                        onClick={() => handleQtyChange(index, +1)}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── Sticky footer ── */}
                <div className="checkout-footer">
                    <div className="checkout-footer-total">
                        Total: <strong>{peso(cartTotal)}</strong>
                    </div>
                    <div className="checkout-footer-buttons">
                        <button
                            className="btn-back"
                            onClick={() => navigate("/menu", { state: { cart } })}
                        >
                            Back
                        </button>
                        <button
                            className="btn-continue"
                            disabled={cart.length === 0}
                            onClick={() => navigate("/checkout/extra", { state: { cart } })}
                        >
                            Continue
                        </button>
                    </div>
                </div>

                {/* ── Edit popup ── */}
                {editTarget && (
                    <EditItem
                        entry={editTarget.entry}
                        entryIndex={editTarget.index}
                        onClose={() => setEditTarget(null)}
                        onSave={handleSaveEdit}
                    />
                )}

            </div>
        </div>
    );
}