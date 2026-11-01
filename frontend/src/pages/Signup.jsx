import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
UserPlus,
User,
Mail,
Lock,
LoaderCircle,
} from "lucide-react";
import api from "../services/api";

function Signup() {
const navigate = useNavigate();

const [form, setForm] = useState({
name: "",
email: "",
password: "",
});

const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
const [success, setSuccess] = useState("");

const handleChange = (e) => {
setForm({
...form,
[e.target.name]: e.target.value,
});
};

const handleSubmit = async (e) => {
e.preventDefault();
setError("");
setSuccess("");

if (form.password.length < 6) {
  setError("Password kam se kam 6 characters ka hona chahiye.");
  return;
}

try {
  setLoading(true);

  await api.post("/auth/signup", form);

  setSuccess("Account successfully create ho gaya! Ab login karein.");

  setTimeout(() => {
    navigate("/login");
  }, 1200);
} catch (err) {
  setError(
    err.response?.data?.message ||
      err.response?.data?.error ||
      "Signup failed. Email pehle se registered ho sakta hai."
  );
} finally {
  setLoading(false);
}

};

return (
<section className="section">
<div className="container">
<div className="form-container">
<div className="form-header">
<div className="empty-events-icon">
<UserPlus size={30} />
</div>

        <h1 className="section-title">
          Create Your <span className="gradient-text">Account</span>
        </h1>

        <p className="section-description">
          Join EventSphere and discover amazing experiences.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Full Name</label>

          <div className="input-with-icon">
            <User size={18} />

            <input
              id="name"
              type="text"
              name="name"
              className="form-control"
              placeholder="Enter your full name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address</label>

          <div className="input-with-icon">
            <Mail size={18} />

            <input
              id="email"
              type="email"
              name="email"
              className="form-control"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>

          <div className="input-with-icon">
            <Lock size={18} />

            <input
              id="password"
              type="password"
              name="password"
              className="form-control"
              placeholder="Create a password (minimum 6 characters)"
              value={form.password}
              onChange={handleChange}
              minLength={6}
              required
            />
          </div>
        </div>

        {error && (
          <p
            role="alert"
            style={{ color: "#ff6b6b", marginBottom: "16px" }}
          >
            {error}
          </p>
        )}

        {success && (
          <p
            role="status"
            style={{ color: "#4ade80", marginBottom: "16px" }}
          >
            {success}
          </p>
        )}

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
          style={{ width: "100%" }}
        >
          {loading ? (
            <>
              <LoaderCircle size={18} /> Creating Account...
            </>
          ) : (
            <>
              <UserPlus size={18} /> Sign Up
            </>
          )}
        </button>
      </form>

      <p style={{ textAlign: "center", marginTop: "24px" }}>
        Already have an account?{" "}
        <Link to="/login" className="gradient-text">
          Login
        </Link>
      </p>
    </div>
  </div>
</section>

);
}

export default Signup;