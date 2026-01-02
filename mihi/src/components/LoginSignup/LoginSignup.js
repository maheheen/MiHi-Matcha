import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./LoginSignup.css";

const LoginSignup = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [role, setRole] = useState("customer");

  const handleSubmit = () => {
    if (!name.trim()) {
      alert("Please enter your name!");
      return;
    }

    login(role, name);

    if (role === "admin") {
      navigate("/admin/dashboard");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-tabs">
          <button
            className={isLogin ? "active" : ""}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={!isLogin ? "active" : ""}
            onClick={() => setIsLogin(false)}
          >
            Signup
          </button>
        </div>

        <h2>{isLogin ? "Login" : "Create Account"}</h2>

        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="customer">Customer</option>
          <option value="admin">Admin</option>
        </select>

        <button className="auth-btn" onClick={handleSubmit}>
          {isLogin ? "Login" : "Signup"}
        </button>
      </div>
    </div>
  );
};

export default LoginSignup;
