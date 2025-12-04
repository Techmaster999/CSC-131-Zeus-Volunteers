import React from "react";
import { Link } from "react-router-dom";
import NavigationBar from "../components/NavigationBar";
import "../styles/landingpage-style.css";

function LandingPage() {
  return (
    <div className="landing-page">

      {/* REACT NAVIGATION BAR */}
      <NavigationBar />

      {/* MAIN CONTENT */}
      <div className="landing-page-content">
        
        {/* LEFT SIDE TEXT */}
        <div className="landing-page-info">
          <div className="header-container">
            <h1>Connecting Volunteers with Local Opportunities</h1>
          </div>

          <p className="lorem-ipsum-dolor">
            Join hundreds of volunteers making a difference in the community.
            Browse events, sign up, and stay updated — all in one place.
          </p>

          <Link to="/events" className="launch-button">
            Explore Opportunities
            <img
              src="/img/arrow-up-right.svg"
              alt="arrow"
              className="arrow-up-right"
            />
          </Link>
        </div>

        {/* RIGHT SIDE IMAGE */}
        <div
          className="landing-page-image"
          style={{
            backgroundImage: `url('/img/landing-page-1.png')`,
          }}
        ></div>
      </div>

      {/* FOOTER */}
      <footer className="footer">
        <p className="text-wrapper-5">© 2025 Zeus Volunteers</p>
        <p className="text-wrapper-6">All Rights Reserved</p>
      </footer>

    </div>
  );
}

export default LandingPage;
