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

  function handleVolunteer() {
    if (!user) return navigate("/login");
    console.log("Volunteer for event:", id);
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

            <div className="volunteer-btn-container">
              <button className="volunteer-btn" onClick={handleVolunteer}>
                Volunteer Today!
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
