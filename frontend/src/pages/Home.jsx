import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  Ticket,
  Sparkles,
  ShieldCheck,
  Users,
} from "lucide-react";

import api from "../services/api";
import EventCard from "../components/EventCard";

function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get("/events");

        const eventList = Array.isArray(response.data)
          ? response.data
          : response.data.events || [];

        setEvents(eventList.slice(0, 6));
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Events load nahi ho paaye. Backend check karein."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-orb hero-orb-one"></div>
        <div className="hero-orb hero-orb-two"></div>

        <div className="container hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <Sparkles size={16} />
              Discover experiences that matter
            </div>

            <h1>
              Your Next Great
              <br />
              Experience Starts
              <br />
              <span className="gradient-text">Right Here.</span>
            </h1>

            <p className="hero-description">
              Discover incredible events, connect with amazing people,
              and create memories that last a lifetime. Your next adventure
              is just one click away.
            </p>

            <div className="hero-buttons">
              <Link to="/events" className="btn btn-primary hero-primary-btn">
                Explore Events <ArrowRight size={19} />
              </Link>

              <Link to="/signup" className="btn btn-secondary hero-secondary-btn">
                Join EventSphere
              </Link>
            </div>

            <div className="hero-trust">
              <div className="trust-icon">
                <ShieldCheck size={18} />
              </div>

              <span>Simple booking. Memorable experiences.</span>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-image-main">
              <img
                src="https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1100&q=85"
                alt="Live music event with a crowd"
              />

              <div className="hero-image-overlay"></div>

              <div className="hero-image-caption">
                <span className="live-dot"></span>
                Discover your next experience
              </div>
            </div>

            <div className="floating-card floating-card-top">
              <div className="floating-card-icon purple-icon">
                <CalendarDays size={20} />
              </div>
              <div>
                <strong>Unforgettable</strong>
                <span>Live experiences</span>
              </div>
            </div>

            <div className="floating-card floating-card-bottom">
              <div className="floating-card-icon cyan-icon">
                <Ticket size={20} />
              </div>
              <div>
                <strong>Easy Booking</strong>
                <span>Your tickets, simplified</span>
              </div>
            </div>
          </div>
        </div>

        <div className="hero-bottom-glow"></div>
      </section>

      <section className="features-section">
        <div className="container features-grid">
          <div className="feature-item">
            <div className="feature-icon purple-icon">
              <CalendarDays size={23} />
            </div>
            <div>
              <h3>Discover Events</h3>
              <p>Find experiences you love.</p>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-icon cyan-icon">
              <Ticket size={23} />
            </div>
            <div>
              <h3>Easy Booking</h3>
              <p>Reserve tickets in minutes.</p>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-icon purple-icon">
              <ShieldCheck size={23} />
            </div>
            <div>
              <h3>Secure Accounts</h3>
              <p>Your account stays protected.</p>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-icon cyan-icon">
              <Users size={23} />
            </div>
            <div>
              <h3>Great Experiences</h3>
              <p>Make every moment count.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section upcoming-section">
        <div className="container">
          <div className="section-heading-row">
            <div>
              <span className="section-eyebrow">WHAT'S HAPPENING</span>
              <h2 className="section-title">
                Upcoming <span className="gradient-text">Events</span>
              </h2>
              <p className="section-description">
                Explore events picked for your next memorable experience.
              </p>
            </div>

            <Link to="/events" className="view-all-link">
              View All Events <ArrowRight size={18} />
            </Link>
          </div>

          {loading ? (
            <div className="loading">
              <div className="loading-spinner"></div>
              <p>Discovering amazing events...</p>
            </div>
          ) : error ? (
            <div className="empty-state">
              <p>{error}</p>
              <button
                className="btn btn-primary"
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
            </div>
          ) : events.length > 0 ? (
            <div className="events-grid">
              {events.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          ) : (
            <div className="empty-events">
              <div className="empty-events-icon">
                <CalendarDays size={34} />
              </div>

              <h3>No Events Yet</h3>

              <p>
                Exciting events will appear here once an administrator
                adds them.
              </p>

              <Link to="/events" className="btn btn-primary">
                Explore Events <ArrowRight size={18} />
              </Link>
            </div>
          )}

          <div className="events-bottom-cta">
            <p>Looking for something exciting?</p>
            <Link to="/events">
              Discover all events <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <div className="cta-card">
            <div className="cta-decoration cta-decoration-one"></div>
            <div className="cta-decoration cta-decoration-two"></div>

            <div className="cta-content">
              <span className="section-eyebrow">YOUR NEXT ADVENTURE</span>

              <h2>
                Make Your Next
                <br />
                <span className="gradient-text">Moment Unforgettable.</span>
              </h2>

              <p>
                Join EventSphere and discover experiences worth remembering.
              </p>

              <Link to="/signup" className="btn btn-primary hero-primary-btn">
                Get Started Today <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;