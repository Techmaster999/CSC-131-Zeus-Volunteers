import React from "react";
import { Link } from "react-router-dom";
import "../styles/EventCard.css";
import API_URL from "../config";

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

  // Logic: 
  // 1. If imageUrl starts with 'http', it's external (keep as is).
  // 2. If imageUrl exists but is relative (e.g. /uploads/...), prepend API_URL.
  // 3. Fallback to rotating static images (served from public folder).
  let finalImage;
  if (imageUrl) {
    if (imageUrl.startsWith("http")) {
      finalImage = imageUrl;
    } else {
      finalImage = `${API_URL}${imageUrl}`;
    }
  } else {
    finalImage = rotatingImages[index];
  }

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
