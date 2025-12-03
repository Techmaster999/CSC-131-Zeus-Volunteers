import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Header.css";

function HeaderVisitor() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="navigation-bar">

      {/* LEFT: LOGO + TITLE */}
      <div className="header-left">
        <img
          src="/img/logo.png"
          alt="Zeus Volunteers Logo"
          className="header-logo"
        />
        <span className="header-title">Zeus Volunteers</span>
      </div>

      {/* MOBILE HAMBURGER */}
      <div
        className={`hamburger ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* NAVIGATION LINKS */}
      <nav className={`header-nav ${menuOpen ? "show-menu" : ""}`}>
        <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
        <Link to="/events" onClick={() => setMenuOpen(false)}>Events</Link>
        <Link to="/calendar" onClick={() => setMenuOpen(false)}>Calendar</Link>
        <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>

        {/* MOBILE BUTTONS */}
        <div className="mobile-auth">
          <Link to="/login" className="mobile-btn">Login</Link>
          <Link to="/admin" className="mobile-btn">Admin Login</Link>
          <Link to="/signup" className="mobile-btn">Register</Link>
        </div>
      </nav>

      {/* RIGHT BUTTONS (DESKTOP) */}
      <div className="header-right">
        <Link to="/login" className="header-btn">Login</Link>
        <Link to="/admin" className="header-btn">Admin Login</Link>
        <Link to="/signup" className="header-btn">Register</Link>
      </div>

    </header>
  );
}

export default Header;
