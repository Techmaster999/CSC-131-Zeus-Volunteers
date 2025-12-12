import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom"; 
import Footer from "../components/Footer"; 
import "../styles/login.css"; 

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
    // 1. Full height flex container ensures footer stays at bottom
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      
      {/* 2. Main content area takes up all available space */}
      <div className="login-page-container" style={{ flex: 1 }}>
        <div className="login-box">
            
          {/* Back Button */}
          <div style={{ textAlign: 'left', marginBottom: '20px' }}>
            <Link 
              to="/" 
              style={{ 
                textDecoration: 'none', 
                color: '#666', 
                fontSize: '14px', 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '5px',
                fontWeight: '500'
              }}
            >
              <span>&larr;</span> Back to Home
            </Link>
          </div>

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

            {/* The shared 'login-btn' class with our special 'admin-btn' gold override */}
            <button type="submit" className="login-btn admin-btn">
              Login
            </button>

            <div style={{ marginTop: "15px", display: "flex", flexDirection: "column", gap: "10px" }}>
               <span className="forgot-password">Forgot Password?</span>
               <Link to="/contact" className="forgot-password" style={{ color: "#FFC300", textDecoration: 'none' }}>
                 New Admin Account?
               </Link>
            </div>
          </form>
        </div>
      </div>

      {/* 3. The Footer Component */}
      <Footer />
    </div>
  );
};

export default AdminLogin;