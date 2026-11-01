import { useEffect, useState } from "react";
import { Search, CalendarDays, LoaderCircle } from "lucide-react";
import api from "../services/api";
import EventCard from "../components/EventCard";

function Events() {
const [events, setEvents] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");
const [search, setSearch] = useState("");
const [category, setCategory] = useState("All");

useEffect(() => {
const fetchEvents = async () => {
try {
setLoading(true);
setError("");

    const response = await api.get("/events");
    const data = response.data;

    setEvents(
      Array.isArray(data)
        ? data
        : Array.isArray(data.events)
          ? data.events
          : []
    );
  } catch (err) {
    setError(
      err.response?.data?.message ||
        "Events load nahi hue. Backend server check karein."
    );
  } finally {
    setLoading(false);
  }
};

fetchEvents();

}, []);

const categories = [
"All",
...new Set(events.map((event) => event.category).filter(Boolean)),
];

const filteredEvents = events.filter((event) => {
const matchesSearch = [
event.title,
event.description,
event.location,
event.category,
]
.filter(Boolean)
.some((value) =>
value.toLowerCase().includes(search.toLowerCase())
);

const matchesCategory =
  category === "All" || event.category === category;

return matchesSearch && matchesCategory;

});

return (
<section className="section">
<div className="container">
<span className="section-eyebrow">DISCOVER EXPERIENCES</span>

    <h1 className="section-title">
      Explore <span className="gradient-text">Events</span>
    </h1>

    <p className="section-description">
      Discover events, find your interests, and reserve your tickets.
    </p>

    <div
      style={{
        display: "flex",
        gap: "14px",
        flexWrap: "wrap",
        margin: "30px 0",
      }}
    >
      <div
        style={{
          flex: "1 1 260px",
          position: "relative",
        }}
      >
        <Search
          size={19}
          style={{
            position: "absolute",
            left: "14px",
            top: "50%",
            transform: "translateY(-50%)",
          }}
        />

        <input
          type="text"
          className="form-control"
          placeholder="Search events, locations..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ paddingLeft: "44px" }}
        />
      </div>

      <select
        className="form-control"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        style={{ flex: "0 1 220px" }}
      >
        {categories.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </div>

    {loading ? (
      <div className="empty-events">
        <LoaderCircle size={30} />
        <p>Loading events...</p>
      </div>
    ) : error ? (
      <div className="empty-events">
        <h2>Something went wrong</h2>
        <p>{error}</p>
      </div>
    ) : filteredEvents.length > 0 ? (
      <div className="events-grid">
        {filteredEvents.map((event) => (
          <EventCard key={event._id} event={event} />
        ))}
      </div>
    ) : (
      <div className="empty-events">
        <div className="empty-events-icon">
          <CalendarDays size={34} />
        </div>

        <h2>No Events Found</h2>

        <p>
          {events.length === 0
            ? "Abhi koi event available nahi hai."
            : "Search ya category change karke dekhein."}
        </p>
      </div>
    )}
  </div>
</section>

);
}

export default Events;