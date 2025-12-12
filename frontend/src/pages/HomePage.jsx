import React from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

import "../styles/homepage-global.css";
import "../styles/homepage-style.css";
import "../styles/homepage-styleguide.css";

import { useAuth } from "../context/AuthContext";

function HomePage() {
  const { user } = useAuth();

  // Dummy data for now
  const upcomingEvents = [
    { title: "Community Cleanup", desc: "Cleanup Sacramento", date: "October 22, 2025" },
    { title: "Operation Cleanup Espionage", desc: "Cleanup Rivals", date: "October 22, 2025" },
    { title: "Library Book Reading", desc: "Cleanup Rivals", date: "October 20, 2025" },
    { title: "Cleanup Espionage Planning", desc: "Cleanup Rivals", date: "October 19, 2025" },
  ];

  const history = [
    { title: "Meet and Greet!", org: "Cleanup Sacramento", date: "October 12, 2025" },
    { title: "Spying on Cleanup Sacramento", org: "Cleanup Rivals", date: "October 12, 2025" },
    { title: "Charity Run", org: "Legitimate Laundering Co.", date: "October 3, 2025" },
    { title: "Movie Night", org: "Cleanup Rivals", date: "October 1, 2025" },
  ];

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Header />

        <main className="volunteer-dashboard-page page-container" style={{ flex: 1, width: "100%", margin: "0 auto" }}>
          <div className="dashboard-layout">

            {/* SIDEBAR */}
            <Sidebar />

            {/* MAIN CONTENT */}
            <section className="dashboard-main">

              {/* PROFILE SECTION */}
              <div className="dashboard-profile">
                <div className="avatar-large">👤</div>

                <div className="profile-info">
                  <h2>{user?.firstName} {user?.lastName} ({user?.role})</h2>
                  <p>Email: {user?.email}</p>
                  <p>City: {user?.city}</p>
                  <p>State: {user?.state}</p>
                  <p>Total Events Volunteered: <strong>14</strong></p>
                </div>
              </div>

              {/* TWO-PANEL GRID */}
              <div className="dashboard-panels">

                {/* LEFT PANEL - UPCOMING EVENTS */}
                <div className="dashboard-panel">
                  <h3>Upcoming Events</h3>

                  {upcomingEvents.map((ev, i) => (
                    <div key={i} className="event-row">
                      <div>
                        <h4>{ev.title}</h4>
                        <p>{ev.desc}</p>
                      </div>
                      <span className="event-date">{ev.date}</span>
                    </div>
                  ))}

                  <button className="primary-btn">View Calendar</button>
                </div>

                {/* RIGHT PANEL - FEATURED EVENT */}
                <div className="dashboard-panel">
                  <img
                    src="/img/clean1.jpg"
                    alt="Event Preview"
                    className="featured-img"
                  />

                  <h3>Community Clean Up</h3>
                  <p>Org: Cleanup Sacramento</p>
                  <p>Date: 10/25/2025 at 2:30 PM</p>
                  <p>Volunteers: 100/250</p>

                  <button className="primary-btn">Event Details</button>
                </div>
              </div>

              {/* PARTICIPATION HISTORY */}
              <div className="dashboard-panel history-panel">
                <h3>Participation History</h3>

                {history.map((ev, i) => (
                  <div key={i} className="event-row">
                    <div>
                      <h4>{ev.title}</h4>
                      <p>{ev.org}</p>
                    </div>
                    <span className="event-date">{ev.date}</span>
                  </div>
                ))}

                <button className="primary-btn">Reminders</button>
              </div>

            </section>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}

export default HomePage;
