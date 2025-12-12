// src/pages/ContactPage.jsx
import React from "react";
import NavigationBar from "../components/NavigationBar";
import Footer from "../components/Footer";

import "../styles/contactPage.css";

function ContactPage() {
  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <NavigationBar />

        <main className="contact-page-content" style={{ flex: 1 }}>
          <div className="text-container">

            {/* Header */}
            <div className="contact-header">
              <h1>We are here for you</h1>
              <p>
                Whether you have a question, need help, or just want to share
                feedback, we would love to hear from you.
              </p>
            </div>

            {/* Contact Info */}
            <div className="contact-info">
              <div className="info-card">
                <strong>Phone</strong>
                <span>707 999 9999</span>
              </div>

              <div className="info-card">
                <strong>Email</strong>
                <span>ZeusSupport@ZeusVolunteers.com</span>
              </div>
            </div>

            {/* Help Text */}
            <p className="contact-help-text">
              When contacting support, please include helpful details such as
              when the issue occurred, what you were trying to do, and
              screenshots if available.
            </p>

            {/* Illustration */}
            <div className="contact-visual">
              <img
                src="/img/communitySupport.png"
                alt="Community support illustration"
              />
            </div>

            {/* Prompt */}
            <p className="contact-prompt">
              Tell us what is on your mind. We read every message and truly
              appreciate your feedback.
            </p>

            {/* Form */}
            <div className="contact-form">
              <textarea
                placeholder="Write your message, feedback, or review here..."
                rows="6"
              />
              <button type="button">Submit</button>
            </div>

          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}

export default ContactPage;
