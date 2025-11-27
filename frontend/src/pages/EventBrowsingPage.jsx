import React from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import EventCard from "../components/EventCard";
import Footer from "../components/Footer";

import "../styles/globals.css";
import "../styles/style.css";
import "../styles/styleguide.css";


function EventBrowsingPage() {
  const eventData = [
    { img: "/img/clean1.jpg", title: "Community Clean up", org: "Cleanup Sacramento", date: "10/25/2025 at 2:30pm", volunteers: "100/250" },
    { img: "/img/clean2.jpg", title: "Community Clean up", org: "Cleanup Sacramento", date: "10/25/2025 at 2:30pm", volunteers: "100/250" },
    { img: "/img/clean3.jpg", title: "Community Clean up", org: "Cleanup Sacramento", date: "10/25/2025 at 2:30pm", volunteers: "100/250" },

    { img: "/img/clean4.jpg", title: "Community Clean up", org: "Cleanup Sacramento", date: "10/25/2025 at 2:30pm", volunteers: "100/250" },
    { img: "/img/clean5.jpg", title: "Community Clean up", org: "Cleanup Sacramento", date: "10/25/2025 at 2:30pm", volunteers: "100/250" },
    { img: "/img/clean6.jpg", title: "Community Clean up", org: "Cleanup Sacramento", date: "10/25/2025 at 2:30pm", volunteers: "100/250" },
  ];

  return (
    <>
      <Header />

      <main className="event-browsing-page">
        {/* FILTER BAR */}
        <section className="filter-top">
          <p>Showing {eventData.length} Results</p>

          <div className="filter-right">
            <label>Sort by:</label>
            <select className="sort-select">
              <option>Most Recent</option>
              <option>Upcoming</option>
            </select>
          </div>
        </section>

        {/* SEARCH BAR */}
        <section className="search-section">
          <div className="search-field">
            <label>Search By Keyword...</label>
            <input type="text" placeholder="Search By Keyword..." />
          </div>

          <div className="search-field">
            <label>Location</label>
            <select>
              <option>Input Location...</option>
            </select>
          </div>
        </section>

       {/* MAIN LAYOUT */}
<div className="event-browsing-content">
  <Sidebar />

  <section className="event-list">
    {eventData.map((event, index) => (
      <EventCard key={index} {...event} />
    ))}
  </section>
</div>


        <Footer />
      </main>
    </>
  );
}

export default EventBrowsingPage;
