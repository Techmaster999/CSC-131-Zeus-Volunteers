import React, { useEffect, useState } from "react";
import NavigationBar from "../components/NavigationBar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

import "../styles/calendar-global.css";
import "../styles/calendar-style.css";
import "../styles/calendar-styleguide.css";

function CalendarPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [selectedEvents, setSelectedEvents] = useState([]);

  useEffect(() => {
    async function loadEvents() {
      try {
        const res = await fetch("http://localhost:5001/api/events");
        const data = await res.json();

        const formatted = data.map((ev) => ({
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
    const todaysEvents = events.filter((ev) => ev.date === info.dateStr);
    setSelectedEvents(todaysEvents);
  }

  return (
    <>
      <NavigationBar />

      {/* Pop-up modal when NOT logged in */}
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

      <div className={`calendar-content ${!user ? "blurred" : ""}`}>
        <header className="page-header">My Events & Calendar</header>

        <div className="dashboard">
          <section className="calendar-section">
            <div className="card calendar-card">
              <h3 className="card-title">Calendar</h3>

              <div className="fc-wrapper">
                <FullCalendar
                  plugins={[dayGridPlugin]}
                  initialView="dayGridMonth"
                  events={events}
                  dateClick={handleDateClick}
                  height={480}
                />
              </div>
            </div>
          </section>

          <section className="events-section">
            <div className="card events-card">
              <h3 className="card-title">Upcoming Events</h3>

              <ul className="event-list">
                {selectedEvents.length === 0 ? (
                  <li className="event-item">Select a day to view events.</li>
                ) : (
                  selectedEvents.map((ev, i) => (
                    <li key={i} className="event-item">
                      <strong>{ev.title}</strong>
                      <br />
                      Organizer: {ev.organizer}
                      <br />
                      Time: {ev.time}
                      <br />
                      <small>{ev.description}</small>
                      <br />
                      <span>{ev.date}</span>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default CalendarPage;
