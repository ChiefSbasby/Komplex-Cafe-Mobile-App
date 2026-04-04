import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  doc,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase.js";
import "../css/PaymentTypePage.css";
import NavBar from "../components/NavBar";

/* ─── Session-based guest ID ────────────────────────────────────
   Generated once per browser session and reused for all orders
   placed in that session. Cleared automatically when the tab closes.
──────────────────────────────────────────────────────────────── */
const getSessionGuestId = () => {
  const existing = sessionStorage.getItem("guest_id");
  if (existing) return Number(existing);

  /* First order this session — generate a new ID from timestamp + random */
  const newId = Date.now() * 1000 + Math.floor(Math.random() * 1000);
  sessionStorage.setItem("guest_id", String(newId));
  return newId;
};

/* ── Reference number: 100000 + payment_id ── */
const generateReferenceNumber = (paymentId) => 100000 + paymentId;

export default function PaymentType() {
  const navigate = useNavigate();
  const location = useLocation();

  const { cart = [], orderType, receiveAt, instructions = "" } =
    location.state ?? {};

  const [submitting, setSubmitting] = useState(false);
  const [error, setError]           = useState(null);

  const totalAmount = cart.reduce((s, e) => s + e.price * e.qty, 0);

  /* ── Submit order and payment to Firestore ── */
  /* ... rest of your imports and helpers ... */

  const submitOrder = async (paymentType) => {
    if (submitting) return;
    setSubmitting(true);
    setError(null);

    try {
      const guestId = getSessionGuestId(); 

      /* Refs */
      const orderCounterRef   = doc(db, "counters", "order_id");
      const paymentCounterRef = doc(db, "counters", "payment_id");
      const guestRef          = doc(db, "tbl_guests", String(guestId));

      let newOrderId, newPaymentId;

      await runTransaction(db, async (transaction) => {
        /* 1. Read all necessary data first */
        const [orderSnap, paymentSnap, guestSnap] = await Promise.all([
          transaction.get(orderCounterRef),
          transaction.get(paymentCounterRef),
          transaction.get(guestRef),
        ]);

        /* 2. Calculate new IDs */
        newOrderId   = (orderSnap.data()?.current_value   ?? 0) + 1;
        newPaymentId = (paymentSnap.data()?.current_value ?? 0) + 1;

        /* 3. Update counters */
        transaction.update(orderCounterRef,   { current_value: newOrderId   });
        transaction.update(paymentCounterRef, { current_value: newPaymentId });

        /* 4. Write tbl_orders */
        const orderRef = doc(db, "tbl_orders", String(newOrderId));
        transaction.set(orderRef, {
          order_id:     newOrderId,
          guest_id:     guestId,
          user_id:      null,
          items:        cart.map((e) => ({
            name:  e.m_name,
            price: e.price,
            qty:   e.qty,
          })),
          total_amount:  totalAmount,
          order_status:  "PENDING",
          order_type:    orderType    ?? null,
          receive_at:    receiveAt    ?? null,
          instructions:  instructions || null,
          table_id:      null,
          o_timestamp:   serverTimestamp(),
        });

        /* 5. Conditional Write to tbl_guests */
        // Only save if this guest_id doesn't exist in the DB yet
        if (!guestSnap.exists()) {
          transaction.set(guestRef, {
            guest_id:     guestId,
            order_id:     newOrderId,
            date_ordered: serverTimestamp(),
          });
        }

        /* 6. Write tbl_payments */
        const paymentRef = doc(db, "tbl_payments", String(newPaymentId));
        transaction.set(paymentRef, {
          payment_id:       newPaymentId,
          order_id:         newOrderId,
          amount_paid:      totalAmount,
          payment_method:   paymentType === 1 ? "ONLINE" : "CASH",
          reference_number: generateReferenceNumber(newPaymentId),
          transaction_time: serverTimestamp(),
        });
      });

      /* 7. Navigation */
      const targetPath = paymentType === 1 ? "/qrpage" : "/order-confirmed";
      navigate(targetPath, {
        state: { orderId: newOrderId, paymentId: newPaymentId },
      });

    } catch (err) {
      console.error("Failed to submit order:", err);
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <div className="wrapper">
      <NavBar />

      <div className="paymenttype-page">
        <section className="paymenttype-header">
          <div className="paymenttype-hero">
            <h1 className="paymenttype-hero-title">Payment Type</h1>
          </div>
        </section>

        {error && <p className="paymenttype-error">{error}</p>}

        {/* BUTTON VALUES: CASH AT THE COUNTER = 0, ONLINE PAYMENT = 1 */}
        <section className="paymenttype-choice">
          <div className="paymenttype-buttonlayout">
            <button
              id="cash"
              value={0}
              disabled={submitting}
              onClick={() => submitOrder(0)}
            >
              <img src="src/assets/cashcounter.png" alt="Cash at the Counter" />
              <p className="btn-text">
                {submitting ? "Placing order…" : "Cash at the Counter"}
              </p>
            </button>

            <button
              id="online"
              value={1}
              disabled={submitting}
              onClick={() => submitOrder(1)}
            >
              <img src="src/assets/onlinepayment.png" alt="Online Payment" />
              <p className="btn-text">
                {submitting ? "Placing order…" : "Online Payment"}
              </p>  
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}