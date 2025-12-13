// src/pages/organizer/EventCreationPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavigationBar from "../../components/NavigationBar";
import Footer from "../../components/Footer";
import { useAuth } from "../../context/AuthContext";

import "../../styles/eventCreationPage.css";

function EventCreationPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const [eventData, setEventData] = useState({
    eventName: "",
    date: "",
    time: "",
    location: "",
    category: "community service",
    details: "",
    announcements: "",
    commitments: "",
    maxVolunteers: 20,
    duration: 2,
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setEventData({ ...eventData, [name]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const token = localStorage.getItem("token");

      const payload = {
        eventName: eventData.eventName,
        title: eventData.eventName,
        organizer: user?.firstName + " " + user?.lastName || "Unknown Organizer",
        organizerId: user?.id,
        date: eventData.date,
        time: eventData.time,
        location: eventData.location,
        category: eventData.category,
        details: eventData.details,
        announcements: eventData.announcements,
        commitments: eventData.commitments,
        maxVolunteers: parseInt(eventData.maxVolunteers) || 20,
        duration: parseInt(eventData.duration) || 2,
      };

      const res = await fetch("http://localhost:5001/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (json.success) {
        setMessage({ text: "Event created successfully! Awaiting admin approval.", type: "success" });
        // Reset form
        setEventData({
          eventName: "",
          date: "",
          time: "",
          location: "",
          category: "Community Service",
          details: "",
          announcements: "",
          commitments: "",
          maxVolunteers: 20,
          duration: 2,
        });
        // Redirect after 2 seconds
        setTimeout(() => navigate("/organizer"), 2000);
      } else {
        setMessage({ text: json.message || "Failed to create event", type: "error" });
      }
    } catch (err) {
      console.error("Error creating event:", err);
      setMessage({ text: "Failed to create event. Please try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "#e8e8e8" }}>
        <NavigationBar />

        <main className="event-create-container" style={{ flex: 1 }}>
          <div className="event-create-header">
            <h1>Create New Event</h1>
            <p>Fill out the details below to create a new volunteer event</p>
          </div>

          {message.text && (
            <div
              className={`event-message ${message.type}`}
              style={{
                padding: "15px",
                borderRadius: "10px",
                marginBottom: "20px",
                backgroundColor: message.type === "success" ? "#d4edda" : "#f8d7da",
                color: message.type === "success" ? "#155724" : "#721c24",
                border: `1px solid ${message.type === "success" ? "#c3e6cb" : "#f5c6cb"}`,
              }}
            >
              {message.text}
            </div>
          )}

          <form className="event-create-form" onSubmit={handleSubmit}>

            {/* Row 1: Basic Info */}
            <div className="form-row">
              <div className="form-group">
                <label>Event Title *</label>
                <input
                  type="text"
                  name="eventName"
                  value={eventData.eventName}
                  onChange={handleChange}
                  placeholder="e.g., Beach Cleanup Day"
                  required
                />
              </div>

              <div className="form-group">
                <label>Category *</label>
                <select name="category" value={eventData.category} onChange={handleChange} required>
                  <option value="community service">Community Service</option>
                  <option value="environmental">Environmental</option>
                  <option value="education">Education</option>
                  <option value="health">Health</option>
                  <option value="cultural">Cultural</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* Row 2: Date & Time */}
            <div className="form-row">
              <div className="form-group">
                <label>Date *</label>
                <input
                  type="date"
                  name="date"
                  value={eventData.date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Time *</label>
                <input
                  type="time"
                  name="time"
                  value={eventData.time}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Duration (hours)</label>
                <input
                  type="number"
                  name="duration"
                  value={eventData.duration}
                  onChange={handleChange}
                  min="1"
                  max="12"
                />
              </div>
            </div>

            {/* Row 3: Location */}
            <div className="form-group full-width">
              <label>Location *</label>
              <input
                type="text"
                name="location"
                value={eventData.location}
                onChange={handleChange}
                placeholder="e.g., 123 Main Street, Sacramento, CA"
                required
              />
            </div>

            {/* Row 4: Max Volunteers */}
            <div className="form-group" style={{ maxWidth: "200px" }}>
              <label>Max Volunteers</label>
              <input
                type="number"
                name="maxVolunteers"
                value={eventData.maxVolunteers}
                onChange={handleChange}
                min="1"
                max="500"
              />
            </div>

            {/* Event Details */}
            <div className="form-group full-width">
              <label>Event Description *</label>
              <textarea
                name="details"
                value={eventData.details}
                onChange={handleChange}
                placeholder="Describe what volunteers will be doing, event goals, and any important information..."
                required
              ></textarea>
            </div>

            {/* Announcements */}
            <div className="form-group full-width">
              <label>Announcements</label>
              <textarea
                name="announcements"
                value={eventData.announcements}
                onChange={handleChange}
                placeholder="Any special announcements or updates for volunteers..."
              ></textarea>
            </div>

            {/* Commitments */}
            <div className="form-group full-width">
              <label>What to Bring / Requirements</label>
              <textarea
                name="commitments"
                value={eventData.commitments}
                onChange={handleChange}
                placeholder="e.g., Comfortable shoes, water bottle, sunscreen..."
              ></textarea>
            </div>

            {/* Submit Button */}
            <div className="form-actions">
              <button
                type="button"
                className="btn-cancel"
                onClick={() => navigate("/organizer")}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-create"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Event"}
              </button>
            </div>
          </form>
        </main>

        <Footer />
      </div>
    </>
  );
}

export default EventCreationPage;
