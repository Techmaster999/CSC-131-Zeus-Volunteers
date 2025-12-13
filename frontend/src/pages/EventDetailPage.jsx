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

  // Organizer-specific state
  const [volunteers, setVolunteers] = useState([]);
  const [attendanceMap, setAttendanceMap] = useState({});
  const [showVolunteers, setShowVolunteers] = useState(false);

  // Check if current user is the organizer
  const isOrganizer = user && event && (
    event.organizer === `${user.firstName} ${user.lastName}` ||
    event.organizerId === user.id
  );

  // Debug logging
  console.log("EventDetail Debug:", {
    user: user?.firstName + " " + user?.lastName,
    userId: user?.id,
    eventOrganizer: event?.organizer,
    eventOrganizerId: event?.organizerId,
    eventStatus: event?.status,
    isOrganizer,
    shouldShowButton: event && !isOrganizer && event?.status !== 'completed'
  });

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
        if (json.success) {
          setIsRegistered(json.isRegistered);
        }
      } catch (err) {
        console.error("Error checking registration:", err);
      }
    }

    checkRegistration();
  }, [user, id]);

  // Fetch volunteers for organizer view
  useEffect(() => {
    async function fetchVolunteers() {
      if (!isOrganizer || !id) return;

      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:5001/api/events/${id}/volunteers`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        if (json.success) {
          setVolunteers(json.data || []);
          // Initialize attendance map from existing statuses
          const initialMap = {};
          json.data.forEach(v => {
            initialMap[v.userId?._id || v.userId] = v.status === 'attended';
          });
          setAttendanceMap(initialMap);
        }
      } catch (err) {
        console.error("Error fetching volunteers:", err);
      }
    }

    if (isOrganizer) {
      fetchVolunteers();
    }
  }, [isOrganizer, id]);

  async function handleVolunteer() {
    if (!user) return navigate("/login");

    setActionLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const token = localStorage.getItem("token");
      const method = isRegistered ? "DELETE" : "POST";

      const res = await fetch("http://localhost:5001/api/events/signup", {
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

  // Start event
  async function handleStartEvent() {
    setActionLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5001/api/events/${id}/start`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.success) {
        setEvent({ ...event, status: 'ongoing' });
        setMessage({ text: "Event started! You can now take attendance.", type: "success" });
      } else {
        setMessage({ text: json.message, type: "error" });
      }
    } catch (err) {
      setMessage({ text: "Failed to start event", type: "error" });
    } finally {
      setActionLoading(false);
    }
  }

  // End event
  async function handleEndEvent() {
    if (!window.confirm("Are you sure you want to end this event? This will finalize attendance.")) return;

    setActionLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5001/api/events/${id}/end`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.success) {
        setEvent({ ...event, status: 'completed' });
        setMessage({ text: "Event completed! Attendance has been finalized.", type: "success" });
      } else {
        setMessage({ text: json.message, type: "error" });
      }
    } catch (err) {
      setMessage({ text: "Failed to end event", type: "error" });
    } finally {
      setActionLoading(false);
    }
  }

  // Cancel event
  async function handleCancelEvent() {
    if (!window.confirm("Are you sure you want to cancel this event? This cannot be undone.")) return;

    setActionLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5001/api/events/${id}/cancel`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.success) {
        setMessage({ text: "Event cancelled successfully. Redirecting...", type: "success" });
        setTimeout(() => {
          navigate("/organizer");
        }, 1500);
      } else {
        setMessage({ text: json.message, type: "error" });
      }
    } catch (err) {
      setMessage({ text: "Failed to cancel event", type: "error" });
    } finally {
      setActionLoading(false);
    }
  }

  // Post announcement
  const [newAnnouncement, setNewAnnouncement] = useState("");

  async function handlePostAnnouncement() {
    if (!newAnnouncement.trim()) return;

    setActionLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5001/api/events/${id}/announcement`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ message: newAnnouncement })
      });
      const json = await res.json();
      if (json.success) {
        // Update local event state with new announcement list
        setEvent({ ...event, announcements: json.data });
        setNewAnnouncement("");
        setMessage({ text: "Announcement posted successfully!", type: "success" });
      } else {
        setMessage({ text: json.message, type: "error" });
      }
    } catch (err) {
      setMessage({ text: "Failed to post announcement", type: "error" });
    } finally {
      setActionLoading(false);
    }
  }

  // Mark attendance
  async function handleMarkAttendance(volunteerId, attended) {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5001/api/events/${id}/attendance/${volunteerId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ attended }),
      });
      const json = await res.json();
      if (json.success) {
        setAttendanceMap(prev => ({ ...prev, [volunteerId]: attended }));
      }
    } catch (err) {
      console.error("Error marking attendance:", err);
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

  const eventAddress = event.location
  const encodedLocation = encodeURIComponent(eventAddress);
  const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  const staticMapUrl =
    `https://maps.googleapis.com/maps/api/staticmap?` +
    `center=${encodedLocation}` + // Map center is the event location
    `&zoom=12` +
    `&maptype=roadmap` +
    `&size=520x150` +
    `&scale=2` +
    `&markers=color:red|label:|${encodedLocation}` + // Add a red marker labeled 'E' at the same location
    `&key=${GOOGLE_API_KEY}`;

  const isDenied = event.approvalStatus === 'denied';

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: isDenied ? "#ffe6e6" : "#e8e8e8" }}>
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

              {/* Event Status Badge */}
              {event.status && event.status !== 'upcoming' && (
                <span style={{
                  padding: "6px 16px",
                  borderRadius: "20px",
                  fontSize: "14px",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  backgroundColor: event.status === 'ongoing' ? "#FFC300" : event.status === 'completed' ? "#28a745" : "#888",
                  color: event.status === 'ongoing' ? "#000" : "#fff",
                  marginTop: "10px",
                  display: "inline-block"
                }}>
                  {event.status === 'ongoing' ? '🔴 Event In Progress' : event.status === 'completed' ? '✓ Completed' : event.status}
                </span>
              )}

              {/* Denied Badge */}
              {isDenied && (
                <span style={{
                  padding: "6px 16px",
                  borderRadius: "20px",
                  fontSize: "14px",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  backgroundColor: "#dc3545",
                  color: "white",
                  marginTop: "10px",
                  marginLeft: "10px",
                  display: "inline-block"
                }}>
                  ⛔ EVENT DENIED
                </span>
              )}
            </div>
          </div>

          {/* CONTENT */}
          <section className="content-section">

            <div>
              <img src={staticMapUrl}>
              </img>
            </div>

            <div className="info-card glass-card">
              <h2>About This Event</h2>
              <p>{event.details}</p>
            </div>



            {/* Required Skills */}
            {event.skills && event.skills.length > 0 && (
              <div className="info-card glass-card">
                <h2>Required Skills</h2>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                  {event.skills.map((skill, index) => (
                    <span key={index} style={{
                      backgroundColor: "#e6f0ff",
                      color: "#4c63ff",
                      padding: "6px 12px",
                      borderRadius: "20px",
                      fontSize: "14px",
                      fontWeight: "500"
                    }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

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

            {/* ===== ORGANIZER CONTROLS ===== */}
            {isOrganizer && (
              <div style={{
                backgroundColor: "white",
                padding: "25px",
                borderRadius: "12px",
                marginBottom: "25px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                textAlign: "center"
              }}>
                <h2 style={{ marginTop: 0, marginBottom: "20px", color: "#dc3545", fontSize: "22px" }}>Organizer Controls</h2>

                {/* Start/End Buttons */}
                <div style={{ display: "flex", gap: "15px", marginBottom: "20px", flexWrap: "wrap", justifyContent: "center" }}>
                  {/* Hide Start button if denied OR pending (only approved events can start) */}
                  {!isDenied && event.approvalStatus === 'approved' && event.status !== 'ongoing' && event.status !== 'completed' && event.status !== 'cancelled' && (
                    <button
                      onClick={handleStartEvent}
                      disabled={actionLoading}
                      style={{
                        padding: "12px 30px",
                        backgroundColor: "#28a745",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        fontSize: "16px",
                        fontWeight: "bold",
                        cursor: "pointer"
                      }}
                    >
                      Start Event
                    </button>
                  )}

                  {event.status === 'ongoing' && (
                    <button
                      onClick={handleEndEvent}
                      disabled={actionLoading}
                      style={{
                        padding: "12px 30px",
                        backgroundColor: "#dc3545",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        fontSize: "16px",
                        fontWeight: "bold",
                        cursor: "pointer"
                      }}
                    >
                      End Event
                    </button>
                  )}

                  {/* Cancel Button - available for upcoming or ongoing events */}
                  {event.status !== 'completed' && event.status !== 'cancelled' && (
                    <button
                      onClick={handleCancelEvent}
                      disabled={actionLoading}
                      style={{
                        padding: "12px 30px",
                        backgroundColor: "white",
                        color: "#dc3545",
                        border: "2px solid #dc3545",
                        borderRadius: "8px",
                        fontSize: "16px",
                        fontWeight: "bold",
                        cursor: "pointer"
                      }}
                    >
                      Cancel Event
                    </button>
                  )}
                </div>

                {/* View / Manage Volunteers Button */}
                <div style={{ marginBottom: "20px" }}>
                  <button
                    onClick={() => setShowVolunteers(!showVolunteers)}
                    className="secondary-btn"
                    style={{
                      padding: "10px 20px",
                      backgroundColor: "#4c63ff", // Distinct blue
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontWeight: "500"
                    }}
                  >
                    {showVolunteers ? "Hide Volunteers" : `View Volunteers (${volunteers.length})`}
                  </button>
                </div>

                {/* Attendance List */}
                {showVolunteers && (
                  <div style={{ textAlign: "left" }}>
                    <h3 style={{ marginBottom: "15px", fontSize: "18px" }}>
                      Volunteer Attendance ({volunteers.length} registered)
                    </h3>

                    {volunteers.length === 0 ? (
                      <p style={{ color: "#666" }}>No volunteers registered for this event.</p>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        {volunteers.map(v => {
                          const volId = v.userId?._id || v.userId;
                          const volName = v.userId?.firstName
                            ? `${v.userId.firstName} ${v.userId.lastName}`
                            : `Volunteer ${volId}`;
                          const isAttended = attendanceMap[volId] || false;

                          return (
                            <div
                              key={volId}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                padding: "12px 15px",
                                backgroundColor: isAttended ? "#d4edda" : "#f8f9fa",
                                borderRadius: "8px",
                                border: isAttended ? "1px solid #28a745" : "1px solid #ddd"
                              }}
                            >
                              <div>
                                <strong>{volName}</strong>
                                {v.userId?.email && (
                                  <span style={{ color: "#666", marginLeft: "10px", fontSize: "14px" }}>
                                    {v.userId.email}
                                  </span>
                                )}
                              </div>

                              {event.status === 'ongoing' ? (
                                <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                                  <input
                                    type="checkbox"
                                    checked={isAttended}
                                    onChange={(e) => handleMarkAttendance(volId, e.target.checked)}
                                    style={{ width: "20px", height: "20px", cursor: "pointer" }}
                                  />
                                  <span style={{ fontWeight: isAttended ? "bold" : "normal", color: isAttended ? "#28a745" : "#666" }}>
                                    {isAttended ? "Attended ✓" : "Mark Present"}
                                  </span>
                                </label>
                              ) : event.status === 'completed' ? (
                                <span style={{
                                  padding: "4px 12px",
                                  borderRadius: "12px",
                                  fontSize: "12px",
                                  fontWeight: "bold",
                                  backgroundColor: isAttended ? "#28a745" : "#dc3545",
                                  color: "white"
                                }}>
                                  {isAttended ? "Attended" : "No-Show"}
                                </span>
                              ) : (
                                <span style={{
                                  padding: "4px 12px",
                                  borderRadius: "12px",
                                  fontSize: "12px",
                                  fontWeight: "bold",
                                  backgroundColor: "#4c63ff",
                                  color: "white"
                                }}>
                                  Registered
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {event.status === 'completed' && (
                  <p style={{ marginTop: "15px", color: "#28a745", fontWeight: "bold" }}>
                    ✓ This event has been completed. Attendance is finalized.
                  </p>
                )}
              </div>
            )}



            {/* ===== ANNOUNCEMENTS SECTION ===== */}
            {(isOrganizer || (event.announcements && event.announcements.length > 0)) && (
              <div style={{
                backgroundColor: "white",
                padding: "25px",
                borderRadius: "12px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                marginBottom: "25px"
              }}>
                <h2 style={{ marginTop: 0, marginBottom: "20px", color: "#586bff" }}>📢 Announcements</h2>

                {/* Organizer Post Box - Hidden if denied */}
                {isOrganizer && !isDenied && (
                  <div style={{ marginBottom: "25px", padding: "15px", backgroundColor: "#f8f9fa", borderRadius: "10px", border: "1px solid #e9ecef" }}>
                    <h4 style={{ marginTop: 0, marginBottom: "10px" }}>Post New Announcement</h4>
                    <textarea
                      value={newAnnouncement}
                      onChange={(e) => setNewAnnouncement(e.target.value)}
                      placeholder="Write an announcement for your volunteers..."
                      rows="3"
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "6px",
                        border: "1px solid #ced4da",
                        marginBottom: "10px",
                        fontFamily: "inherit",
                        resize: "vertical"
                      }}
                    />
                    <div style={{ textAlign: "right" }}>
                      <button
                        onClick={handlePostAnnouncement}
                        disabled={actionLoading || !newAnnouncement.trim()}
                        style={{
                          padding: "8px 20px",
                          backgroundColor: "#586bff",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          fontWeight: "bold",
                          cursor: (actionLoading || !newAnnouncement.trim()) ? "not-allowed" : "pointer",
                          opacity: (actionLoading || !newAnnouncement.trim()) ? 0.6 : 1
                        }}
                      >
                        {actionLoading ? "Posting..." : "Post Announcement"}
                      </button>
                    </div>
                  </div>
                )}

                {/* Announcements List */}
                {(!event.announcements || event.announcements.length === 0) ? (
                  <p style={{ color: "#666", fontStyle: "italic", textAlign: "center", padding: "20px 0" }}>
                    No announcements yet.
                  </p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                    {[...(Array.isArray(event.announcements) ? event.announcements : [])]
                      .sort((a, b) => new Date(b.sentAt) - new Date(a.sentAt))
                      .map((ann, idx) => {
                        const msg = typeof ann === 'string' ? ann : ann.message;
                        return (
                          <div key={idx} style={{
                            padding: "15px",
                            backgroundColor: "#f0f4ff",
                            borderRadius: "8px",
                            borderLeft: "4px solid #586bff"
                          }}>
                            <div style={{ display: "flex", justifySelf: "space-between", marginBottom: "5px" }}>
                              <span style={{ fontSize: "12px", color: "#888", marginLeft: "auto" }}>
                                {ann.sentAt ? new Date(ann.sentAt).toLocaleString() : new Date().toLocaleString()}
                              </span>
                            </div>
                            <p style={{ margin: 0, lineHeight: "1.5", fontSize: "15px" }}>
                              {/* Safe render to prevent crash if data is corrupted */}
                              {typeof msg === 'object' ? JSON.stringify(msg) : msg}
                            </p>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            )}

            {/* Volunteer Button (for non-organizers when event is not completed) */}
            {event && !isOrganizer && event.status !== 'completed' && (
              <div className="volunteer-btn-container" style={{ marginTop: "20px" }}>
                <button
                  className="volunteer-btn"
                  onClick={handleVolunteer}
                  disabled={actionLoading || event.status === 'ongoing'}
                  style={{
                    padding: "15px 40px",
                    fontSize: "18px",
                    fontWeight: "bold",
                    borderRadius: "8px",
                    border: "none",
                    backgroundColor: isRegistered ? "#888" : event.status === 'ongoing' ? "#ccc" : "#4c63ff",
                    color: "white",
                    cursor: actionLoading || event.status === 'ongoing' ? "not-allowed" : "pointer",
                    opacity: actionLoading ? 0.6 : 1,
                  }}
                >
                  {actionLoading
                    ? "Processing..."
                    : event.status === 'ongoing'
                      ? "Event In Progress"
                      : isRegistered
                        ? "Un-Volunteer?"
                        : "Volunteer Today!"}
                </button>
              </div>
            )}

            {/* Always show button if user is logged in and not organizer - fallback */}
            {event && user && !isOrganizer && event.status === 'completed' && (
              <div style={{ textAlign: "center", padding: "20px", color: "#666" }}>
                <p>This event has been completed.</p>
              </div>
            )}
          </section>
        </main>

        <Footer />
      </div >
    </>
  );
}

export default EventDetailPage;
