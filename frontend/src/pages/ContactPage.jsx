// src/pages/ContactPage.jsx
import React from "react";
import NavigationBar from "../components/NavigationBar";
import Footer from "../components/Footer";

import "../styles/contactPage.css";

function ContactPage() {
  return (
    <>
      <NavigationBar />

      <main className="contact-container">
        <div className="contact-box">
          <h2>Zeus Volunteers</h2>

          <h3>Header</h3>
          <p>
            Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque
            faucibus eget sapien vitae placerat. Pulvinar viverra lacus nec
            bibendum…
          </p>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default ContactPage;
