// src/pages/EventDetailPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import NavigationBar from "../components/NavigationBar";
import Footer from "../components/Footer";

import "../styles/eventDetailPage.css";

function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    async function fetchEvent() {
      try {
        const res = await fetch(`http://localhost:5001/api/events/${id}`);
        const json = await res.json();
        setEvent(json.data || json);
      } catch (err) {
        console.error("Load error:", err);
      }
      setLoading(false);
    }

    fetchEvent();
  }, [id]);

  // Check if user is registered for this event
  useEffect(() => {
    async function checkRegistration() {
      if (!user || !id) return;

      console.log("Checking registration for user:", user.id, "event:", id);

      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `http://localhost:5001/api/events/check-registration?userId=${user.id}&eventId=${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const json = await res.json();
        console.log("Registration check response:", json);
        if (json.success) {
          setIsRegistered(json.isRegistered);
        }
      } catch (err) {
        console.error("Error checking registration:", err);
      }
    }

    checkRegistration();
  }, [user, id]);

  async function handleVolunteer() {
    if (!user) return navigate("/login");

    setActionLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const token = localStorage.getItem("token");
      const endpoint = isRegistered
        ? "http://localhost:5001/api/events/signup"
        : "http://localhost:5001/api/events/signup";

      const method = isRegistered ? "DELETE" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: user.id,
          eventId: id,
        }),
      });

      const json = await res.json();

      if (json.success) {
        setIsRegistered(!isRegistered);
        setMessage({
          text: isRegistered
            ? "Successfully un-volunteered from this event"
            : "Successfully volunteered for this event!",
          type: "success",
        });
      } else {
        setMessage({ text: json.message || "An error occurred", type: "error" });
      }
    } catch (err) {
      console.error("Error:", err);
      setMessage({ text: "Failed to process request", type: "error" });
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) return <p className="loading">Loading...</p>;
  if (!event) return <p className="not-found">Event not found.</p>;

  const rotatingImages = [
    "/img/clean1.jpg",
    "/img/clean2.jpg",
    "/img/clean3.jpg",
    "/img/clean4.jpg",
    "/img/clean5.jpg",
    "/img/clean6.jpg",
  ];
  const index = Math.abs(event._id?.charCodeAt(0) % rotatingImages.length);
  const finalImage = event.imageUrl || rotatingImages[index];

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <NavigationBar />

        <main className="event-detail-wrapper" style={{ flex: 1 }}>

          {/* HERO BANNER */}
          <div className="hero-banner">
            <img src={finalImage} alt={event.eventName} className="hero-img" />

            <div className="hero-overlay"></div>

            <div className="hero-content">
              <h1 className="hero-title">{event.eventName}</h1>

              <p className="hero-sub">
                Organized by <span>{event.organizer}</span>
              </p>

              <p className="hero-date">
                📅 {new Date(event.date).toLocaleDateString()} — ⏰ {event.time}
              </p>
            </div>
          </div>

          {/* CONTENT */}
          <section className="content-section">

            <div className="info-card glass-card">
              <h2>About This Event</h2>
              <p>{event.details}</p>
            </div>

            <div className="info-card glass-card">
              <h2>Announcements</h2>
              <p>{event.announcements || "No announcements available."}</p>
            </div>

            <div className="info-card glass-card">
              <h2>Commitments</h2>
              <p>{event.commitments || "No commitments listed."}</p>
            </div>

            {/* Message Display */}
            {message.text && (
              <div
                style={{
                  padding: "12px",
                  marginBottom: "20px",
                  borderRadius: "8px",
                  textAlign: "center",
                  backgroundColor: message.type === "success" ? "#d4edda" : "#f8d7da",
                  color: message.type === "success" ? "#155724" : "#721c24",
                  border: `1px solid ${message.type === "success" ? "#c3e6cb" : "#f5c6cb"}`,
                }}
              >
                {message.text}
              </div>
            )}

            <div className="volunteer-btn-container">
              <button
                className="volunteer-btn"
                onClick={handleVolunteer}
                disabled={actionLoading}
                style={{
                  backgroundColor: isRegistered ? "#888" : "#4c63ff",
                  cursor: actionLoading ? "not-allowed" : "pointer",
                  opacity: actionLoading ? 0.6 : 1,
                }}
              >
                {actionLoading
                  ? "Processing..."
                  : isRegistered
                    ? "Un-Volunteer?"
                    : "Volunteer Today!"}
              </button>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}

export default EventDetailPage;
