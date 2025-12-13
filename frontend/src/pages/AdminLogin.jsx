import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import NavigationBar from "../components/NavigationBar";
import Footer from "../components/Footer";
import "../styles/login.css";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(username, password);
      navigate("/admin");
    } catch (err) {
      setError("Invalid admin credentials");
    } finally {
      setLoading(false);
    }
  };

  // Consistent Styles (Admin Theme - Gold Accent)
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
      textAlign: "center",
      borderTop: "5px solid #FFC300" // Gold top border for admin distinction
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
      backgroundColor: "#333", // Dark button for admin
      color: "#FFC300",         // Gold text
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

          <div style={{ marginBottom: "20px" }}>
            <h2 style={{ fontSize: "28px", fontWeight: "700", color: "#333", margin: 0 }}>Admin Portal</h2>
            <p style={{ color: "#666", marginTop: "5px" }}>Login to access administrative tools</p>
          </div>

          <form onSubmit={handleSubmit} style={{ textAlign: "left" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "14px", color: "#444" }}>
              Username or Email
            </label>
            <input
              type="text"
              placeholder="Enter admin username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
              style={styles.input}
            />

            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "14px", color: "#444" }}>
              Password
            </label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
            />

            {error && <div style={styles.error}>{error}</div>}

            <button type="submit" style={styles.button} disabled={loading}>
              {loading ? "Authenticating..." : "Login to Admin Dashboard"}
            </button>

            <div style={{ marginTop: "20px", textAlign: "center", display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ fontSize: "13px", color: "#888", cursor: "default" }}>
                Restricted Access. Authorized Personnel Only.
              </div>
              <Link to="/contact" style={{ color: "#FFC300", textDecoration: 'none', fontSize: "14px", fontWeight: "600" }}>
                Request Access Issue?
              </Link>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AdminLogin;