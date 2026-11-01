import { Link, NavLink, useNavigate } from "react-router-dom";
import { CalendarDays, Ticket, LogOut, UserCircle } from "lucide-react";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="nav-container">
        <Link to="/" className="brand">
          <span className="brand-icon">
            <CalendarDays size={23} />
          </span>
          <span>
            Event<span className="gradient-text">Sphere</span>
          </span>
        </Link>

        <nav className="nav-links">
          <NavLink to="/" end>
            Home
          </NavLink>

          <NavLink to="/events">
            Explore Events
          </NavLink>

          {token && (
            <NavLink to="/my-bookings">
              <Ticket size={16} />
              My Bookings
            </NavLink>
          )}

          {token && user?.role === "admin" && (
            <NavLink to="/admin">Admin Dashboard</NavLink>
          )}
        </nav>

        <div className="nav-actions">
          {token ? (
            <>
              <span className="user-greeting">
                <UserCircle size={17} />
                {user?.name || "User"}
              </span>

              <button className="btn btn-secondary logout-btn" onClick={logout}>
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="login-link">
                Login
              </Link>

              <Link to="/signup" className="btn btn-primary nav-signup">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;