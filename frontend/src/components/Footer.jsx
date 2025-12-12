import React from "react";
import "../styles/Footer.css"; 

function Footer() {
  return (
    <footer className="footer">
      {/* LEFT SIDE: Logo + Title */}
      <div className="footer-left">
        <img src="/img/logo.png" alt="Zeus Volunteers Logo" />
        <span className="footer-title">Zeus Volunteers</span>
      </div>

      {/* RIGHT SIDE: Copyright */}
      <div className="footer-right">
        <span>&copy; 2025 Zeus Volunteers</span>
      </div>
    </footer>
  );
}

export default Footer;