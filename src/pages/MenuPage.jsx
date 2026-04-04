import { useState, useEffect } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase.js";
import { useNavigate, useSearchParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import "../css/MenuPage.css";

/* ─── Placeholder image ────────────────────────────────────────── */
const PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect width='80' height='80' fill='%23d1d5db'/%3E%3C/svg%3E";

/* ─── Currency formatter ───────────────────────────────────────── */
const peso = (n) =>
  "₱" + Number(n).toLocaleString("en-PH", { minimumFractionDigits: 2 });

/* ═══════════════════════════════════════════════════════════════════
   MENU PAGE
═══════════════════════════════════════════════════════════════════ */
export default function MenuPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [searchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState(
    () => searchParams.get("category") || null
  );
  const [cart, setCart] = useState(location.state?.cart ?? []);
  const [menu, setMenu]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  /* ── Fetch menu from Firestore on mount ── */
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const q = query(
          collection(db, "tbl_menuItems"),
          orderBy("item_id", "asc")
        );
        const snapshot = await getDocs(q);
        const items = snapshot.docs.map((doc) => ({
          ...doc.data(),
          docId: doc.id,           // keep Firestore doc ID in case it's needed
        }));
        setMenu(items);
      } catch (err) {
        console.error("Failed to fetch menu:", err);
        setError("Could not load the menu. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  /* ── Derived display data ── */
  const categories = [...new Set(menu.map((item) => item.category))];

  const visibleItems = activeCategory
    ? menu.filter((item) => item.category === activeCategory)
    : menu;

  const groupedItems = categories
    .map((cat) => ({
      category: cat,
      items: visibleItems.filter((item) => item.category === cat),
    }))
    .filter((g) => g.items.length > 0);

  const cartTotal = cart.reduce((sum, e) => sum + e.price * e.qty, 0);
  const cartCount = cart.reduce((sum, e) => sum + e.qty, 0);

  /* ── Add to cart — stack same item, otherwise push qty:1 ── */
  const handleAddToCart = (item) => {
    setCart((prev) => {
      const existing = prev.findIndex((e) => e.item_id === item.item_id);
      if (existing !== -1) {
        return prev.map((e, i) =>
          i === existing ? { ...e, qty: e.qty + 1 } : e
        );
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  /* ── Loading / error states ── */
  if (loading) {
    return (
      <div className="wrapper">
        <div className="menu-page">
          <NavBar />
          <div className="menu-loading">Loading menu…</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="wrapper">
        <div className="menu-page">
          <NavBar />
          <div className="menu-error">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="wrapper">
      <div className="menu-page">
        <NavBar />

        <section className="menu-header">
          {/* ── Hero ── */}
          <div className="menu-hero">
            <h1 className="menu-hero-title">Menu</h1>
          </div>

          {/* ── Category chips ── */}
          <div className="menu-chips-wrap">
            <div className="menu-chips">
              <button
                className={`chip ${activeCategory === null ? "chip--active" : ""}`}
                onClick={() => setActiveCategory(null)}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`chip ${activeCategory === cat ? "chip--active" : ""}`}
                  onClick={() =>
                    setActiveCategory((prev) => (prev === cat ? null : cat))
                  }
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ── Menu list ── */}
        <div className="menu-list">
          {groupedItems.map(({ category, items }) => (
            <div key={category} className="menu-section">
              <h2 className="menu-section-title">{category}s</h2>
              <div className="menu-category-label">{category}</div>
              {items.map((item) => {
                const cartEntry = cart.find((e) => e.item_id === item.item_id);
                return (
                  <button
                    key={item.item_id}
                    className={`menu-item${!item.availability ? " menu-item--unavailable" : ""}`}
                    onClick={() => item.availability && handleAddToCart(item)}
                    disabled={!item.availability}
                    aria-disabled={!item.availability}
                  >
                    <img
                      src={item.image_url || PLACEHOLDER}
                      alt={item.m_name}
                      className="menu-item-img"
                    />
                    <div className="menu-item-info">
                      <span className="menu-item-name">
                        {item.m_name}
                        {cartEntry && (
                          <span className="menu-item-qty-badge">×{cartEntry.qty}</span>
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

        {/* ── Sticky footer ── */}
        <div className="menu-footer">
          <span className="menu-footer-total">
            Total: <strong>{peso(cartTotal)}</strong>
          </span>
          <button
            className="btn-checkout"
            disabled={cart.length === 0}
            onClick={() => navigate("/checkout/cart", { state: { cart } })}
          >
            Checkout
            {cartCount > 0 && (
              <span className="cart-badge">{cartCount}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}