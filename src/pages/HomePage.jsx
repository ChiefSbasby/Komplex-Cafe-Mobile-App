import { useState, useEffect } from "react";
import "../css/HomePage.css";
import "../css/NavBar.css";

const HOURS = [
  ["Weekdays:", "10:00 AM - 2:00 AM"],
  ["Saturdays:", "10:00 AM - 12:00 AM"],
  ["Sundays:", "12:00 PM - 10:00 PM"],
];

import { useNavigate } from "react-router-dom";

const NAV_ROUTES = [
  { label: "Home",    path: "/" },
  { label: "Menu",    path: "/menu" },
  { label: "Contact", path: "/contact" },
];

const HomePage = () => {
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

      {/* ── Intro ── */}
      <section className="intro">
        <p className="intro_body">
          Located in the heart of Sampaloc, Manila near UST, we blend studying
          and coffee to inspire your creativity. Join us for a unique experience
          that goes beyond the ordinary.
        </p>
        <div className="intro_cta-wrap">
          <button className="btn--orange">Browse Menu</button>
        </div>
      </section>

      {/* ── About ── */}
      <section className="about">
        <div className="about_img-wrap">
          <img
            src="../src/assets/homepageAbout.png"
            alt="Coffee drinks"
          />
        </div>
        <p className="about_text">
          Here at Komplex Cafe, you can focus on your work while enjoying
          freshly brewed coffee. We also offer fruit tea, pasta, and pastries.
        </p>
      </section>
      {/*test*/}

      {/* ── Hours ── */}
      <section className="hours">
        <img
          className="hours_bg"
          src="../src/assets/homepageOpenbg.png"
          alt="Cafe background"
        />
        <div className="hours_content">
          <h2 className="hours_title">We're open on:</h2>
          {HOURS.map(([day, time]) => (
            <div key={day} className="hours_row">
              <span className="hours_day">{day}</span>
              <span>{time}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Booking CTA ── */}
      <section className="booking">
        <div className="booking_copy">
          <p className="booking_text">
            Interested in booking Komplex Cafe for an event? Come send us a
            message!
          </p>
          <button className="btn--white">Contact Us</button>
        </div>
        <div className="booking_img-wrap">
          <img
            src="../src/assets/homePageContact.png"
            alt="Coffee"
          />
        </div>
      </section>

      {/* ── Address ── */}
      <footer className="address">
        <p className="address_label">Visit us at:</p>
        <div className="address_row">
          <span className="address_pin">📍</span>
          <p className="address_text">
            1045 Padre Noval St, Sampaloc,
            <br />
            Manila, 1008 Metro Manila
          </p>
        </div>
      </footer>

    </div>
  );
};

export default HomePage;