import React, { useEffect, useState, useRef } from "react";
import NavigationBar from "../components/NavigationBar";
import Footer from "../components/Footer";
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

  return (
    <>
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

      <div className={`calendar-content ${!user ? "blurred" : ""}`}>
        <header className="page-header">My Events & Calendar</header>

        <div className="dashboard">
          <section className="calendar-section">
            <div className="card calendar-card">
              <h3 className="card-title">Calendar</h3>

              <div className="fc-wrapper">
                <FullCalendar
                  ref={calendarRef}
                  plugins={[dayGridPlugin, interactionPlugin]}
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
              <h3 className="card-title">Events on Selected Date</h3>

              <ul className="event-list">
                {selectedEvents.length === 0 ? (
                  <li className="event-item">Select a day to view events.</li>
                ) : (
                  selectedEvents.map((ev, index) => (
                    <li key={index} className="event-item">
                      <strong>{ev.title}</strong>
                      <br />Organizer: {ev.organizer}
                      <br />Time: {ev.time}
                      <br /><small>{ev.description}</small>
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
