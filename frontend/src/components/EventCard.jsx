import React from "react";
import { Link } from "react-router-dom";


function EventCard({ id, img, title, org, date, volunteers }) {
  return (
    <Link to={`/event/${id}`} className="event-card-link">
      <div className="event-card">
        <img src={img} alt={title} />
        <h3>{title}</h3>
        <p>{org}</p>
        <p>{date}</p>
        <p>{volunteers} volunteers</p>
      </div>
    </Link>
  );
}
export default EventCard;
