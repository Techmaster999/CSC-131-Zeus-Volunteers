import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NavigationBar from "../components/NavigationBar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";

import "../styles/homepage-global.css";
import "../styles/homepage-style.css";
import "../styles/homepage-styleguide.css";

function HomePage() {
  const { user } = useAuth();
  const [myEvents, setMyEvents] = useState([]);
  const [completedEvents, setCompletedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user's registered events
  useEffect(() => {
    async function fetchMyEvents() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5001/api/events/my/registered", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const json = await res.json();

        if (json.success && json.data) {
          // Sort by date (upcoming first)
          const sorted = json.data.sort((a, b) => new Date(a.date) - new Date(b.date));
          setMyEvents(sorted);
        }
      } catch (err) {
        console.error("Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      fetchMyEvents();
    }
  }, [user]);

  // Fetch user's completed events
  useEffect(() => {
    async function fetchCompletedEvents() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5001/api/events/my/completed", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const json = await res.json();

        if (json.success && json.data) {
          setCompletedEvents(json.data);
        }
      } catch (err) {
        console.error("Error fetching completed events:", err);
      }
    }

    if (user) {
      fetchCompletedEvents();
    }
  }, [user]);

  const blueButtonStyle = {
    backgroundColor: "#586bff",
    borderColor: "#586bff",
    color: "white"
  };

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "#e8e8e8" }}>
        <NavigationBar />

        <main style={{ flex: "1 0 auto", padding: "40px 20px", backgroundColor: "#e8e8e8" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

            {/* HEADER */}
            <div style={{ marginBottom: "30px" }}>
              <h1 style={{ fontSize: "32px", marginBottom: "10px" }}>Volunteer Dashboard</h1>
              <p style={{ color: "#666" }}>Welcome, {user?.firstName} {user?.lastName}</p>
            </div>

            {/* PROFILE & QUICK ACTIONS */}
            <div style={{ display: "flex", gap: "30px", flexWrap: "wrap", marginBottom: "40px" }}>

              {/* Profile Card */}
              <div style={{
                backgroundColor: "white",
                padding: "25px",
                borderRadius: "12px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                flex: "1",
                minWidth: "280px"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "20px" }}>
                  <div style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    backgroundColor: "#586bff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "24px",
                    color: "white"
                  }}>
                    {user?.firstName?.charAt(0) || "V"}
                  </div>
                  <div>
                    <h3 style={{ margin: 0 }}>{user?.firstName} {user?.lastName}</h3>
                    <p style={{ margin: "5px 0 0 0", color: "#666" }}>{user?.email}</p>
                  </div>
                </div>
                <p style={{ color: "#666", marginBottom: "5px" }}><strong>Role:</strong> Volunteer</p>
                <p style={{ color: "#666", marginBottom: "5px" }}><strong>Location:</strong> {user?.city}, {user?.state}</p>
                <p style={{ color: "#666", marginBottom: "5px" }}><strong>Upcoming Events:</strong> {myEvents.length}</p>
                <p style={{ color: "#666" }}><strong>Completed Events:</strong> {completedEvents.length}</p>
              </div>

              {/* Quick Actions */}
              <div style={{
                backgroundColor: "white",
                padding: "25px",
                borderRadius: "12px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                flex: "1",
                minWidth: "280px"
              }}>
                <h3 style={{ marginTop: 0, marginBottom: "20px" }}>Quick Actions</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <Link
                    to="/events"
                    style={{
                      ...blueButtonStyle,
                      padding: "12px 20px",
                      borderRadius: "8px",
                      textDecoration: "none",
                      textAlign: "center",
                      fontWeight: "bold"
                    }}
                  >
                    🔍 Find Events to Volunteer
                  </Link>
                  <Link
                    to="/calendar"
                    style={{
                      padding: "12px 20px",
                      borderRadius: "8px",
                      textDecoration: "none",
                      textAlign: "center",
                      fontWeight: "bold",
                      backgroundColor: "white",
                      color: "#586bff",
                      border: "2px solid #586bff"
                    }}
                  >
                    📅 View Calendar
                  </Link>
                </div>
              </div>
            </div>

            {/* RECENT ANNOUNCEMENTS SECTION */}
            <div style={{
              backgroundColor: "white",
              padding: "30px",
              borderRadius: "12px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
              marginBottom: "30px"
            }}>
              <h2 style={{ marginTop: 0, marginBottom: "25px" }}>📢 Recent Announcements</h2>

              {(() => {
                // Flatten and gather all announcements from valid events
                const allAnnouncements = [];

                myEvents.forEach(e => {
                  if (e.status !== 'completed' && e.status !== 'cancelled') {
                    // Check for multiple announcements (array)
                    if (Array.isArray(e.announcements) && e.announcements.length > 0) {
                      e.announcements.forEach(ann => {
                        allAnnouncements.push({
                          _id: e._id + (ann.sentAt || Math.random()), // unique key fallback
                          eventId: e._id,
                          eventName: e.eventName,
                          message: typeof ann === 'object' ? ann.message : ann,
                          date: ann.sentAt || e.createdAt, // Fallback date
                          eventDate: e.date
                        });
                      });
                    }
                    // Check for legacy single announcement (string)
                    else if (typeof e.announcements === 'string' && e.announcements.trim()) {
                      allAnnouncements.push({
                        _id: e._id + "legacy",
                        eventId: e._id,
                        eventName: e.eventName,
                        message: e.announcements,
                        date: e.updatedAt || e.createdAt, // Estimation for legacy
                        eventDate: e.date
                      });
                    }
                  }
                });

                // Sort by announcement date (newest first)
                allAnnouncements.sort((a, b) => new Date(b.date) - new Date(a.date));

                // Limit to 3 most recent
                const displayAnnouncements = allAnnouncements.slice(0, 3);

                if (loading) {
                  return <p style={{ color: "#666" }}>Loading announcements...</p>;
                }

                if (allAnnouncements.length === 0) {
                  return (
                    <div style={{
                      textAlign: "center",
                      padding: "30px",
                      backgroundColor: "#f9f9f9",
                      borderRadius: "8px"
                    }}>
                      <p style={{ color: "#666", fontSize: "16px" }}>
                        No announcements from your registered events.
                      </p>
                    </div>
                  );
                }

                return (
                  <>
                    <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                      {displayAnnouncements.map(ann => (
                        <div
                          key={ann._id}
                          style={{
                            padding: "15px 20px",
                            borderRadius: "10px",
                            border: "1px solid #586bff",
                            backgroundColor: "#f8f9ff",
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                            <h4 style={{ margin: 0, color: "#586bff", fontSize: "15px" }}>
                              {ann.eventName}
                            </h4>
                            <span style={{ color: "#888", fontSize: "12px" }}>
                              {new Date(ann.date).toLocaleDateString()}
                            </span>
                          </div>
                          <p style={{ margin: 0, color: "#333", fontSize: "14px", lineHeight: "1.5" }}>
                            {ann.message}
                          </p>
                          <Link
                            to={`/events/${ann.eventId}`}
                            style={{
                              display: "inline-block",
                              marginTop: "10px",
                              color: "#586bff",
                              fontSize: "13px",
                              textDecoration: "none",
                              fontWeight: "bold"
                            }}
                          >
                            View Event →
                          </Link>
                        </div>
                      ))}
                    </div>

                    {allAnnouncements.length > 3 && (
                      <div style={{ textAlign: "center", marginTop: "20px" }}>
                        <Link
                          to="/announcements"
                          style={{
                            padding: "10px 25px",
                            backgroundColor: "#586bff",
                            color: "white",
                            borderRadius: "8px",
                            textDecoration: "none",
                            fontWeight: "bold",
                            fontSize: "14px"
                          }}
                        >
                          View All Announcements ({allAnnouncements.length})
                        </Link>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>

            {/* MY EVENTS SECTION */}
            <div style={{
              backgroundColor: "white",
              padding: "30px",
              borderRadius: "12px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.08)"
            }}>
              <h2 style={{ marginTop: 0, marginBottom: "25px" }}>📋 My Upcoming Events</h2>

              {loading ? (
                <p style={{ color: "#666" }}>Loading your events...</p>
              ) : myEvents.length === 0 ? (
                <div style={{
                  textAlign: "center",
                  padding: "40px",
                  backgroundColor: "#f9f9f9",
                  borderRadius: "8px"
                }}>
                  <p style={{ color: "#666", fontSize: "16px", marginBottom: "15px" }}>
                    You haven't signed up for any events yet.
                  </p>
                  <Link
                    to="/events"
                    style={{
                      ...blueButtonStyle,
                      padding: "12px 30px",
                      borderRadius: "8px",
                      textDecoration: "none",
                      fontWeight: "bold"
                    }}
                  >
                    Browse Events
                  </Link>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  {myEvents.map(event => (
                    <div
                      key={event._id}
                      style={{
                        padding: "20px",
                        borderRadius: "10px",
                        border: "1px solid #e0e0e0",
                        backgroundColor: "#fefefe"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "15px" }}>

                        {/* Event Info */}
                        <div style={{ flex: 1, minWidth: "250px" }}>
                          <h3 style={{ margin: "0 0 10px 0", fontSize: "18px", color: "#333" }}>
                            {event.eventName}
                          </h3>
                          <p style={{ margin: "5px 0", color: "#666", fontSize: "14px" }}>
                            <strong>📅 Date:</strong> {new Date(event.date).toLocaleDateString()} at {event.time}
                          </p>
                          <p style={{ margin: "5px 0", color: "#666", fontSize: "14px" }}>
                            <strong>📍 Location:</strong> {event.location}
                          </p>
                          <p style={{ margin: "5px 0", color: "#666", fontSize: "14px" }}>
                            <strong>🏢 Organizer:</strong> {event.organizer}
                          </p>
                        </div>

                        {/* View Details Button */}
                        <Link
                          to={`/events/${event._id}`}
                          style={{
                            padding: "10px 20px",
                            backgroundColor: "#586bff",
                            color: "white",
                            borderRadius: "6px",
                            textDecoration: "none",
                            fontWeight: "bold",
                            fontSize: "14px"
                          }}
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* COMPLETED EVENTS SECTION */}
            <div style={{
              backgroundColor: "white",
              padding: "30px",
              borderRadius: "12px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
              marginTop: "30px"
            }}>
              <h2 style={{ marginTop: 0, marginBottom: "25px" }}>✅ Completed Events</h2>

              {completedEvents.length === 0 ? (
                <div style={{
                  textAlign: "center",
                  padding: "30px",
                  backgroundColor: "#f9f9f9",
                  borderRadius: "8px"
                }}>
                  <p style={{ color: "#666", fontSize: "16px" }}>
                    No completed events yet. Attend events to build your volunteer history!
                  </p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                  {completedEvents.map(event => (
                    <div
                      key={event._id}
                      style={{
                        padding: "15px 20px",
                        borderRadius: "10px",
                        border: "1px solid #28a745",
                        backgroundColor: "#f0fff4",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: "10px"
                      }}
                    >
                      <div>
                        <h4 style={{ margin: "0 0 5px 0", fontSize: "16px" }}>
                          ✓ {event.eventName}
                        </h4>
                        <p style={{ margin: 0, color: "#666", fontSize: "13px" }}>
                          {new Date(event.date).toLocaleDateString()} • {event.organizer}
                        </p>
                      </div>
                      <Link
                        to={`/events/${event._id}`}
                        style={{
                          padding: "8px 16px",
                          backgroundColor: "#28a745",
                          color: "white",
                          borderRadius: "6px",
                          textDecoration: "none",
                          fontWeight: "bold",
                          fontSize: "13px"
                        }}
                      >
                        View
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}

export default HomePage;
