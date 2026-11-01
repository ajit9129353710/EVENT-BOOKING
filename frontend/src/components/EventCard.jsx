import { Link } from "react-router-dom";
import { CalendarDays, MapPin, Ticket, ArrowUpRight } from "lucide-react";

function EventCard({ event }) {
  const eventDate = event?.date
    ? new Date(event.date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Date unavailable";

  const imageUrl =
    event?.image ||
    "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=900&q=80";

  return (
    <article className="event-card">
      <Link
        to={`/events/${event._id}`}
        className="event-image-link"
        aria-label={`View ${event.title}`}
      >
        <div className="event-image-wrapper">
          <img
            src={imageUrl}
            alt={event.title}
            className="event-image"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src =
                "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=80";
            }}
          />

          <span className="event-category">
            {event.category || "General"}
          </span>
        </div>
      </Link>

      <div className="event-card-content">
        <h3>{event.title}</h3>

        <p className="event-description">
          {event.description
            ? `${event.description.slice(0, 100)}${
                event.description.length > 100 ? "..." : ""
              }`
            : "Join this exciting event and make unforgettable memories."}
        </p>

        <div className="event-meta">
          <span>
            <CalendarDays size={16} />
            {eventDate}
          </span>

          <span>
            <MapPin size={16} />
            {event.location || "Location TBA"}
          </span>

          <span>
            <Ticket size={16} />
            {event.availableTickets ?? 0} tickets left
          </span>
        </div>

        <div className="event-card-bottom">
          <div className="event-price">
            <small>Starting from</small>
            <strong>
              {Number(event.price) === 0
                ? "FREE"
                : `₹${Number(event.price).toLocaleString("en-IN")}`}
            </strong>
          </div>

          <Link
            to={`/events/${event._id}`}
            className="btn btn-primary event-details-btn"
          >
            Explore <ArrowUpRight size={17} />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default EventCard;