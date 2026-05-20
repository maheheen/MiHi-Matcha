import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./LoginSignup.css";

const LoginSignup = () => {
  const { login, register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async () => {
    setError("");

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }
    if (!isLogin && !formData.name) {
      setError("Please enter your name");
      return;
    }

    setLoading(true);

    try {
      let user;
      if (isLogin) {
        user = await login(formData.email, formData.password);
      } else {
        user = await register(formData.name, formData.email, formData.password);
      }

      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">

        {/* Logo / Brand */}
        <div className="auth-brand">
          <span className="auth-brand-mihi">miHI</span>
          <span className="auth-brand-matcha"> Matcha</span>
        </div>

        {/* Tabs */}
        <div className="auth-tabs">
          <button
            className={isLogin ? "active" : ""}
            onClick={() => { setIsLogin(true); setError(""); }}
          >
            Login
          </button>
          <button
            className={!isLogin ? "active" : ""}
            onClick={() => { setIsLogin(false); setError(""); }}
          >
            Sign Up
          </button>
        </div>

        <h2>{isLogin ? "Welcome Back 👋" : "Create Account 🍵"}</h2>
        <p className="auth-subtitle">
          {isLogin ? "Sign in to your miHI Matcha account" : "Join the matcha family today"}
        </p>

        {/* Fields */}
        {!isLogin && (
          <div className="auth-field">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="e.g. Abdullah Khan"
              value={formData.name}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
          </div>
        )}

        <div className="auth-field">
          <label>Email Address</label>
          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
        </div>

        <div className="auth-field">
          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
        </div>

        {/* Error */}
        {error && <div className="auth-error">{error}</div>}

        {/* Submit */}
        <button
          className={`auth-btn ${loading ? "loading" : ""}`}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Please wait..." : isLogin ? "Login" : "Sign Up"}
        </button>

        {/* Switch */}
        <p className="auth-switch">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span onClick={() => { setIsLogin(!isLogin); setError(""); }}>
            {isLogin ? "Sign Up" : "Login"}
          </span>
        </p>

      </div>
    </div>
  );
};

export default LoginSignup;