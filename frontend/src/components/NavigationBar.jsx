import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/navigation.css";

function NavigationBar({ user }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const isLoggedIn = !!user;
  const isAdmin = user?.role === "admin";

  return (
    <header className="nav-container">
      {/* LEFT: LOGO + BRAND */}
      <div className="nav-left">
        <img src="/img/logo.png" alt="Logo" className="nav-logo" />
        <span className="nav-title">Zeus Volunteers</span>
      </div>

      {/* MOBILE BURGER */}
      <div
        className={`hamburger ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* NAVIGATION LINKS */}
      <nav className={`nav-links ${menuOpen ? "show" : ""}`}>
        
        {/* USER NAVIGATION */}
        {!isAdmin && (
          <>
            <Link to="/">Home</Link>
            <Link to="/events">Events</Link>
            <Link to="/calendar">Calendar</Link>
            <Link to="/contact">Contact</Link>
          </>
        )}

        {/* ADMIN NAVIGATION */}
        {isAdmin && (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/events">Manage Events</Link>
            <Link to="/events/create">Create Event</Link>
            <Link to="/announcements">Announcements</Link>
          </>
        )}

        {/* MOBILE AUTH BUTTONS */}
        {!isLoggedIn && (
          <>
            <Link className="nav-btn blue mobile-only" to="/login">Login</Link>
            <Link className="nav-btn blue mobile-only" to="/signup">Register</Link>
          </>
        )}

        {isLoggedIn && (
          <button
            className="nav-btn blue mobile-only"
            onClick={() => console.log("logout logic")}
          >
            Logout
          </button>
        )}
      </nav>

      {/* RIGHT SIDE (DESKTOP BUTTONS) */}
      <div className="nav-right">

        {/* Not logged in */}
        {!isLoggedIn && (
          <>
            <Link to="/login" className="nav-btn blue">Login</Link>
            <Link to="/signup" className="nav-btn blue">Register</Link>
          </>
        )}

        {/* Logged in */}
        {isLoggedIn && (
          <>
            <button
              className="nav-btn blue"
              onClick={() => console.log("logout")}
            >
              Logout
            </button>

            <Link to={isAdmin ? "/admin/profile" : "/profile"} className="profile-circle">
              <img src="/img/user.jpg" alt="profile" />
            </Link>
          </>
        )}
      </div>
    </header>
  );
}

export default NavigationBar;
