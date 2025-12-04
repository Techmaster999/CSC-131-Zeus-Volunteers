// src/pages/EventDetailPage.jsx
import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import NavigationBar from "../components/NavigationBar";
import Footer from "../components/Footer";
import "../styles/eventDetailPage.css";

function EventDetailPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  function handleVolunteer() {
    if (!user) {
      navigate("/login");
      return;
    }

    // Later this will POST to backend to join event
    console.log("User is volunteering!");
  }

  return (
    <>
      <NavigationBar />

      <main className="event-detail-container">
        <div className="event-detail-header">
          <img
            src="/img/event-placeholder.png"
            alt="event"
            className="event-detail-image"
          />
          <h2 className="event-title">Event Title</h2>
        </div>

        <section className="event-details-section">
          <h3>Announcements</h3>
          <p>
            Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque
            pellentesque sapien placerat.
          </p>

          <h3>Volunteering Info</h3>
          <p>
            Add info here…
          </p>

          <h3>Commitments</h3>
          <p>
            Add commitments here…
          </p>
        </section>

        <div className="center-btn">
          <button className="blue-btn" onClick={handleVolunteer}>
            Volunteer Today!
          </button>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default EventDetailPage;
