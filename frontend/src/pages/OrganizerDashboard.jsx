import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NavigationBar from "../components/NavigationBar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";

import "../styles/homepage-global.css";
import "../styles/homepage-style.css";
import "../styles/homepage-styleguide.css";

function OrganizerDashboard() {
  const { user } = useAuth();
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch organizer's events
  useEffect(() => {
    async function fetchMyEvents() {
      try {
        const token = localStorage.getItem("token");

        // Use the organizer-specific endpoint
        const res = await fetch("http://localhost:5001/api/events/my/created", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const json = await res.json();

        console.log("My events response:", json);

        if (json.success && json.data) {
          setMyEvents(json.data);
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

  // Status badge colors
  function getStatusStyle(status) {
    switch (status) {
      case "approved":
        return { backgroundColor: "#d4edda", color: "#155724", border: "1px solid #c3e6cb" };
      case "denied":
        return { backgroundColor: "#f8d7da", color: "#721c24", border: "1px solid #f5c6cb" };
      case "pending":
      default:
        return { backgroundColor: "#fff3cd", color: "#856404", border: "1px solid #ffeeba" };
    }
  }

  const redButtonStyle = {
    backgroundColor: "#dc3545",
    borderColor: "#dc3545",
    color: "white"
  };

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <NavigationBar />

        <main style={{ flex: 1, padding: "40px 20px", backgroundColor: "#f5f5f5" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

            {/* HEADER */}
            <div style={{ marginBottom: "30px" }}>
              <h1 style={{ fontSize: "32px", marginBottom: "10px" }}>Organizer Dashboard</h1>
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
                    backgroundColor: "#dc3545",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "24px",
                    color: "white"
                  }}>
                    {user?.firstName?.charAt(0) || "O"}
                  </div>
                  <div>
                    <h3 style={{ margin: 0 }}>{user?.firstName} {user?.lastName}</h3>
                    <p style={{ margin: "5px 0 0 0", color: "#666" }}>{user?.email}</p>
                  </div>
                </div>
                <p style={{ color: "#666", marginBottom: "5px" }}><strong>Role:</strong> Organizer</p>
                <p style={{ color: "#666", marginBottom: "5px" }}><strong>Location:</strong> {user?.city}, {user?.state}</p>
                <p style={{ color: "#666" }}><strong>Events Created:</strong> {myEvents.length}</p>
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
                    to="/events/create"
                    style={{
                      ...redButtonStyle,
                      padding: "12px 20px",
                      borderRadius: "8px",
                      textDecoration: "none",
                      textAlign: "center",
                      fontWeight: "bold"
                    }}
                  >
                    + Create New Event
                  </Link>
                  <Link
                    to="/events"
                    style={{
                      padding: "12px 20px",
                      borderRadius: "8px",
                      textDecoration: "none",
                      textAlign: "center",
                      fontWeight: "bold",
                      backgroundColor: "white",
                      color: "#dc3545",
                      border: "2px solid #dc3545"
                    }}
                  >
                    Browse All Events
                  </Link>
                </div>
              </div>
            </div>

            {/* MY EVENTS SECTION */}
            <div style={{
              backgroundColor: "white",
              padding: "30px",
              borderRadius: "12px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.08)"
            }}>
              <h2 style={{ marginTop: 0, marginBottom: "25px" }}>📋 My Events</h2>

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
                    You haven't created any events yet.
                  </p>
                  <Link
                    to="/events/create"
                    style={{
                      ...redButtonStyle,
                      padding: "12px 30px",
                      borderRadius: "8px",
                      textDecoration: "none",
                      fontWeight: "bold"
                    }}
                  >
                    Create Your First Event
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
                          <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "10px" }}>
                            <h3 style={{ margin: 0, fontSize: "18px" }}>{event.eventName}</h3>
                            <span style={{
                              ...getStatusStyle(event.approvalStatus),
                              padding: "4px 12px",
                              borderRadius: "15px",
                              fontSize: "12px",
                              fontWeight: "bold",
                              textTransform: "uppercase"
                            }}>
                              {event.approvalStatus}
                            </span>
                          </div>
                          <p style={{ margin: "5px 0", color: "#666", fontSize: "14px" }}>
                            <strong>Date:</strong> {new Date(event.date).toLocaleDateString()} at {event.time}
                          </p>
                          <p style={{ margin: "5px 0", color: "#666", fontSize: "14px" }}>
                            <strong>Location:</strong> {event.location}
                          </p>
                          <p style={{ margin: "5px 0", color: "#666", fontSize: "14px" }}>
                            <strong>Category:</strong> {event.category}
                          </p>
                        </div>

                        {/* View Details Button */}
                        <Link
                          to={`/events/${event._id}`}
                          style={{
                            padding: "10px 20px",
                            backgroundColor: "#dc3545",
                            color: "white",
                            borderRadius: "6px",
                            textDecoration: "none",
                            fontWeight: "bold",
                            fontSize: "14px"
                          }}
                        >
                          View Event
                        </Link>
                      </div>

                      {/* Admin Review Notes */}
                      {(event.reviewNotes || event.denialReason) && (
                        <div style={{
                          marginTop: "15px",
                          padding: "15px",
                          borderRadius: "8px",
                          backgroundColor: event.approvalStatus === "denied" ? "#fff5f5" : "#f0fff4",
                          borderLeft: `4px solid ${event.approvalStatus === "denied" ? "#dc3545" : "#28a745"}`
                        }}>
                          <p style={{
                            margin: 0,
                            fontWeight: "bold",
                            fontSize: "13px",
                            color: event.approvalStatus === "denied" ? "#dc3545" : "#28a745",
                            marginBottom: "8px"
                          }}>
                            📝 Admin Notes:
                          </p>
                          <p style={{ margin: 0, color: "#444", fontSize: "14px" }}>
                            {event.reviewNotes || event.denialReason}
                          </p>
                        </div>
                      )}

                      {/* Pending Message */}
                      {event.approvalStatus === "pending" && (
                        <div style={{
                          marginTop: "15px",
                          padding: "12px 15px",
                          borderRadius: "8px",
                          backgroundColor: "#fff8e1",
                          borderLeft: "4px solid #FFC300"
                        }}>
                          <p style={{ margin: 0, color: "#856404", fontSize: "14px" }}>
                            ⏳ This event is awaiting admin approval. You'll be notified once it's reviewed.
                          </p>
                        </div>
                      )}
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

export default OrganizerDashboard;
