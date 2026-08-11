import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { login, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    navigate("/dashboard");
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    const result = await login(
      formData.username,
      formData.password
    );

    setLoading(false);

    if (!result.success) {
      setError(result.message);
      return;
    }

    const from =
      location.state?.from?.pathname || "/dashboard";

    navigate(from, { replace: true });
  };

  return (
    <div className="new-login-page">

      {/* Left section */}
      <div className="login-brand-section">
        <div className="brand-content">
          <div className="brand-logo">W</div>

          <h1>WorkSpace</h1>

          <p>
            A simple and secure workspace for
            managing your team's activities.
          </p>

          <div className="feature-list">
            <div className="feature-item">
              <span>✓</span>
              <p>Secure access</p>
            </div>

            <div className="feature-item">
              <span>✓</span>
              <p>Role-based permissions</p>
            </div>

            <div className="feature-item">
              <span>✓</span>
              <p>Organized workspace</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right section */}
      <div className="login-form-section">
        <div className="login-form-container">

          <div className="mobile-logo">
            <div className="brand-logo">W</div>
            <span>WorkSpace</span>
          </div>

          <div className="login-heading">
            <p className="small-heading">
              ACCOUNT ACCESS
            </p>

            <h2>Welcome back</h2>

            <p>
              Sign in to continue to your workspace.
            </p>
          </div>

          <form onSubmit={handleSubmit}>

            <div className="input-group">
              <label htmlFor="username">
                Username
              </label>

              <input
                id="username"
                type="text"
                name="username"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">
                Password
              </label>

              <input
                id="password"
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {error && (
              <div className="login-error">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="login-submit-btn"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>

          </form>

          <p className="login-footer">
            Authorized users only
          </p>

        </div>
      </div>

    </div>
  );
};

export default Login;