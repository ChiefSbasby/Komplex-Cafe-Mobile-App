import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/NavBar.css";

const NAV_ROUTES = [
  { label: "Home",    path: "/" },
  { label: "Menu",    path: "/menu" },
  { label: "Contact", path: "/contact" },
];

const MENU_SUBNAV = [
  { section: "Drinks",    categories: ["Coffee", "Non-Coffee", "Frappes", "Fruit Teas"] },
  { section: "Meals",     categories: ["Pasta", "Rice Meals", "Snacks", "Sandwiches"] },
];

export default function NavBar() {
  const navigate = useNavigate();
  const [menuOpen,     setMenuOpen]     = useState(false);
  const [menuVisible,  setMenuVisible]  = useState(false);
  const [closing,      setClosing]      = useState(false);
  const [menuExpanded, setMenuExpanded] = useState(false);

  const openMenu  = () => { setMenuVisible(true); setMenuOpen(true); setClosing(false); };
  const closeMenu = () => {
    setClosing(true);
    setTimeout(() => { setMenuOpen(false); setMenuVisible(false); setClosing(false); }, 280);
  };
  const toggleMenu = () => (menuOpen ? closeMenu() : openMenu());

  const handleNav = (path) => { closeMenu(); navigate(path); };

  return (
    <>
      {/* ── Hamburger ── */}
      <div className="nav_background">
        <button className="nav_hamburger" onClick={toggleMenu} aria-label="Toggle menu">
          ☰
        </button>
      </div>

      {/* ── Backdrop ── */}
      {menuVisible && (
        <div
          className={`dropdown-overlay ${closing ? "dropdown-overlay--closing" : ""}`}
          onClick={closeMenu}
        />
      )}

      {/* ── Dropdown ── */}
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
    </>
  );
}