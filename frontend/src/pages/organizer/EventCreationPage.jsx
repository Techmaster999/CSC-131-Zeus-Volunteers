// src/pages/EventCreationPage.jsx
import React, { useState } from "react";
import NavigationBar from "../../components/NavigationBar";
import Footer from "../../components/Footer";

import "../../styles/eventCreationPage.css";


function EventCreationPage() {
  const [eventData, setEventData] = useState({
    title: "",
    datetime: "",
    location: "",
    announcements: "",
    info: "",
    commitments: "",
  });

  function handleChange(e) {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log("Submitting event:", eventData);
  }

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <NavigationBar />

        <main className="event-create-container" style={{ flex: 1 }}>
          <form className="event-create-form" onSubmit={handleSubmit}>
            <div className="event-create-top">
              <div className="left-fields">
                <label>Event Title:</label>
                <input
                  type="text"
                  name="title"
                  onChange={handleChange}
                  placeholder="Enter Event Title"
                />

                <label>Date and Time:</label>
                <input
                  type="text"
                  name="datetime"
                  placeholder="Date and Time"
                  onChange={handleChange}
                />

                <label>Location:</label>
                <input
                  type="text"
                  name="location"
                  placeholder="Exact Address"
                  onChange={handleChange}
                />
              </div>

              <div className="image-upload-box">
                <p>Insert Image Here</p>
              </div>
            </div>

            <label>Announcements</label>
            <textarea
              name="announcements"
              onChange={handleChange}
              placeholder="Enter event announcement…"
            ></textarea>

            <label>Volunteering Info</label>
            <textarea
              name="info"
              onChange={handleChange}
              placeholder="Add volunteering info…"
            ></textarea>

            <label>Commitments</label>
            <textarea
              name="commitments"
              onChange={handleChange}
              placeholder="Type of volunteering needed…"
            ></textarea>

            <div className="center-btn">
              <button type="submit" className="blue-btn">
                Volunteer Today!
              </button>
            </div>
          </form>
        </main>

        <Footer />
      </div>
    </>
  );
}

export default EventCreationPage;
