import { CalendarDays, ArrowUp } from "lucide-react";
import { Link } from "react-router-dom";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-main">
          <div className="footer-brand">
            <Link to="/" className="brand">
              <span className="brand-icon">
                <CalendarDays size={22} />
              </span>

              <span>
                Event<span className="gradient-text">Sphere</span>
              </span>
            </Link>

            <p>
              Discover amazing events, connect with people, and create
              unforgettable memories.
            </p>
          </div>

          <div className="footer-links">
            <h4>Explore</h4>
            <Link to="/">Home</Link>
            <Link to="/events">All Events</Link>
            <Link to="/my-bookings">My Bookings</Link>
          </div>

          <div className="footer-links">
            <h4>Account</h4>
            <Link to="/login">Login</Link>
            <Link to="/signup">Create Account</Link>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {year} EventSphere. Built with care.</p>

          <button
            type="button"
            className="back-to-top"
            onClick={() =>
              window.scrollTo({ top: 0, behavior: "smooth" })
            }
          >
            Back to top <ArrowUp size={15} />
          </button>
        </div>
      </div>
    </footer>
  );
}

export default Footer;