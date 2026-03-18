import { useState } from "react";
import { MdOutlineMail } from "react-icons/md";
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import "../css/ContactUs.css";

import { useNavigate } from "react-router-dom";

const NAV_ROUTES = [
  { label: "Home",    path: "/" },
  { label: "Menu",    path: "/menu" },
  { label: "Contact", path: "/contact" },
];

const ContactUs = () => {
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
    const navigate = useNavigate();
        const handleNav = (path) => {
        closeMenu();
        navigate(path);
    };

    const [menuExpanded, setMenuExpanded] = useState(false);
    const MENU_SUBNAV = [
        {
        section: "Drinks",
        categories: ["Coffee", "Non-Coffee", "Frappes", "Fruit Teas"],
        },
        {
        section: "Meals",
        categories: ["Pasta", "Rice Meals", "Snacks", "Sandwiches"],
        },
    ];

    return (
        <div className="wrapper">

            {/* ── Hamburger (always on top) ── */}
            <div className = "nav_background">
                <button className="nav_hamburger" onClick={toggleMenu} aria-label="Toggle menu">
                ☰
                </button>
            </div>

            {/* ── Dropdown overlay ── */}
            {menuVisible && (
            <div
                className={`dropdown-overlay ${closing ? "dropdown-overlay--closing" : ""}`}
                onClick={closeMenu}
            />
            )}

            {menuVisible && (
            <div className={`dropdown ${closing ? "dropdown--closing" : ""}`}>
                {NAV_ROUTES.map(({ label, path }) => (
                <div key={label}>
                    <div
                    className={`dropdown_item ${label === "Menu" ? "dropdown_item--parent" : ""}`}
                    onClick={() => {
                        if (label === "Menu") setMenuExpanded((prev) => !prev);
                        else handleNav(path);
                    }}
                    >
                    {label}
                    {label === "Menu" && (
                        <span className={`dropdown_arrow ${menuExpanded ? "dropdown_arrow--open" : ""}`}>
                        ▼
                        </span>
                    )}
                    </div>

                    {label === "Menu" && menuExpanded && (
                    <div className="dropdown_subnav">
                        {MENU_SUBNAV.map((group) => (
                        <div key={group.section}>
                            <div className="dropdown_subgroup_label">{group.section}</div>
                            {group.categories.map((cat) => (
                            <div
                                key={cat}
                                className="dropdown_subitem"
                                onClick={() => handleNav("/menu")}
                            >
                                {cat}
                            </div>
                            ))}
                        </div>
                        ))}
                    </div>
                    )}
                </div>
                ))}
            </div>
            )}



            {/* ── Hero ── */}
            <section className="hero">
                <div className="hero_text">
                <h1 className="hero_title">Komplex Cafe</h1>
                <p className="hero_tagline">"...Where every cup tells a story."</p>
                </div>
            </section>

            {/* Contact Us Header */}
            <section className="contacts">
                <h1 className="contacts_Title">Contact Us</h1>
                <p className="contacts_text">
                    Reach out to us through our contacts below. 
                    We will try and send a reply as soon as we are 
                    available.
                </p>

                {/* List of Contacts */}
                <div className="contacts_email">
                    <h3 className="contacts_email_text">Email</h3>
                    <p className="email_text"><MdOutlineMail /> komplexcafe@gmail.com</p>
                </div>
                
                <div className="contacts_socmed">
                    <h3 className="contacts_socmed_text">Social Media</h3>
                    <p className="socmed_fb_text"><FaFacebook /> Komplex Cafe</p>
                    <p className="socmed_ig_text"><FaInstagram /> @komplex.cafe</p>
                </div>

                <div className="contacts_other">
                    <h3 className="other_text">Komplex Studios</h3>
                    <p className="other_socmed_fb_text"><FaFacebook /> Komplex Studios</p>
                    <p className="other_socmed_ig_text"><FaInstagram /> @komplex.studios</p>
                </div>

            </section>

        </div>
    )

}

export default ContactUs;