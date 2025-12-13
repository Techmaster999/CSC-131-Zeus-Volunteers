import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import NavigationBar from "../components/NavigationBar";
import Footer from "../components/Footer";
import "../styles/login.css";

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await login(identifier, password);
      // Redirect based on role
      if (user.role === "admin") navigate("/admin");
      else if (user.role === "organizer") navigate("/organizer");
      else navigate("/home");

    } catch (err) {
      setError("Invalid username/email or password");
    } finally {
      setLoading(false);
    }
  }

  // Consistent Styles
  const styles = {
    wrapper: {
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh",
      backgroundColor: "#f4f7f6"
    },
    mainContainer: {
      flex: 1,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "40px 20px"
    },
    card: {
      backgroundColor: "white",
      padding: "40px",
      borderRadius: "16px",
      boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
      width: "100%",
      maxWidth: "450px",
      textAlign: "center"
    },
    input: {
      width: "100%",
      padding: "12px 16px",
      borderRadius: "8px",
      border: "1px solid #ddd",
      marginBottom: "20px",
      fontSize: "16px"
    },
    button: {
      width: "100%",
      padding: "14px",
      backgroundColor: "#FFC300",
      color: "#333",
      border: "none",
      borderRadius: "8px",
      fontSize: "16px",
      fontWeight: "700",
      cursor: loading ? "not-allowed" : "pointer",
      transition: "background 0.2s"
    },
    error: {
      backgroundColor: "#fee2e2",
      color: "#dc2626",
      padding: "10px",
      borderRadius: "6px",
      marginBottom: "20px",
      fontSize: "14px"
    }
  };

  return (
    <div style={styles.wrapper}>
      <NavigationBar />

      <div style={styles.mainContainer}>
        <div style={styles.card}>

          {/* Logo area */}
          <div style={{ marginBottom: "20px" }}>
            {/* Optional: Add logo here if desired, keeping it simple for now */}
            <h2 style={{ fontSize: "28px", fontWeight: "700", color: "#333", margin: 0 }}>Welcome Back</h2>
            <p style={{ color: "#666", marginTop: "5px" }}>Login to your account</p>
          </div>

          <form onSubmit={handleSubmit} style={{ textAlign: "left" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "14px", color: "#444" }}>
              Username or Email
            </label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              autoFocus
              style={styles.input}
              placeholder="Enter your username"
            />

            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "14px", color: "#444" }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
              placeholder="Enter your password"
            />

            {error && <div style={styles.error}>{error}</div>}

            <button type="submit" style={styles.button} disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>

            <div style={{ marginTop: "20px", textAlign: "center", display: "flex", flexDirection: "column", gap: "10px" }}>
              <Link to="/forgot-password" style={{ color: "#666", textDecoration: "none", fontSize: "14px" }}>
                Forgot Password?
              </Link>
              <div style={{ fontSize: "14px", color: "#666" }}>
                Don't have an account?{' '}
                <Link to="/signup" style={{ color: "#FFC300", fontWeight: "bold", textDecoration: "none" }}>
                  Sign up
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default LoginPage;