import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Header.css";


function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="header">
      {/* LOGO + TITLE */}
      <div className="header-left">
        <img src="/img/logo.png" />
        <span className="header-title">Zeus Volunteers</span>
      </div>

      {/* HAMBURGER BUTTON (mobile) */}
      <div
        className={`hamburger ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* NAVIGATION MENU */}
      <nav className={`header-nav ${menuOpen ? "show-menu" : ""}`}>
        <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
        <Link to="/events" onClick={() => setMenuOpen(false)}>Events</Link>
        <Link to="/calendar" onClick={() => setMenuOpen(false)}>Calendar</Link>
        <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>

        {/* Mobile-only logout + profile inside menu */}
        <div className="mobile-controls">
          <button className="logout-btn">Logout</button>
          <div className="profile-circle"></div>
        </div>
      </nav>

      {/* DESKTOP RIGHT SIDE CONTROLS */}
      <div className="header-right">
        <button className="logout-btn">Logout</button>
        <div className="profile-circle"></div>
      </div>
    </header>
  );
}

export default Header;
