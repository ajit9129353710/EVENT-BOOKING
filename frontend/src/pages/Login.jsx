import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn, Mail, Lock, LoaderCircle } from "lucide-react";
import api from "../services/api";

function Login() {
const navigate = useNavigate();

const [form, setForm] = useState({
email: "",
password: "",
});

const [loading, setLoading] = useState(false);
const [error, setError] = useState("");

const handleChange = (e) => {
setForm({
...form,
[e.target.name]: e.target.value,
});
};

const handleSubmit = async (e) => {
e.preventDefault();
setError("");
setLoading(true);

try {
  const response = await api.post("/auth/login", form);
  const data = response.data;

  const token = data.token || data.accessToken;
  const user = data.user;

  if (!token) {
    setError("Login response mein token nahi mila. Backend response check karein.");
    return;
  }

  localStorage.setItem("token", token);

  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
  }

  navigate("/");
  window.location.reload();
} catch (err) {
  setError(
    err.response?.data?.message ||
      err.response?.data?.error ||
      "Login failed. Email aur password check karein."
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
<LogIn size={30} />
</div>

        <h1 className="section-title">
          Welcome <span className="gradient-text">Back</span>
        </h1>

        <p className="section-description">
          Log in to discover and book amazing events.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
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
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {error && (
          <p role="alert" style={{ color: "#ff6b6b", marginBottom: "16px" }}>
            {error}
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
              <LoaderCircle size={18} /> Logging in...
            </>
          ) : (
            <>
              <LogIn size={18} /> Login
            </>
          )}
        </button>
      </form>

      <p style={{ textAlign: "center", marginTop: "24px" }}>
        Don't have an account?{" "}
        <Link to="/signup" className="gradient-text">
          Sign Up
        </Link>
      </p>
    </div>
  </div>
</section>

);
}

export default Login;