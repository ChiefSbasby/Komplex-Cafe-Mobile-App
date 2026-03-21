import { useState, useRef } from "react";
// import "../css/CheckoutPage.css";
import { useLocation, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";

const NAV_ROUTES = [
  { label: "Home",    path: "/" },
  { label: "Menu",    path: "/menu" },
  { label: "Contact", path: "/contact" },
];

    const peso = (n) =>
  "₱" + Number(n).toLocaleString("en-PH", { minimumFractionDigits: 2 });

export default function CheckoutPage_1() {
    const location = useLocation();
    const navigate = useNavigate();

    const cart = location.state?.cart ?? [];
    const cartTotal = cart.reduce((s,e) => s + e.lineTotal, 0);

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
           
            <NavBar />

            {/* ── Hero banner ── */}
            <div className="menu-hero">
            <h1 className="menu-hero-title">Checkout</h1>
            </div>

            {/* ── Cart items ── */}

            {/* ── Sticky footer ── */}
            <div className="menu-footer">
                <span className="menu-footer-total">
                Total: <strong>{peso(cartTotal)}</strong>
                </span>
                <div className="menu-footer-buttons">
                <button className="btn-back" onClick={() => navigate("/menu")}>Back</button>
                <button className="btn-continue" disabled={cart.length === 0}>Continue</button>
                </div>
            </div>
        </div>
    );
}