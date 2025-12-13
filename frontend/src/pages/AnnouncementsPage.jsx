// src/pages/AnnouncementsPage.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NavigationBar from "../components/NavigationBar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";

import "../styles/homepage-global.css";
import "../styles/homepage-style.css";

function AnnouncementsPage() {
    const { user } = useAuth();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

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
                    // Flatten and gather all announcements from valid events
                    const allAnnouncements = [];

                    json.data.forEach(e => {
                        if (e.status !== 'completed' && e.status !== 'cancelled') {
                            // Check for multiple announcements (array)
                            if (Array.isArray(e.announcements) && e.announcements.length > 0) {
                                e.announcements.forEach(ann => {
                                    allAnnouncements.push({
                                        _id: e._id + (ann.sentAt || Math.random()),
                                        eventId: e._id,
                                        eventName: e.eventName,
                                        location: e.location,
                                        message: typeof ann === 'object' ? ann.message : ann,
                                        sentAt: ann.sentAt || e.createdAt,
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
                                    location: e.location,
                                    message: e.announcements,
                                    sentAt: e.updatedAt || e.createdAt,
                                    eventDate: e.date
                                });
                            }
                        }
                    });

                    // Sort by announcement date (newest first)
                    allAnnouncements.sort((a, b) => new Date(b.sentAt) - new Date(a.sentAt));

                    setEvents(allAnnouncements);
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

    return (
        <>
            <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "#e8e8e8" }}>
                <NavigationBar />

                <main style={{ flex: "1 0 auto", padding: "40px 20px", backgroundColor: "#e8e8e8" }}>
                    <div style={{ maxWidth: "900px", margin: "0 auto" }}>

                        {/* Header */}
                        <div style={{ marginBottom: "30px" }}>
                            <Link
                                to="/home"
                                style={{
                                    color: "#586bff",
                                    textDecoration: "none",
                                    fontSize: "14px",
                                    marginBottom: "10px",
                                    display: "inline-block"
                                }}
                            >
                                ← Back to Dashboard
                            </Link>
                            <h1 style={{ fontSize: "32px", marginBottom: "10px" }}>📢 All Announcements</h1>
                            <p style={{ color: "#666" }}>
                                Announcements from events you've signed up for
                            </p>
                        </div>

                        {/* Announcements List */}
                        <div style={{
                            backgroundColor: "white",
                            padding: "30px",
                            borderRadius: "12px",
                            boxShadow: "0 2px 10px rgba(0,0,0,0.08)"
                        }}>
                            {loading ? (
                                <p style={{ color: "#666", textAlign: "center" }}>Loading announcements...</p>
                            ) : events.length === 0 ? (
                                <div style={{
                                    textAlign: "center",
                                    padding: "50px",
                                    backgroundColor: "#f9f9f9",
                                    borderRadius: "8px"
                                }}>
                                    <p style={{ color: "#666", fontSize: "16px", marginBottom: "15px" }}>
                                        No announcements from your registered events.
                                    </p>
                                    <Link
                                        to="/events"
                                        style={{
                                            padding: "12px 30px",
                                            backgroundColor: "#586bff",
                                            color: "white",
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
                                    {events.map(ann => (
                                        <div
                                            key={ann._id}
                                            style={{
                                                padding: "20px 25px",
                                                borderRadius: "12px",
                                                border: "1px solid #ddd",
                                                backgroundColor: "#fafafa",
                                            }}
                                        >
                                            <div style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "flex-start",
                                                marginBottom: "12px",
                                                flexWrap: "wrap",
                                                gap: "10px"
                                            }}>
                                                <h3 style={{ margin: 0, color: "#333", fontSize: "18px" }}>
                                                    {ann.eventName}
                                                </h3>
                                                <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
                                                    <span style={{
                                                        color: "#666",
                                                        fontSize: "13px",
                                                        backgroundColor: "#e8e8e8",
                                                        padding: "4px 10px",
                                                        borderRadius: "4px"
                                                    }}>
                                                        📅 {new Date(ann.eventDate).toLocaleDateString()}
                                                    </span>
                                                    <span style={{
                                                        color: "#666",
                                                        fontSize: "13px",
                                                        backgroundColor: "#e8e8e8",
                                                        padding: "4px 10px",
                                                        borderRadius: "4px"
                                                    }}>
                                                        📍 {ann.location}
                                                    </span>
                                                    <span style={{
                                                        color: "#666",
                                                        fontSize: "13px",
                                                        backgroundColor: "#e8e8e8",
                                                        padding: "4px 10px",
                                                        borderRadius: "4px"
                                                    }}>
                                                        ⏱ Posted: {new Date(ann.sentAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>

                                            <div style={{
                                                backgroundColor: "#f0f4ff",
                                                padding: "15px",
                                                borderRadius: "8px",
                                                borderLeft: "4px solid #586bff",
                                                marginBottom: "12px"
                                            }}>
                                                <p style={{ margin: 0, color: "#333", fontSize: "15px", lineHeight: "1.6" }}>
                                                    {ann.message}
                                                </p>
                                            </div>

                                            <Link
                                                to={`/events/${ann.eventId}`}
                                                style={{
                                                    display: "inline-block",
                                                    padding: "8px 20px",
                                                    backgroundColor: "#586bff",
                                                    color: "white",
                                                    borderRadius: "6px",
                                                    textDecoration: "none",
                                                    fontWeight: "bold",
                                                    fontSize: "13px"
                                                }}
                                            >
                                                View Event Details
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

export default AnnouncementsPage;
