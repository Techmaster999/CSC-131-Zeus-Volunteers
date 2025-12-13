// src/pages/organizer/EventCreationPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavigationBar from "../../components/NavigationBar";
import Footer from "../../components/Footer";
import LocationAutocomplete from "../../components/LocationAutocomplete";
import API_URL from "../../config";
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
    coordinates: null,
    category: "community service",
    details: "",
    announcements: "",
    commitments: "",
    maxVolunteers: 20,
    duration: 2,
    skills: [],
  });

  const AVAILABLE_SKILLS = [
    'Leadership',
    'Teaching',
    'Physical Labor',
    'Technical',
    'Creative',
    'Administrative'
  ];

  const [selectedFile, setSelectedFile] = useState(null);

  // Handle location selection from autocomplete
  function handleLocationChange(locationData) {
    setEventData({
      ...eventData,
      location: locationData.location,
      coordinates: locationData.coordinates
    });
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setEventData({ ...eventData, [name]: value });
  }

  function handleFileChange(e) {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  }

  function handleSkillChange(skill) {
    setEventData(prev => {
      const skills = prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill];
      return { ...prev, skills };
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const token = localStorage.getItem("token");

      // Use FormData for file upload
      const formData = new FormData();
      formData.append("eventName", eventData.eventName);
      formData.append("title", eventData.eventName);
      formData.append("organizer", user?.username || "Unknown Organizer");
      formData.append("organizerId", user?.id);
      formData.append("date", eventData.date);
      formData.append("time", eventData.time);
      formData.append("location", eventData.location);
      // Include coordinates if available
      if (eventData.coordinates) {
        formData.append("coordinates", JSON.stringify(eventData.coordinates));
      }
      formData.append("category", eventData.category);
      formData.append("details", eventData.details);
      formData.append("description", eventData.details);
      formData.append("announcements", eventData.announcements);
      formData.append("commitments", eventData.commitments);
      formData.append("maxVolunteers", parseInt(eventData.maxVolunteers) || 20);
      formData.append("duration", parseInt(eventData.duration) || 2);

      // Append skills individually for array handling
      eventData.skills.forEach(skill => {
        formData.append("skills", skill);
      });

      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      const res = await fetch(`${API_URL}/api/events`, {
        method: "POST",
        headers: {
          // Content-Type is set automatically by browser with boundary for FormData
          Authorization: `Bearer ${token}`,
        },
        body: formData,
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
          category: "community service",
          details: "",
          announcements: "",
          commitments: "",
          maxVolunteers: 20,
          duration: 2,
          skills: [],
        });
        setSelectedFile(null);
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

            {/* Row 3: Location with Autocomplete */}
            <div className="form-group full-width">
              <label>Location *</label>
              <LocationAutocomplete
                value={eventData.location}
                onChange={handleLocationChange}
                placeholder="Start typing an address..."
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

            {/* Event Photo */}
            <div className="form-group full-width">
              <label>Event Photo (Optional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ padding: "10px", border: "1px solid #ddd", borderRadius: "5px", width: "100%", backgroundColor: "white" }}
              />
              <p style={{ fontSize: "12px", color: "#666", marginTop: "5px" }}>
                If no photo is selected, a default image relevant to the category will be used.
              </p>
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
              <label>Required Skills</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "5px" }}>
                {AVAILABLE_SKILLS.map(skill => (
                  <label key={skill} style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "8px 12px",
                    backgroundColor: eventData.skills.includes(skill) ? "#e6f0ff" : "#f5f5f5",
                    border: eventData.skills.includes(skill) ? "1px solid #4c63ff" : "1px solid #ddd",
                    borderRadius: "20px",
                    cursor: "pointer",
                    fontSize: "14px"
                  }}>
                    <input
                      type="checkbox"
                      checked={eventData.skills.includes(skill)}
                      onChange={() => handleSkillChange(skill)}
                      style={{ accentColor: "#4c63ff" }}
                    />
                    {skill}
                  </label>
                ))}
              </div>
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
