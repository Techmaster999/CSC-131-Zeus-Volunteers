// src/pages/admin/AdminEventReview.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavigationBar from "../../components/NavigationBar";
import Footer from "../../components/Footer";
import { useAuth } from "../../context/AuthContext";

function AdminEventReview() {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });
    const [notes, setNotes] = useState("");

    useEffect(() => {
        async function fetchEvent() {
            try {
                const res = await fetch(`http://localhost:5001/api/events/${eventId}`);
                const json = await res.json();
                setEvent(json.data || json);
            } catch (err) {
                console.error("Error fetching event:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchEvent();
    }, [eventId]);

    async function handleReview(decision) {
        setActionLoading(true);
        setMessage({ text: "", type: "" });

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:5001/api/events/${eventId}/review`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    decision,
                    adminId: user.id,
                    notes: notes || (decision === "approved" ? "Approved by admin" : "Denied by admin"),
                }),
            });

            const json = await res.json();

            if (json.success) {
                setMessage({ text: `Event ${decision} successfully!`, type: "success" });
                setTimeout(() => navigate("/admin"), 1500);
            } else {
                setMessage({ text: json.message || "Action failed", type: "error" });
            }
        } catch (err) {
            console.error("Error reviewing event:", err);
            setMessage({ text: "Failed to process request", type: "error" });
        } finally {
            setActionLoading(false);
        }
    }

    if (loading) {
        return (
            <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
                <NavigationBar />
                <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <p>Loading event details...</p>
                </div>
                <Footer />
            </div>
        );
    }

    if (!event) {
        return (
            <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
                <NavigationBar />
                <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <p>Event not found</p>
                </div>
                <Footer />
            </div>
        );
    }

    const rotatingImages = [
        "/img/clean1.jpg", "/img/clean2.jpg", "/img/clean3.jpg",
        "/img/clean4.jpg", "/img/clean5.jpg", "/img/clean6.jpg"
    ];
    const index = Math.abs(event._id?.charCodeAt(0) % rotatingImages.length);
    const eventImage = event.imageUrl || rotatingImages[index];

    return (
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            <NavigationBar />

            <main style={{ flex: 1, padding: "40px 20px", maxWidth: "1000px", margin: "0 auto", width: "100%" }}>

                {/* Back Button */}
                <button
                    onClick={() => navigate("/admin")}
                    style={{
                        marginBottom: "20px",
                        padding: "10px 20px",
                        backgroundColor: "transparent",
                        border: "none",
                        color: "#666",
                        cursor: "pointer",
                        fontSize: "14px"
                    }}
                >
                    ← Back to Dashboard
                </button>

                {/* Status Badge */}
                <div style={{
                    display: "inline-block",
                    padding: "8px 16px",
                    borderRadius: "20px",
                    backgroundColor: event.approvalStatus === "pending" ? "#fff3cd" : event.approvalStatus === "approved" ? "#d4edda" : "#f8d7da",
                    color: event.approvalStatus === "pending" ? "#856404" : event.approvalStatus === "approved" ? "#155724" : "#721c24",
                    fontWeight: "bold",
                    marginBottom: "20px"
                }}>
                    {event.approvalStatus?.toUpperCase()} APPROVAL
                </div>

                {/* Event Header */}
                <div style={{ display: "flex", gap: "30px", flexWrap: "wrap", marginBottom: "30px" }}>
                    <img
                        src={eventImage}
                        alt={event.eventName}
                        style={{ width: "300px", height: "200px", objectFit: "cover", borderRadius: "12px" }}
                    />
                    <div style={{ flex: 1, minWidth: "300px" }}>
                        <h1 style={{ fontSize: "28px", marginBottom: "15px" }}>{event.eventName}</h1>
                        <p style={{ color: "#666", marginBottom: "10px" }}>
                            <strong>Organizer:</strong> {event.organizer}
                        </p>
                        <p style={{ color: "#666", marginBottom: "10px" }}>
                            <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
                        </p>
                        <p style={{ color: "#666", marginBottom: "10px" }}>
                            <strong>Time:</strong> {event.time}
                        </p>
                        <p style={{ color: "#666", marginBottom: "10px" }}>
                            <strong>Location:</strong> {event.location}
                        </p>
                        <p style={{ color: "#666", marginBottom: "10px" }}>
                            <strong>Category:</strong> {event.category}
                        </p>
                        <p style={{ color: "#666" }}>
                            <strong>Max Volunteers:</strong> {event.maxVolunteers || "Not specified"}
                        </p>
                    </div>
                </div>

                {/* Event Details */}
                <div style={{ backgroundColor: "#f9f9f9", padding: "25px", borderRadius: "12px", marginBottom: "20px" }}>
                    <h3 style={{ marginBottom: "15px" }}>Event Description</h3>
                    <p style={{ lineHeight: "1.7", color: "#444" }}>{event.details || "No description provided."}</p>
                </div>

                {event.announcements && (
                    <div style={{ backgroundColor: "#fff8e1", padding: "25px", borderRadius: "12px", marginBottom: "20px" }}>
                        <h3 style={{ marginBottom: "15px" }}>Announcements</h3>
                        <p style={{ lineHeight: "1.7", color: "#444" }}>{event.announcements}</p>
                    </div>
                )}

                {event.commitments && (
                    <div style={{ backgroundColor: "#e3f2fd", padding: "25px", borderRadius: "12px", marginBottom: "20px" }}>
                        <h3 style={{ marginBottom: "15px" }}>Requirements / What to Bring</h3>
                        <p style={{ lineHeight: "1.7", color: "#444" }}>{event.commitments}</p>
                    </div>
                )}

                {/* Message */}
                {message.text && (
                    <div style={{
                        padding: "15px",
                        borderRadius: "8px",
                        marginBottom: "20px",
                        backgroundColor: message.type === "success" ? "#d4edda" : "#f8d7da",
                        color: message.type === "success" ? "#155724" : "#721c24"
                    }}>
                        {message.text}
                    </div>
                )}

                {/* Admin Actions */}
                {event.approvalStatus === "pending" && (
                    <div style={{ backgroundColor: "white", padding: "25px", borderRadius: "12px", border: "2px solid #FFC300" }}>
                        <h3 style={{ marginBottom: "20px", color: "#333" }}>Admin Review</h3>

                        <div style={{ marginBottom: "20px" }}>
                            <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
                                Review Notes (optional)
                            </label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Add notes for the organizer..."
                                style={{
                                    width: "100%",
                                    padding: "12px",
                                    borderRadius: "8px",
                                    border: "1px solid #ddd",
                                    minHeight: "80px",
                                    fontSize: "14px"
                                }}
                            />
                        </div>

                        <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
                            <button
                                onClick={() => handleReview("approved")}
                                disabled={actionLoading}
                                style={{
                                    padding: "14px 40px",
                                    backgroundColor: "#28a745",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "8px",
                                    cursor: actionLoading ? "not-allowed" : "pointer",
                                    fontWeight: "bold",
                                    fontSize: "16px",
                                    opacity: actionLoading ? 0.6 : 1
                                }}
                            >
                                ✓ Approve Event
                            </button>
                            <button
                                onClick={() => handleReview("denied")}
                                disabled={actionLoading}
                                style={{
                                    padding: "14px 40px",
                                    backgroundColor: "#dc3545",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "8px",
                                    cursor: actionLoading ? "not-allowed" : "pointer",
                                    fontWeight: "bold",
                                    fontSize: "16px",
                                    opacity: actionLoading ? 0.6 : 1
                                }}
                            >
                                ✗ Deny Event
                            </button>
                        </div>
                    </div>
                )}

            </main>

            <Footer />
        </div>
    );
}

export default AdminEventReview;
