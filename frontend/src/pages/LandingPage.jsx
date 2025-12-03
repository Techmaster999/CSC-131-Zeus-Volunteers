import React from "react";
import { Link } from "react-router-dom";

import "../styles/landingpage-global.css";
import "../styles/landingpage-style.css";
import "../styles/landingpage-styleguide.css";

function LandingPage() {
  return (
    <div className="landing-page">

      {/* HEADER */}
      <header className="navigation-bar">
        <div className="logo">
          <div className="div">
            <img
              className="zeus-volunteer-logo"
              src="/img/logo.png"
              alt="Zeus Volunteers Logo"
            />
            <span className="text-wrapper">Zeus Volunteers</span>
          </div>
        </div>

        <div className="menu-and-login">
          <nav className="navbar">
            <Link to="/" className="text-wrapper-2">Home</Link>
            <Link to="/events" className="text-wrapper-3">Events</Link>
            <Link to="/calendar" className="text-wrapper-3">Calendar</Link>
            <a href="#contact" className="text-wrapper-3">Contact</a>
          </nav>

          <button className="button">
            <span className="button-2">Login</span>
          </button>

          <button className="button">
            <span className="button-2">Admin Login</span>
          </button>

          <Link to="/signup" className="button">
            <span className="button-2">Register</span>
          </Link>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="landing-page-content">
        {/* LEFT TEXT */}
        <section className="landing-page-info">
          <div className="landing-page-text">
            <div className="header-container">
              <h1 className="header">Volunteering Made Easy</h1>
            </div>

            <p className="lorem-ipsum-dolor">
              ZeusVolunteers connects community organizers with volunteers who want
              to make a difference. Create events, sign up, and track your impact.
            </p>
          </div>

          <Link to="/events" className="launch-button">
            <span className="text-wrapper-4">Search for Events Now</span>
            <img
              className="arrow-up-right"
              src="/img/arrow-up-right.svg"
              alt="arrow"
            />
          </Link>
        </section>

        {/* RIGHT-SIDE IMAGE */}
        <div
          className="landing-page-image"
          style={{
            backgroundImage: "url('/img/landing-page-1.png')",
          }}
        ></div>
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <div className="logo">
          <div className="div">
            <img
              className="footer-logo"
              src="/img/logo.png"
              alt="Zeus Volunteers Logo"
            />
            <span className="text-wrapper">Zeus Volunteers</span>
          </div>
        </div>

        <div className="copyright-frame">
          <span className="text-wrapper-5">©</span>
          <span className="text-wrapper-6">2025</span>
        </div>
      </footer>

    </div>
  );
}

export default LandingPage;
