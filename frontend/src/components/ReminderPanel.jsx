import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import API_URL from "../config";

const ReminderPanel = ({ events }) => {
    const { user } = useAuth();
    const [reminders, setReminders] = useState([]);
    const [preferences, setPreferences] = useState({
        emailNotifications: true,
        defaultReminders: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("upcoming");

    useEffect(() => {
        if (user) {
            fetchReminders();
            fetchPreferences();
        }
    }, [user]);

    const fetchReminders = async () => {
        try {
            const res = await fetch(`${API_URL}/api/reminders`, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            const data = await res.json();
            if (data.success) {
                setReminders(data.data);
            }
        } catch (err) {
            console.error("Failed to fetch reminders", err);
        }
    };

    const fetchPreferences = async () => {
        try {
            const res = await fetch(`${API_URL}/api/reminders/preferences`, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            const data = await res.json();
            if (data.success) {
                setPreferences(data.data);
            }
            setLoading(false);
        } catch (err) {
            console.error("Failed to fetch preferences", err);
            setLoading(false);
        }
    };

    const handleToggleEmail = async () => {
        const newVal = !preferences.emailNotifications;
        setPreferences({ ...preferences, emailNotifications: newVal });
        try {
            await fetch(`${API_URL}/api/reminders/preferences`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify({
                    emailNotifications: newVal,
                    defaultReminders: preferences.defaultReminders,
                }),
            });
        } catch (err) {
            console.error("Failed to update preferences", err);
        }
    };

    const handleDeleteReminder = async (id) => {
        try {
            const res = await fetch(`${API_URL}/api/reminders/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${user.token}` },
            });
            if (res.ok) {
                setReminders(reminders.filter((r) => r._id !== id));
            }
        } catch (err) {
            console.error("Failed to delete reminder", err);
        }
    };

    // Enhance reminders with event data if available
    const enrichedReminders = reminders.map((rem) => {
        // Backend populates eventId as an object
        if (rem.eventId && typeof rem.eventId === 'object') {
            return {
                ...rem,
                eventName: rem.eventId.eventName || rem.eventId.title || "Unknown Event"
            };
        }

        // Fallback: if eventId is just an ID string, look it up in props
        const event = events.find((e) => e.id === rem.eventId);
        return { ...rem, eventName: event ? event.title : "Unknown Event" };
    });

    return (
        <div className="card" style={{ height: "100%" }}>
            <h3 className="card-title">Notifications & Reminders</h3>

            <div className="tabs" style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
                <button
                    onClick={() => setActiveTab("upcoming")}
                    className={`tab-btn ${activeTab === "upcoming" ? "active" : ""}`}
                    style={{
                        padding: "6px 12px",
                        borderRadius: "6px",
                        background: activeTab === "upcoming" ? "#4f46e5" : "#f3f4f6",
                        color: activeTab === "upcoming" ? "white" : "#374151",
                        border: "none",
                        cursor: "pointer",
                        fontWeight: "500",
                        fontSize: "13px"
                    }}
                >
                    Upcoming
                </button>
                <button
                    onClick={() => setActiveTab("settings")}
                    className={`tab-btn ${activeTab === "settings" ? "active" : ""}`}
                    style={{
                        padding: "6px 12px",
                        borderRadius: "6px",
                        background: activeTab === "settings" ? "#4f46e5" : "#f3f4f6",
                        color: activeTab === "settings" ? "white" : "#374151",
                        border: "none",
                        cursor: "pointer",
                        fontWeight: "500",
                        fontSize: "13px"
                    }}
                >
                    Settings
                </button>
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : activeTab === "upcoming" ? (
                <ul className="reminder-list" style={{ maxHeight: "400px", overflowY: "auto" }}>
                    {enrichedReminders.length === 0 ? (
                        <li style={{ color: "#6b7280", fontSize: "14px" }}>No upcoming reminders.</li>
                    ) : (
                        enrichedReminders.map((rem) => (
                            <li
                                key={rem._id}
                                style={{
                                    padding: "10px",
                                    borderBottom: "1px solid #e5e7eb",
                                    fontSize: "13px",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center"
                                }}
                            >
                                <div>
                                    <strong style={{ display: "block", color: "#111827" }}>{rem.label}</strong>
                                    <span style={{ color: "#6b7280", fontSize: "12px" }}>
                                        For: {rem.eventName}
                                    </span>
                                    <div style={{ fontSize: "11px", color: "#9ca3af", marginTop: "2px" }}>
                                        {new Date(rem.triggerTime).toLocaleString()}
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDeleteReminder(rem._id)}
                                    style={{
                                        background: "none",
                                        border: "none",
                                        color: "#ef4444",
                                        cursor: "pointer",
                                        fontSize: "18px",
                                        padding: "4px"
                                    }}
                                    title="Remove reminder"
                                >
                                    &times;
                                </button>
                            </li>
                        ))
                    )}
                </ul>
            ) : (
                <div className="settings-tab">
                    <div style={{ marginBottom: "15px" }}>
                        <label style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", cursor: "pointer" }}>
                            <input
                                type="checkbox"
                                checked={preferences.emailNotifications}
                                onChange={handleToggleEmail}
                                style={{ width: "16px", height: "16px" }}
                            />
                            Enable Email Notifications
                        </label>
                        <p style={{ fontSize: "12px", color: "#6b7280", marginTop: "5px", marginLeft: "26px" }}>
                            Receive emails when reminders are triggered.
                        </p>
                    </div>

                    <div style={{ background: "#eff6ff", padding: "12px", borderRadius: "6px" }}>
                        <h4 style={{ fontSize: "13px", color: "#1e40af", marginBottom: "5px" }}>Automated Reminders</h4>
                        <p style={{ fontSize: "12px", color: "#1e3a8a" }}>
                            Default reminders (e.g., "1 day before") are automatically created when you register for an event based on your profile settings.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReminderPanel;
