import React from "react";
import { formatMoney, calcOrderTotal } from "../../services/adminOrderData";

export default function OrderDetails({
  order,
  status,
  statusOptions,
  onStatusChange,
}) {
  const total = calcOrderTotal(order.items);

  return (
    <div className="ao-cardBody">
      {/* Left */}
      <div className="ao-left">
        <div className="ao-sectionTitle">Order Information:</div>

        <div className="ao-items">
          {order.items.map((it, idx) => (
            <div className="ao-itemRow" key={idx}>
              <div className="ao-itemQty">{it.qty}x</div>
              <div className="ao-itemName">{it.name}</div>
              <div className="ao-itemPrice">
                {formatMoney(it.qty * it.price)}
              </div>
            </div>
          ))}
        </div>

        <div className="ao-divider" />

        <div className="ao-totalRow">
          <div className="ao-totalPrice">{formatMoney(total)}</div>
        </div>
      </div>

      <div className="ao-midDivider" />

      {/* Right */}
      <div className="ao-right">
        <div className="ao-sectionTitle">Edit Order Status:</div>

        <div className="ao-selectWrap">
          <select
            className="ao-select"
            value={status}
            onChange={(e) => onStatusChange(order.id, e.target.value)}
          >
            {statusOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="ao-meta">
          <div className="ao-metaRow">
            <b>Order Type:</b> {order.type}
          </div>
          <div className="ao-metaRow">
            <b>Receive at:</b> {order.receiveAt}
          </div>
          <div className="ao-metaRow">
            <b>Special Instructions:</b>
            <div className="ao-instructions">
              {order.instructions && order.instructions.trim()
                ? order.instructions
                : "N/A"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}