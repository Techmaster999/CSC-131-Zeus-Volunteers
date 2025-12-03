import React from "react";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-logo">
        <img
          src="/img/zeus-volunteer-logo-1copy.png"
          alt="Zeus Volunteers Logo"
          className="footer-logo-img"
        />
        <span className="footer-text">Zeus Volunteers</span>
      </div>

      <div className="footer-year">
        <span>©</span>
        <span>2025</span>
      </div>
    </footer>
  );
}

export default Footer;
