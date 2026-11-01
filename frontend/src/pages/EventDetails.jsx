import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
CalendarDays,
MapPin,
Ticket,
ArrowLeft,
Minus,
Plus,
ShieldCheck,
} from "lucide-react";
import api from "../services/api";

function EventDetails() {
const { id } = useParams();
const navigate = useNavigate();

const [event, setEvent] = useState(null);
const [quantity, setQuantity] = useState(1);
const [loading, setLoading] = useState(true);
const [booking, setBooking] = useState(false);
const [error, setError] = useState("");

useEffect(() => {
let active = true;

async function fetchEvent() {
  try {
    setLoading(true);
    setError("");

    const response = await api.get(`/events/${id}`);

    const eventData = response.data.event || response.data;

    if (!eventData?._id) {
      throw new Error("Event data nahi mila.");
    }

    if (active) {
      setEvent(eventData);
    }
  } catch (err) {
    if (active) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Event load nahi ho saka."
      );
    }
  } finally {
    if (active) {
      setLoading(false);
    }
  }
}

if (id) {
  fetchEvent();
} else {
  setError("Invalid event ID.");
  setLoading(false);
}

return () => {
  active = false;
};

}, [id]);

async function handleBooking() {
setError("");

const token = localStorage.getItem("token");

if (!token) {
  navigate("/login");
  return;
}

if (!event?._id) {
  setError("Valid event ID are Not Found please Refresh Page");
  return;
}

const tickets = Number(quantity);

if (!Number.isInteger(tickets) || tickets < 1 || tickets > 10) {
  setError("Quantity 1 se 10 ke beech honi chahiye.");
  return;
}

if (tickets > Number(event.availableTickets)) {
  setError("Itne tickets available nahi hain.");
  return;
}

try {
  setBooking(true);

  const response = await api.post("/bookings", {
    eventId: event._id,
    quantity: tickets,
  });

  if (response.status === 201) {
    window.alert("Booking successful! My Bookings page par QR Code dekhein.");
    navigate("/my-bookings");
  }
} catch (err) {
  setError(
    err.response?.data?.message ||
      "Booking fail ho gayi. Please dobara try karein."
  );
} finally {
  setBooking(false);
}

}

if (loading) {
return (
<div className="container section">
<p>Event load ho raha hai...</p>
</div>
);
}

if (error && !event) {
return (
<div className="container section">
<h2>Event load nahi hua</h2>
<p>{error}</p>
<Link to="/events" className="btn btn-primary">
Back to Events
</Link>
</div>
);
}

if (!event) {
return (
<div className="container section">
<h2>Event are not found</h2>
<Link to="/events" className="btn btn-primary">
Back to Events
</Link>
</div>
);
}

const eventDate = new Date(event.date);
const isFutureEvent = eventDate.getTime() > Date.now();
const availableTickets = Number(event.availableTickets || 0);
const price = Number(event.price || 0);

return (
<section className="container section">
<Link to="/events" className="btn">
<ArrowLeft size={17} />
Back to Events
</Link>

  <div className="event-details-layout">
    <div className="event-details-main">
      <div className="event-details-image">
        <img
          src={
            event.image ||
            "https://images.unsplash.com/photo-1492684223066-81342ee5ff30"
          }
          alt={event.title}
        />
      </div>

      <span className="badge">{event.category}</span>

      <h1 className="section-title">{event.title}</h1>

      <p className="section-description">
        {event.description}
      </p>

      <div className="event-details-info">
        <div>
          <CalendarDays size={20} />
          <div>
            <strong>Date & Time</strong>
            <p>
              {eventDate.toLocaleString("en-IN", {
                day: "2-digit",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>

        <div>
          <MapPin size={20} />
          <div>
            <strong>Location</strong>
            <p>{event.location}</p>
          </div>
        </div>

        <div>
          <Ticket size={20} />
          <div>
            <strong>Available Tickets</strong>
            <p>{availableTickets}</p>
          </div>
        </div>
      </div>
    </div>

    <aside className="event-booking-panel">
      <span className="event-booking-label">Ticket Price</span>

      <h2>
        ₹{price.toLocaleString("en-IN")}
        <small> / ticket</small>
      </h2>

      <div className="booking-quantity-control">
        <span>Number of tickets</span>

        <div className="quantity-buttons">
          <button
            type="button"
            aria-label="Decrease tickets"
            disabled={quantity <= 1}
            onClick={() =>
              setQuantity((current) => Math.max(1, current - 1))
            }
          >
            <Minus size={17} />
          </button>

          <strong>{quantity}</strong>

          <button
            type="button"
            aria-label="Increase tickets"
            disabled={
              quantity >= 10 || quantity >= availableTickets
            }
            onClick={() =>
              setQuantity((current) =>
                Math.min(10, availableTickets, current + 1)
              )
            }
          >
            <Plus size={17} />
          </button>
        </div>
      </div>

      <div className="booking-total">
        <span>Total Amount</span>
        <strong>
          ₹{(price * quantity).toLocaleString("en-IN")}
        </strong>
      </div>

      {error && (
        <div className="booking-inline-error" role="alert">
          {error}
        </div>
      )}

      <button
        type="button"
        className="btn btn-primary event-book-button"
        onClick={handleBooking}
        disabled={
          booking ||
          !isFutureEvent ||
          availableTickets < 1 ||
          quantity > availableTickets
        }
      >
        {booking
          ? "Booking..."
          : !isFutureEvent
          ? "Event Ended"
          : availableTickets < 1
          ? "Sold Out"
          : "Book Tickets"}
      </button>

      <div className="booking-security-note">
        <ShieldCheck size={17} />
        <span>Secure booking with booking reference</span>
      </div>
    </aside>
  </div>
</section>

);
}

export default EventDetails;