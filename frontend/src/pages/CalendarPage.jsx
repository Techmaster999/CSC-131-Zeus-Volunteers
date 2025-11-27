import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

// CSS
import "../styles/calendar-global.css";
import "../styles/calendar-style.css";
import "../styles/calendar-styleguide.css";



// FullCalendar
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [selectedEvents, setSelectedEvents] = useState([]);

  // Load events from backend
  useEffect(() => {
    async function loadEvents() {
      try {
        const res = await fetch("http://localhost:5001/api/events");
        const data = await res.json();

        const formatted = data.map((ev) => {
          const isoDate = new Date(ev.date).toISOString().split("T")[0];

          return {
            title: ev.eventName,
            date: isoDate,
            description: ev.details,
            organizer: ev.organizer,
            time: ev.time,
          };
        });

        setEvents(formatted);
        console.log("EVENTS LOADED:", events);

      } catch (err) {
        console.error("Error loading events:", err);
      }
    }

    loadEvents();
  }, []);

  // When clicking a date
  function handleDateClick(info) {
    const clickedDay = info.dateStr;
    const todaysEvents = events.filter((ev) => ev.date === clickedDay);
    setSelectedEvents(todaysEvents);
  }

  return (
    <>
      <Header />

      <header className="page-header">My Events & Calendar</header>

      <div className="dashboard">

        {/* CALENDAR */}
        <section className="calendar-section">
          <div className="card calendar-card">
            <h3 className="card-title">Calendar</h3>

            {/* FIX: Wrapper div to prevent FullCalendar React error */}
            <div className="fc-wrapper">
              <FullCalendar
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                events={events}
                dateClick={handleDateClick}
                height={480}
                headerToolbar={{
                  left: "prev,next",
                  center: "title",
                  right: "",
                }}
              />
            </div>
          </div>
        </section>

        {/* UPCOMING EVENTS */}
        <section className="events-section">
          <div className="card events-card">
            <h3 className="card-title">Upcoming Events</h3>

            <ul className="event-list">
              {selectedEvents.length === 0 ? (
                <li className="event-item">Select a day to view events.</li>
              ) : (
                selectedEvents.map((ev, index) => (
                  <li key={index} className="event-item">
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

        {/* NOTIFICATIONS */}
        <section className="notifications-section">
          <div className="card notifications-card">
            <h3 className="card-title">Notifications</h3>

            <label>Set reminder:</label>
            <input type="checkbox" />

            <label>Email reminder:</label>
            <input type="checkbox" />

            <select className="dropdown">
              <option>How far in advance...</option>
            </select>

            <select className="dropdown">
              <option>Input Event...</option>
            </select>
          </div>
        </section>

        {/* HISTORY */}
        <section className="history-section">
          <div className="card history-card">
            <h3 className="card-title">Participation History</h3>

            <ul className="event-list">
              <li className="event-item">Event Name — October 12, 2025</li>
              <li className="event-item">Event Name — October 12, 2025</li>
              <li className="event-item">Event Name — October 12, 2025</li>
            </ul>
          </div>
        </section>

        {/* RECENT NOTIFICATIONS */}
        <section className="recent-section">
          <div className="card recent-card">
            <h3 className="card-title">Recent Notifications</h3>

            <ul className="event-list">
              <li className="event-item">Event Name — October 12, 2025</li>
              <li className="event-item">Event Name — October 12, 2025</li>
              <li className="event-item">Event Name — October 12, 2025</li>
            </ul>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}


export default CalendarPage;
