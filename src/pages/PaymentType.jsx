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
import UploadReceiptPopup from "../components/UploadReceiptPopup";

/* ─── Session-based guest ID ─────────────────────────────────── */
const getSessionGuestId = () => {
  const existing = sessionStorage.getItem("guest_id");
  if (existing) return Number(existing);
  const newId = Date.now() * 1000 + Math.floor(Math.random() * 1000);
  sessionStorage.setItem("guest_id", String(newId));
  return newId;
};

const generateReferenceNumber = (paymentId) => 100000 + paymentId;

export default function PaymentType() {
  const navigate = useNavigate();
  const location = useLocation();

  const { cart = [], orderType, receiveAt, instructions = "" } =
    location.state ?? {};

  const [submitting, setSubmitting]             = useState(false);
  const [error, setError]                       = useState(null);
  const [showReceiptPopup, setShowReceiptPopup] = useState(false);

  const totalAmount = cart.reduce((s, e) => s + e.price * e.qty, 0);

  /* ── Core Firestore write (shared by both payment types) ── */
  const submitOrder = async (paymentType, receiptUrl = "") => {
    const guestId = getSessionGuestId();

    const orderCounterRef   = doc(db, "counters", "order_id");
    const paymentCounterRef = doc(db, "counters", "payment_id");
    const guestRef          = doc(db, "tbl_guests", String(guestId));

    let newOrderId, newPaymentId;

    await runTransaction(db, async (transaction) => {
      const [orderSnap, paymentSnap, guestSnap] = await Promise.all([
        transaction.get(orderCounterRef),
        transaction.get(paymentCounterRef),
        transaction.get(guestRef),
      ]);

      newOrderId   = (orderSnap.data()?.current_value   ?? 0) + 1;
      newPaymentId = (paymentSnap.data()?.current_value ?? 0) + 1;

      transaction.update(orderCounterRef,   { current_value: newOrderId   });
      transaction.update(paymentCounterRef, { current_value: newPaymentId });

      const orderRef = doc(db, "tbl_orders", String(newOrderId));
      transaction.set(orderRef, {
        order_id:      newOrderId,
        guest_id:      guestId,
        user_id:       null,
        items:         cart.map((e) => ({
          name:  e.m_name,
          price: e.price,
          qty:   e.qty,
        })),
        total_amount:  totalAmount,
        order_status:  paymentType === 1 ? "PROCESSING PAYMENT" : "PENDING",
        order_type:    orderType    ?? null,
        receive_at:    receiveAt    ?? null,
        instructions:  instructions || null,
        table_id:      null,
        receipt_image: receiptUrl,
        o_timestamp:   serverTimestamp(),
      });

      if (!guestSnap.exists()) {
        transaction.set(guestRef, {
          guest_id:     guestId,
          order_id:     newOrderId,
          date_ordered: serverTimestamp(),
        });
      }

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

    return { newOrderId, newPaymentId };
  };

  /* ── Cash payment ── */
  const handleCashPayment = async () => {
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const { newOrderId, newPaymentId } = await submitOrder(0);
      navigate("/confirmation", {
        state: { orderId: newOrderId, paymentId: newPaymentId },
      });
    } catch (err) {
      console.error("Failed to submit order:", err);
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  /* ── Called by UploadReceiptPopup once the image is in Storage ── */
  const handleReceiptSubmit = async (receiptUrl) => {
    setSubmitting(true);
    setError(null);
    try {
      const { newOrderId, newPaymentId } = await submitOrder(1, receiptUrl);
      setShowReceiptPopup(false);
      navigate("/confirmation", {
        state: { orderId: newOrderId, paymentId: newPaymentId },
      });
    } catch (err) {
      console.error("Failed to submit order:", err);
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
      throw err; // re-throw so the popup can show its own error state
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

        <section className="paymenttype-choice">
          <div className="paymenttype-buttonlayout">
            <button
              id="cash"
              value={0}
              disabled={submitting}
              onClick={handleCashPayment}
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
              onClick={() => setShowReceiptPopup(true)}
            >
              <img src="src/assets/onlinepayment.png" alt="Online Payment" />
              <p className="btn-text">Online Payment</p>
            </button>
          </div>
        </section>
      </div>

      {showReceiptPopup && (
        <UploadReceiptPopup
          onClose={() => setShowReceiptPopup(false)}
          onSubmit={handleReceiptSubmit}
        />
      )}
    </div>
  );
}