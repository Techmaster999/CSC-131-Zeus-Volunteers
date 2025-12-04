import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const user = await login(identifier, password);

      // Redirect based on role
      if (user.role === "admin") navigate("/dashboard");
      else if (user.role === "organizer") navigate("/organizer");
      else navigate("/home");

    } catch (err) {
      setError("Invalid username/email or password");
    }
  }

  return (
    <div className="login-page-container">
      <div className="login-box">
        <h2>Zeus Volunteers</h2>

        <form onSubmit={handleSubmit}>
          <label>Username or Email</label>
          <input
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="error">{error}</p>}

          <button type="submit" className="login-btn">Login</button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
