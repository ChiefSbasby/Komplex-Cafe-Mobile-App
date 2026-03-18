import { useState, useEffect, useRef } from "react";
// import "../css/CheckoutPage.css";
import "../css/NavBar.css";

const NAV_ITEMS = ["Home", "Menu", "About", "Contact"];

export default function CheckoutPage() {
    /* ── Nav Bar ── */
    const [menuOpen, setMenuOpen] = useState(false);
    const [menuVisible, setMenuVisible] = useState(false);
    const [closing, setClosing] = useState(false);

    const openMenu = () => {
        setMenuVisible(true);
        setMenuOpen(true);
        setClosing(false);
    };

    const closeMenu = () => {
        setClosing(true);
        setTimeout(() => {
        setMenuOpen(false);
        setMenuVisible(false);
        setClosing(false);
        }, 280); // match animation duration
    };

    const toggleMenu = () => {
        if (menuOpen) closeMenu();
        else openMenu();
    };

    return (
        <div className="checkout-page">
           
            {/* ── Hamburger (always on top) ── */}
            <div className = "nav_background">
                <button className="nav_hamburger" onClick={toggleMenu} aria-label="Toggle menu">
                ☰
                </button>
            </div>

            {/* ── Dropdown ── */}
            {menuVisible && (
                <div className={`dropdown ${closing ? "dropdown--closing" : ""}`}>
                {NAV_ITEMS.map((item) => (
                    <div key={item} className="dropdown_item" onClick={closeMenu}>
                    {item}
                    </div>
                ))}
                </div>
            )}

            {/* ── Hero banner ── */}
            <div className="menu-hero">
            <h1 className="menu-hero-title">Menu</h1>
            </div>

            {/* ── Sticky footer ── */}
            <div className="menu-footer">
                <div className="menu-footer-total">
                    <span className="menu-footer-total">
                        Total: <strong>{peso(cartTotal)}</strong>
                    </span>
                </div>
                <div className="menu-footer-buttons">
                    <button className="btn-back">
                        Back
                    </button>
                    <button className="btn-continue" disabled={cart.length === 0}>
                        Continue
                    </button>
                </div>
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

            {/* ── Menu Item ── */}
            {/* idk how this works yet */}

            {/* Checkout Page  */}

        </div>
        );
}