import React from "react";

function EventCard({ img, title, org, date, volunteers }) {
  return (
    <article className="event-card">
      <img src={img} className="event-img" alt={title} />

      <h3>{title}</h3>
      <p>Org: {org}</p>
      <p>{date}</p>
      <p>Volunteers: {volunteers}</p>

     <a href="#">View Details &gt;</a>

    </article>
  );
}

export default EventCard;
