import React, { useState } from "react";
import "../styles/login.css"; // We are only using the shared style now
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(username, password);
      navigate("/admin");
    } catch (err) {
      setError("Invalid admin credentials");
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-box">
        <h2>Admin Login</h2>
        
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username or Email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoFocus
          />
          
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="error">{error}</p>}

          {/* Added the extra 'admin-btn' class here to override the color */}
          <button type="submit" className="login-btn admin-btn">
            Login
          </button>

          <div style={{ marginTop: "15px", display: "flex", flexDirection: "column", gap: "10px" }}>
             <span className="forgot-password">Forgot Password?</span>
             <span className="forgot-password" style={{ color: "#FFC300" }}>New Admin Account?</span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;