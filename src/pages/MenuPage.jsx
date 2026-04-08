import { useState, useEffect, useRef } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase.js";
import { useNavigate, useSearchParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import ItemPopup from "../components/ItemPopUp";
import "../css/MenuPage.css";

const PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect width='80' height='80' fill='%23d1d5db'/%3E%3C/svg%3E";

const peso = (n) =>
  "₱" + Number(n).toLocaleString("en-PH", { minimumFractionDigits: 2 });

const HIDDEN_CATEGORIES = ["Add-on", "Dip"];

export default function MenuPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [popup, setPopup]   = useState(null);
  const [cart, setCart]     = useState([]);
  const [menu, setMenu]     = useState([]);
  const [addons, setAddons] = useState([]);
  const [dips, setDips]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const sectionRefs = useRef({});
  const headerRef   = useRef();

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const q = query(collection(db, "tbl_menuItems"), orderBy("item_id", "asc"));
        const snapshot = await getDocs(q);
        const all = snapshot.docs.map((doc) => ({ ...doc.data(), docId: doc.id }));

        setAddons(all.filter((i) => i.category === "Add-on"));
        setDips(all.filter((i) => i.category === "Dip"));
        setMenu(all.filter((i) => !HIDDEN_CATEGORIES.includes(i.category)));
      } catch (err) {
        console.error("Failed to fetch menu:", err);
        setError("Could not load the menu. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  // Scroll to category from URL param once menu loads
  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat && sectionRefs.current[cat]) {
      sectionRefs.current[cat].scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [menu]);

  const categories = [...new Set(menu.map((i) => i.category))];
  const groupedItems = categories.map((cat) => ({
    category: cat,
    items: menu.filter((i) => i.category === cat),
  }));

  const cartTotal = cart.reduce((s, e) => s + e.lineTotal, 0);
  const cartCount = cart.reduce((s, e) => s + e.qty, 0);

  const handleAddToCart = (entry) => {
    setCart((prev) => {
      const key = JSON.stringify({
        docId:  entry.item.docId,
        addons: entry.addons.map((a) => a.docId),
        dips:   entry.dips.map((d) => d.docId),
      });
      const existing = prev.findIndex((e) => e._key === key);
      if (existing !== -1) {
        return prev.map((e, i) =>
          i === existing
            ? { ...e, qty: e.qty + entry.qty, lineTotal: e.lineTotal + entry.lineTotal }
            : e
        );
      }
      return [...prev, { ...entry, _key: key }];
    });
    setPopup(null);
  };

  if (loading) return (
    <div className="wrapper"><div className="menu-page"><NavBar /><div className="menu-loading">Loading menu…</div></div></div>
  );
  if (error) return (
    <div className="wrapper"><div className="menu-page"><NavBar /><div className="menu-error">{error}</div></div></div>
  );

  return (
    <div className="wrapper">
      <div className="menu-page">
        <NavBar />

        <section className="menu-header" ref={headerRef}>
          <div className="menu-hero">
            <h1 className="menu-hero-title">Menu</h1>
          </div>
          <div className="menu-chips-wrap">
            <div className="menu-chips">
              <button
                className="chip"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  className="chip"
                  onClick={() =>
                    sectionRefs.current[cat]?.scrollIntoView({ behavior: "smooth", block: "start" })
                  }
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        <div className="menu-list">
          {groupedItems.map(({ category, items }) => (
            <div
              key={category}
              className="menu-section"
              ref={(el) => (sectionRefs.current[category] = el)}
            >
              <h2 className="menu-section-title">{category}</h2>
              {items.map((item) => {
                const totalQty = cart
                  .filter((e) => e.item.docId === item.docId)
                  .reduce((s, e) => s + e.qty, 0);
                return (
                  <button
                    key={item.item_id}
                    className={`menu-item${!item.availability ? " menu-item--unavailable" : ""}`}
                    onClick={() => item.availability && setPopup({ item })}
                    disabled={!item.availability}
                  >
                    <img
                      src={item.image_url || PLACEHOLDER}
                      alt={item.m_name}
                      className="menu-item-img"
                    />
                    <div className="menu-item-info">
                      <span className="menu-item-name">
                        {item.m_name}
                        {totalQty > 0 && (
                          <span className="cart-badge">{totalQty}</span>
                        )}
                      </span>
                      {item.description && (
                        <span className="menu-item-desc">{item.description}</span>
                      )}
                      <span className="menu-item-price">
                        {item.availability ? peso(item.price) : "Unavailable"}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        <div className="menu-footer">
          <button
            className="btn-checkout"
            disabled={cart.length === 0}
            onClick={() => navigate("/checkout/cart", { state: { cart } })}
          >
            Checkout
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
        </div>

        {popup && (
          <ItemPopup
            item={popup.item}
            addons={addons}
            dips={dips}
            onClose={() => setPopup(null)}
            onAddToCart={handleAddToCart}
          />
        )}
      </div>
    </div>
  );
}