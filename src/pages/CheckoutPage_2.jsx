import { useState, useRef } from "react";
import { FaCashRegister } from "react-icons/fa";
import { MdOutlineTableRestaurant } from "react-icons/md";
import "../css/CheckoutPage.css";
import { useLocation, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";

const NAV_ROUTES = [
    { label: "Home", path: "/" },
    { label: "Menu", path: "/menu" },
    { label: "Contact", path: "/contact" },
];

const peso = (n) =>
    "₱" + Number(n).toLocaleString("en-PH", { minimumFractionDigits: 2 });

function orderForm() {
    {/* stuf s supposd to go here idk wat */}
}

export default function CheckoutPage_2() {
    const location = useLocation();
    const navigate = useNavigate();

    const cart = location.state?.cart ?? [];
    const cartTotal = cart.reduce((s, e) => s + e.lineTotal, 0);

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
            <div className="checkout-hero">
                <h1 className="checkout-hero-title">Checkout</h1>
            </div>

            <p>hi ur in the SECOND checkout page</p>

            {/* ── Order Details ── */}
            {/* not implemented yet: where data goes after form is filled */}

            <form className="checkout-extra">
                <section className="order-type">
                        <h2 className="order-type-label">Order Type</h2>
                        <button className="btn-dine-in">Dine In</button>
                        <button className="btn-take-out">Take Out</button>
                </section >

                <section className="receive-at">
                    <label className="receive-at-label">
                        <h2>Receive at</h2>
                    </label>
                        <button className="btn-counter">
                            <strong>Counter</strong>
                            <FaCashRegister />
                        </button>
                        <button className="btn-table">
                            <strong>Table</strong>
                            <MdOutlineTableRestaurant />
                        </button>
                </section>

                <section className="spec-instruct">
                    <label className="spec-instruct-label">
                        <h2>Special Instructions</h2>
                    </label>
                    <textarea id="spec-instruct-text" name="spec-instruct-text" rows="7"
                    defaultValue={<i>Example: no salt, no cutlery, etc.</i>}>
                    </textarea> 
                </section>

            </form>

            {/* ── Sticky footer ── */}
            <div className="checkout-footer">
                <div className="checkout-footer-total">
                    Total: <strong>{peso(cartTotal)}</strong>
                </div>
                <div className="checkout-footer-buttons">
                    <button className="btn-back" onClick={() => navigate("/checkout/cart")}>Back</button>
                    {/* checkout button is not implemented yet */}
                    <button className="btn-checkout" onClick={() => navigate("/checkout/cart")}>Checkout</button>
                </div>
            </div>
        </div>
    );
}