import React, { useEffect, useState } from "react";
import NavigationBar from "../components/NavigationBar";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";

function AdminDashboard() {
  const { user } = useAuth();
  const [pendingEvents, setPendingEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingEvents();
  }, []);

  async function fetchPendingEvents() {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5001/api/events/admin/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const json = await res.json();

      if (json.success) {
        const pending = json.data.filter(event => event.approvalStatus === "pending");
        setPendingEvents(pending);
      }
    } catch (err) {
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  }

  // Rotating images for event cards
  const rotatingImages = [
    "/img/clean1.jpg", "/img/clean2.jpg", "/img/clean3.jpg",
    "/img/clean4.jpg", "/img/clean5.jpg", "/img/clean6.jpg"
  ];

  function getEventImage(event) {
    const index = Math.abs(event._id?.charCodeAt(0) % rotatingImages.length);
    return event.imageUrl || rotatingImages[index];
  }

  const quickActionStyle = {
    backgroundColor: "#FFC300",
    color: "black",
    padding: "12px 24px",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: "bold",
    display: "inline-block",
    margin: "5px"
  };

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <NavigationBar />

        <div style={{ padding: "40px", flex: 1, backgroundColor: "#f5f5f5" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

            {/* HEADER */}
            <div style={{ marginBottom: "30px" }}>
              <h1 style={{ fontSize: "32px", marginBottom: "10px" }}>Admin Dashboard</h1>
              <p style={{ color: "#666" }}>Welcome back, Administrator {user?.firstName}</p>
            </div>

            {/* STATS */}
            <div style={{
              display: "inline-block",
              padding: "20px 40px",
              backgroundColor: "#fff8e1",
              borderRadius: "12px",
              border: "2px solid #FFC300",
              marginBottom: "30px"
            }}>
              <h2 style={{ fontSize: "48px", margin: 0, color: "#FFC300" }}>{pendingEvents.length}</h2>
              <p style={{ margin: "5px 0 0 0", fontWeight: "bold", color: "#666" }}>Events Pending Approval</p>
            </div>

            {/* PENDING EVENTS SECTION */}
            <div style={{ marginBottom: "40px" }}>
              <h2 style={{ fontSize: "24px", marginBottom: "20px" }}>📋 Pending Event Approvals</h2>

              {loading ? (
                <p style={{ color: "#666" }}>Loading pending events...</p>
              ) : pendingEvents.length === 0 ? (
                <div style={{
                  padding: "40px",
                  textAlign: "center",
                  backgroundColor: "white",
                  borderRadius: "12px",
                  border: "1px solid #e0e0e0"
                }}>
                  <p style={{ color: "#666", fontSize: "18px" }}>✓ No events pending approval</p>
                </div>
              ) : (
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                  gap: "25px"
                }}>
                  {pendingEvents.map(event => (
                    <Link
                      to={`/admin/events/${event._id}/review`}
                      key={event._id}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <div style={{
                        backgroundColor: "white",
                        borderRadius: "12px",
                        overflow: "hidden",
                        boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
                        transition: "transform 0.2s, box-shadow 0.2s",
                        cursor: "pointer",
                        border: "2px solid #FFC300"
                      }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.transform = "translateY(-5px)";
                          e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.12)";
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.08)";
                        }}
                      >
                        {/* Event Image */}
                        <div style={{ position: "relative" }}>
                          <img
                            src={getEventImage(event)}
                            alt={event.eventName}
                            style={{ width: "100%", height: "160px", objectFit: "cover" }}
                          />
                          <div style={{
                            position: "absolute",
                            top: "10px",
                            right: "10px",
                            backgroundColor: "#FFC300",
                            color: "black",
                            padding: "5px 12px",
                            borderRadius: "15px",
                            fontSize: "12px",
                            fontWeight: "bold"
                          }}>
                            PENDING
                          </div>
                        </div>

                        {/* Event Info */}
                        <div style={{ padding: "20px" }}>
                          <h3 style={{
                            margin: "0 0 10px 0",
                            fontSize: "18px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis"
                          }}>
                            {event.eventName}
                          </h3>
                          <p style={{ margin: "0 0 8px 0", color: "#666", fontSize: "14px" }}>
                            <strong>Organizer:</strong> {event.organizer}
                          </p>
                          <p style={{ margin: "0 0 8px 0", color: "#666", fontSize: "14px" }}>
                            <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
                          </p>
                          <p style={{ margin: "0 0 8px 0", color: "#666", fontSize: "14px" }}>
                            <strong>Category:</strong> {event.category}
                          </p>
                          <p style={{
                            margin: "0",
                            color: "#888",
                            fontSize: "13px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical"
                          }}>
                            {event.details?.substring(0, 80)}...
                          </p>

                          <div style={{
                            marginTop: "15px",
                            paddingTop: "15px",
                            borderTop: "1px solid #eee",
                            textAlign: "center"
                          }}>
                            <span style={{ color: "#586bff", fontWeight: "bold", fontSize: "14px" }}>
                              Click to Review →
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* QUICK ACTIONS */}
            <div style={{
              backgroundColor: "white",
              padding: "25px",
              borderRadius: "12px",
              border: "1px solid #e0e0e0"
            }}>
              <h3 style={{ marginBottom: "20px" }}>Quick Actions</h3>
              <div>
                <Link to="/admin/users" style={quickActionStyle}>Manage Users</Link>
                <Link to="/admin/events" style={quickActionStyle}>All Events</Link>
                <Link to="/admin/reports" style={quickActionStyle}>View Reports</Link>
              </div>
            </div>

          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}

export default AdminDashboard;
