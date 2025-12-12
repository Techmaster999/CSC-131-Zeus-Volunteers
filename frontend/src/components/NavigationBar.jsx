import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/navigation.css";

function NavigationBar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const role = user?.role;
  const isLoggedIn = !!user;

  return (
    <header className="nav-container">
      {/* LEFT LOGO */}
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

      {/* NAV LINKS */}
      <nav className={`nav-links ${menuOpen ? "show" : ""}`}>
        {/* Public links ALWAYS visible */}
        <Link to="/">Home</Link>
        <Link to="/events">Events</Link>
        <Link to="/calendar">Calendar</Link>
        <Link to="/contact">Contact</Link>

        {/* VOLUNTEER */}
        {role === "volunteer" && (
          <Link to="/volunteer">My Dashboard</Link>
        )}

        {/* ORGANIZER */}
        {role === "organizer" && (
          <>
            <Link to="/organizer">Organizer Dashboard</Link>
            <Link to="/events/create">Create Event</Link>
            <Link to="/organizer/announcements">Announcements</Link>
          </>
        )}

        {/* ADMIN */}
        {role === "admin" && (
          <Link to="/admin">Admin Dashboard</Link>
        )}

        {/* MOBILE AUTH BUTTONS */}
        {!isLoggedIn ? (
          <>
            {/* Added "blue" class here so it matches the others */}
            <Link className="nav-btn blue mobile-only" to="/admin-login">
              Admin
            </Link>

            <Link className="nav-btn blue mobile-only" to="/login">
              Login
            </Link>
            <Link className="nav-btn blue mobile-only" to="/signup">
              Register
            </Link>
          </>
        ) : (
          <button className="nav-btn blue mobile-only" onClick={logout}>
            Logout
          </button>
        )}
      </nav>

      {/* DESKTOP AUTH BUTTONS */}
      <div className="nav-right">
        {!isLoggedIn && (
          <>
            {/* 1. Added "blue" to className 
                2. Removed background color style
                3. Kept margin-right so it doesn't touch the Login button
            */}
            <Link
              to="/admin-login"
              className="nav-btn blue"
            >
              Admin
            </Link>

            <Link to="/login" className="nav-btn blue">
              Login
            </Link>
            <Link to="/signup" className="nav-btn blue">
              Register
            </Link>
          </>
        )}

        {isLoggedIn && (
          <>
            <button className="nav-btn blue" onClick={logout}>
              Logout
            </button>
            <Link
              to={
                role === "organizer"
                  ? "/organizer"
                  : role === "admin"
                    ? "/admin"
                    : "/volunteer"
              }
              className="profile-circle"
            >
              <img src="/img/user.jpg" alt="profile" />
            </Link>
          </>
        )}
      </div>
    </header>
  );
}

export default NavigationBar;