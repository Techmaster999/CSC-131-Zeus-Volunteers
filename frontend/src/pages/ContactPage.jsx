// src/pages/ContactPage.jsx
import React, { useState } from "react";
import NavigationBar from "../components/NavigationBar";
import Footer from "../components/Footer";
import API_URL from "../config";

import "../styles/contactPage.css";

function ContactPage() {
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setSuccess(false);
    setError("");

    if (!message.trim()) {
      setError("Please enter a message before submitting.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message })
      });

      if (!response.ok) {
        throw new Error("Failed to send feedback");
      }

      setMessage("");
      setSuccess(true);
    } catch (err) {
      setError("Something went wrong. Please try again later.");
    }
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          backgroundColor: "#e8e8e8"
        }}
      >
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
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your message, feedback, or review here..."
                rows="6"
              />

              <button type="button" onClick={handleSubmit}>
                Submit
              </button>

              {success && (
                <p style={{ color: "green", textAlign: "center" }}>
                  Thank you for your feedback. We appreciate it.
                </p>
              )}

              {error && (
                <p style={{ color: "red", textAlign: "center" }}>
                  {error}
                </p>
              )}
            </div>

          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}

export default ContactPage;
