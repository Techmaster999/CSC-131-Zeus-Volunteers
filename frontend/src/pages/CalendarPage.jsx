import React, { useEffect, useState, useRef } from "react";
import NavigationBar from "../components/NavigationBar";
import Footer from "../components/Footer";
import ReminderPanel from "../components/ReminderPanel";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

import "../styles/calendar.css";

function CalendarPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [selectedEvents, setSelectedEvents] = useState([]);
  const calendarRef = useRef(null);
  const [activeDate, setActiveDate] = useState(null);

  // Reminder Modal State
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [reminderTargetEvent, setReminderTargetEvent] = useState(null);
  const [reminderTime, setReminderTime] = useState("1hour");

  useEffect(() => {
    async function loadEvents() {
      try {
        const res = await fetch("http://localhost:5001/api/events");
        const json = await res.json();

        const formatted = json.data.map((ev) => ({
          id: ev._id,
          title: ev.eventName,
          date: new Date(ev.date).toISOString().split("T")[0],
          description: ev.details,
          organizer: ev.organizer,
          time: ev.time,
        }));

        setEvents(formatted);
      } catch (err) {
        console.error("Error loading events:", err);
      }
    }

    loadEvents();
  }, []);

  function handleDateClick(info) {
    const clicked = info.dateStr;
    setActiveDate(clicked);

    // highlight the clicked cell manually
    highlightSelectedCell(clicked);

    const todaysEvents = events.filter((ev) => ev.date === clicked);
    setSelectedEvents(todaysEvents);
  }

  function highlightSelectedCell(dateStr) {
    // Remove old selection
    document.querySelectorAll(".fc-selected-date").forEach((el) => {
      el.classList.remove("fc-selected-date");
    });

    // Add to newly clicked date
    const newCell = document.querySelector(`[data-date='${dateStr}']`);
    if (newCell) newCell.classList.add("fc-selected-date");
  }

  // Open Reminder Modal
  const openReminderModal = (event) => {
    setReminderTargetEvent(event);
    setShowReminderModal(true);
  };

  // Submit Reminder
  const handleCreateReminder = async () => {
    if (!reminderTargetEvent) return;

    // Calculate trigger time based on even date/time minus the offset
    // For simplicity in this demo, we'll just send the offset label (e.g., '1hour') or 
    // let the backend handle it if we have a way.
    // The current backend `addReminder` expects: { eventId, triggerTime, notificationType }
    // OR we can use the backend logic calculateTriggerTime. 
    // Since the frontend has the raw logic, let's just assume we send the label for now
    // and rely on the backend to interpret or manual calculation.

    // Actually, backend `createReminder` takes `triggerTime` (Date).
    // Let's implement a simple helper to calculate the date.
    const eventDateTime = new Date(`${reminderTargetEvent.date}T${reminderTargetEvent.time || '09:00'}`);
    let triggerDate = new Date(eventDateTime);

    switch (reminderTime) {
      case '1hour': triggerDate.setHours(triggerDate.getHours() - 1); break;
      case '3hours': triggerDate.setHours(triggerDate.getHours() - 3); break;
      case '1day': triggerDate.setDate(triggerDate.getDate() - 1); break;
      case '3days': triggerDate.setDate(triggerDate.getDate() - 3); break;
      case '1week': triggerDate.setDate(triggerDate.getDate() - 7); break;
      default: break;
    }

    try {
      const res = await fetch("http://localhost:5001/api/reminders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          eventId: reminderTargetEvent.id,
          triggerTime: triggerDate.toISOString(),
          notificationType: 'email',
          label: `Custom: ${reminderTime} before`
        }),
      });

      if (res.ok) {
        alert("Reminder set successfully!");
        setShowReminderModal(false);
        // Refresh reminders list (requires passing a refresh trigger to ReminderPanel, or just ignore for now)
        window.location.reload(); // Simple reload to refresh the panel
      } else {
        alert("Failed to set reminder");
      }
    } catch (err) {
      console.error(err);
      alert("Error setting reminder");
    }
  };


  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "#e8e8e8" }}>
        <NavigationBar />

        {!user && (
          <div className="calendar-modal-overlay">
            <div className="calendar-modal">
              <h2>Please Sign In</h2>
              <p>You must be signed in to view your personalized events.</p>

              <div className="modal-buttons">
                <Link to="/login" className="modal-btn login">Login</Link>
                <Link to="/" className="modal-btn back">Return Home</Link>
              </div>
            </div>
          </div>
        )}

        {/* Create Reminder Modal */}
        {showReminderModal && (
          <div className="calendar-modal-overlay">
            <div className="calendar-modal" style={{ width: "400px", textAlign: "left" }}>
              <h3 style={{ marginBottom: "15px", fontSize: "18px" }}>Set Reminder</h3>
              <p style={{ marginBottom: "20px", color: "#666" }}>
                For: <strong>{reminderTargetEvent?.title}</strong>
              </p>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>When do you want to be reminded?</label>
                <select
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ddd" }}
                >
                  <option value="1hour">1 Hour Before</option>
                  <option value="3hours">3 Hours Before</option>
                  <option value="1day">1 Day Before</option>
                  <option value="3days">3 Days Before</option>
                  <option value="1week">1 Week Before</option>
                </select>
              </div>

              <div className="modal-buttons">
                <button onClick={handleCreateReminder} className="modal-btn login">Set Reminder</button>
                <button onClick={() => setShowReminderModal(false)} className="modal-btn back">Cancel</button>
              </div>
            </div>
          </div>
        )}

        <div className={`calendar-content ${!user ? "blurred" : ""}`} style={{ flex: 1 }}>
          <header className="page-header">My Events & Calendar</header>

          <div className="dashboard" style={{ gridTemplateAreas: '"calendar events" "calendar reminders"' }}>
            <section className="calendar-section" style={{ gridArea: "calendar" }}>
              <div className="card calendar-card" style={{ height: "100%" }}>
                <h3 className="card-title">Calendar</h3>

                <div className="fc-wrapper">
                  <FullCalendar
                    ref={calendarRef}
                    plugins={[dayGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    events={events}
                    dateClick={handleDateClick}
                    height="auto"
                  />
                </div>
              </div>
            </section>

            <section className="events-section" style={{ gridArea: "events", display: "flex", flexDirection: "column", gap: "20px" }}>
              <div className="card events-card">
                <h3 className="card-title">Events on Selected Date</h3>

                <ul className="event-list">
                  {selectedEvents.length === 0 ? (
                    <li className="event-item">Select a day to view events.</li>
                  ) : (
                    selectedEvents.map((ev, index) => (
                      <li key={index} className="event-item" style={{ position: "relative" }}>
                        <strong>{ev.title}</strong>
                        <br />Organizer: {ev.organizer}
                        <br />Time: {ev.time}
                        <br /><small>{ev.description}</small>
                        <button
                          onClick={() => openReminderModal(ev)}
                          className="btn"
                          style={{
                            fontSize: "12px",
                            padding: "4px 8px",
                            marginTop: "8px",
                            display: "block",
                            width: "fit-content"
                          }}
                        >
                          🔔 Set Reminder
                        </button>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </section>

            <section style={{ gridArea: "reminders" }}>
              <ReminderPanel events={events} />
            </section>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}

export default CalendarPage;
