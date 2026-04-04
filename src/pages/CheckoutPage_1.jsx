import { useState } from "react";
import "../css/CheckoutPage.css";
import { useLocation, useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import NavBar from "../components/NavBar";

const peso = (n) =>
    "₱" + Number(n).toLocaleString("en-PH", { minimumFractionDigits: 2 });

export default function CheckoutPage_1() {
    const location = useLocation();
    const navigate = useNavigate();

    /* ── Cart state (mutable inside this page) ── */
    const [cart, setCart] = useState(
        /* Ensure every entry has a valid qty — guards against stale state */
        (location.state?.cart ?? []).map((e) => ({ ...e, qty: e.qty ?? 1 }))
    );

    const cartTotal = cart.reduce((s, e) => s + e.price * e.qty, 0);

    /* ── Remove an item from cart ── */
    const handleRemove = (index) => {
        setCart((prev) => prev.filter((_, i) => i !== index));
    };

    /* ── Adjust quantity; removes row if qty reaches 0 ── */
    const handleQtyChange = (index, delta) => {
        setCart((prev) =>
            prev
                .map((entry, i) => {
                    if (i !== index) return entry;
                    return { ...entry, qty: entry.qty + delta };
                })
                .filter((entry) => entry.qty > 0)
        );
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
                        <div key={entry.item_id} className="checkout-item">
                            {/* Name + line total */}
                            <div className="checkout-item-top">
                                <span className="checkout-item-name">{entry.m_name}</span>
                                <span className="checkout-item-price">
                                    {peso(entry.price * entry.qty)}
                                </span>
                            </div>

                            {/* Unit price */}
                            <p className="checkout-item-sub">{peso(entry.price)} each</p>

                            {/* Controls */}
                            <div className="checkout-item-controls">
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
                            onClick={() =>
                                navigate("/checkout/extra", { state: { cart } })
                            }
                        >
                            Continue
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}