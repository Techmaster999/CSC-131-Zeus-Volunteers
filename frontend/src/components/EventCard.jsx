import React from "react";
import { Link } from "react-router-dom";
import "../styles/EventCard.css";

function EventCard({ event, isRegistered = false }) {
  const {
    _id,
    eventName,
    organizer,
    date,
    time,
    details,
    imageUrl
  } = event;

  const rotatingImages = [
    "/img/clean1.jpg",
    "/img/clean2.jpg",
    "/img/clean3.jpg",
    "/img/clean4.jpg",
    "/img/clean5.jpg",
    "/img/clean6.jpg"
  ];

  const index = Math.abs(_id.charCodeAt(0) % rotatingImages.length);
  const finalImage = imageUrl || rotatingImages[index];

  return (
    <Link
      to={`/events/${_id}`}
      className="event-card"
      style={{
        opacity: isRegistered ? 0.9 : 1,
        backgroundColor: isRegistered ? "#ffe6e6" : "white",
        border: "2px solid " + (isRegistered ? "#ff4444" : "#ddd")
      }}
    >
      {isRegistered && (
        <div className="registered-badge">✓ Registered</div>
      )}

      <img
        src={finalImage}
        alt={eventName}
        className="event-card-img"
      />

      <div className="event-card-content">
        <h3 className="event-card-title">{eventName}</h3>

        <p><strong>Organizer:</strong> {organizer}</p>
        <p><strong>Date:</strong> {new Date(date).toLocaleDateString()}</p>
        <p><strong>Time:</strong> {time}</p>

        <p className="details">
          {details ? details.substring(0, 60) + "..." : "No details available"}
        </p>
      </div>
    </Link>
  );
}

export default EventCard;
