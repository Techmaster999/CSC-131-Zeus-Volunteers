import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import EventCard from "../components/EventCard";
import Footer from "../components/Footer";

import "../styles/globals.css";
import "../styles/style.css";
import "../styles/styleguide.css";

function EventBrowsingPage() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    async function loadEvents() {
      try {
        const res = await fetch("http://localhost:5001/api/events");
        const json = await res.json();

        console.log("EVENT RESPONSE:", json);

        // Proper backend support
        if (json.success && Array.isArray(json.data)) {
          setEvents(json.data);
        } else if (Array.isArray(json)) {
          setEvents(json);
        } else {
          setEvents([]);
        }

      } catch (err) {
        console.error("Error loading events:", err);
      }
    }

    loadEvents();
  }, []);

  return (
    <>
      <Header />

      <main className="event-browsing-page">
        <section className="filter-top">
          <p>Showing {events.length} Results</p>

          <div className="filter-right">
            <label>Sort by:</label>
            <select className="sort-select">
              <option>Most Recent</option>
              <option>Upcoming</option>
            </select>
          </div>
        </section>

        <div className="event-browsing-content">
          <Sidebar />

          <section className="event-list">
            {events.map(event => (
              <EventCard key={event._id} event={event} />
            ))}
          </section>
        </div>

        <Footer />
      </main>
    </>
  );
}

export default EventBrowsingPage;
