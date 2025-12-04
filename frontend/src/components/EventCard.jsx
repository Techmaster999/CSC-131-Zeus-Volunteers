import React from "react";
import { Link } from "react-router-dom";
import "../styles/EventCard.css";

function EventCard({ event }) {
  const {
    _id,
    eventName,
    organizer,
    date,
    time,
    details,
    imageUrl
  } = event;

  // Predefined rotating images
  const rotatingImages = [
    "/img/clean1.jpg",
    "/img/clean2.jpg",
    "/img/clean3.jpg",
    "/img/clean4.jpg",
    "/img/clean5.jpg",
    "/img/clean6.jpg"
  ];

  // Deterministically pick one image based on ID
  const index = Math.abs(_id.charCodeAt(0) % rotatingImages.length);
  const finalImage = imageUrl || rotatingImages[index];

  return (
    <Link to={`/events/${_id}`} className="event-card">
      <img
        src={finalImage}
        alt={eventName}
        className="event-card-img"
      />

      <h3>{eventName}</h3>

      <p><strong>Organizer:</strong> {organizer}</p>

      <p><strong>Date:</strong> {new Date(date).toLocaleDateString()}</p>
      <p><strong>Time:</strong> {time}</p>

      <p className="details">
        {details ? details.substring(0, 60) + "..." : "No details available"}
      </p>
    </Link>
  );
}

export default EventCard;
