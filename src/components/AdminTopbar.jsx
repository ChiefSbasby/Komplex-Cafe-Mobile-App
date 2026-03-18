import React from "react";
import "../css/AdminTopbar.css"; 

export default function AdminTopbar({ roleLabel = "ADMIN", onMenuClick }) {
  return (
    <header className="ad-topbar">
      <button
        className="ad-iconBtn"
        aria-label="Menu"
        onClick={onMenuClick}
        type="button"
      >
        <span className="ad-hamburger" />
      </button>

      <div className="ad-rightGroup">
        <div className="ad-brand">
          <div className="ad-brandTitle">Komplex Cafe</div>
          <div className="ad-brandSub">{roleLabel}</div>
        </div>

        <div className="ad-avatar" aria-label="Profile" />
      </div>
    </header>
  );
}