import { Link } from "react-router-dom";
import { ShieldCheck, CalendarDays, ArrowRight } from "lucide-react";

function AdminDashboard() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!token) {
    return (
      <div className="container section">
        <div className="empty-events">
          <ShieldCheck size={40} />
          <h2>Login Required</h2>
          <p>Please log in to access the dashboard.</p>
          <Link to="/login" className="btn btn-primary">
            Login <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    );
  }

  if (user?.role !== "admin") {
    return (
      <div className="container section">
        <div className="empty-events">
          <ShieldCheck size={40} />
          <h2>Access Denied</h2>
          <p>This dashboard is available to administrators only.</p>
          <Link to="/" className="btn btn-primary">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section className="section">
      <div className="container">
        <span className="section-eyebrow">ADMINISTRATION</span>
        <h1 className="section-title">
          Admin <span className="gradient-text">Dashboard</span>
        </h1>

        <p className="section-description">
          Welcome, {user?.name || "Admin"}! Manage your event platform here.
        </p>

        <div className="empty-events">
          <div className="empty-events-icon">
            <CalendarDays size={34} />
          </div>

          <h2>Event Management</h2>
          <p>
            Your admin dashboard is ready. We will add event creation,
            editing, and deletion features in the next step.
          </p>

          <Link to="/events" className="btn btn-primary">
            View Events <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default AdminDashboard;