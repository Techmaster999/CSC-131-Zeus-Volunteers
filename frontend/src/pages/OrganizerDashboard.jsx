import React, { useEffect, useState } from "react";
import NavigationBar from "../components/NavigationBar";
import { useAuth } from "../context/AuthContext";

function OrganizerDashboard() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Fetch events created by this organizer
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("http://localhost:5001/api/events?organizer=" + user._id);
        const data = await res.json();
        setEvents(data);
        if (data.length > 0) setSelectedEvent(data[0]);
      } catch (err) {
        console.error("Error loading organizer events:", err);
      }
    }

    if (user) fetchData();
  }, [user]);

  return (
    <>
      <NavigationBar />

      <div className="organizer-dashboard-container">
        {/* LEFT PROFILE SECTION */}
        <div className="profile-section">
          <img src="/img/user.jpg" alt="profile" className="profile-pic" />

          <h2>{user?.firstName} {user?.lastName}</h2>
          <p>Email: {user?.email}</p>
          <p>City: {user?.city}</p>
          <p>State: {user?.state}</p>
          <p>Total Events Volunteered: {user?.eventCount || 0}</p>
        </div>

        {/* MAIN DASHBOARD GRID */}
        <div className="dashboard-grid">

          {/* LEFT: UPCOMING EVENTS LIST */}
          <div className="events-list">
            <h3>Upcoming Events</h3>

            {events.length === 0 && <p>No events yet.</p>}

            {events.map((event) => (
              <div
                key={event._id}
                className={`event-item ${selectedEvent?._id === event._id ? "active" : ""}`}
                onClick={() => setSelectedEvent(event)}
              >
                <h4>{event.eventName}</h4>
                <p>{event.details}</p>
                <span>{new Date(event.date).toLocaleDateString()}</span>
              </div>
            ))}
          </div>

          {/* RIGHT: SELECTED EVENT CARD */}
          <div className="event-preview-card">
            {selectedEvent ? (
              <>
                <img
                  src={selectedEvent.image || "/img/placeholder.png"}
                  alt="Event"
                  className="event-card-img"
                />

                <h3>{selectedEvent.eventName}</h3>
                <p><b>Org:</b> {user.firstName}</p>
                <p><b>Date:</b> {selectedEvent.date}</p>
                <p><b>Volunteers:</b> {selectedEvent.volunteerCount || 0}</p>

                <Link to={`/events/${selectedEvent._id}`}>View Details </Link>
              </>
            ) : (
              <p>Select an event to preview.</p>
            )}
          </div>
        </div>

        {/* BUTTONS */}
        <div className="dashboard-buttons">
          <Link to="/calendar" className="btn-large">Calendar</Link>
          <Link to="/events/create" className="btn-large">Create New Event</Link>
          <Link to="/organizer/announcements" className="btn-large">Make Announcements</Link>
          <Link to="/organizer/edit" className="btn-outline">Edit Event Details</Link>
        </div>
      </div>
    </>
  );
}

export default OrganizerDashboard;
