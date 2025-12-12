import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom"; 
import Footer from "../components/Footer"; 
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
      if (user.role === "admin") navigate("/admin");
      else if (user.role === "organizer") navigate("/organizer");
      else navigate("/home");

    } catch (err) {
      setError("Invalid username/email or password");
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      
      <div className="login-page-container" style={{ flex: 1 }}>
        <div className="login-box">
          
          {/* Back to Home Button */}
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

          <h2>Zeus Volunteers</h2>

          <form onSubmit={handleSubmit}>
            <label>Username or Email</label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              autoFocus
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

            {/* NEW SECTIONS: Forgot Password & Sign Up */}
            <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "10px", textAlign: "center" }}>
               
               {/* 1. Forgot Password Link */}
               <Link 
                 to="/forgot-password" 
                 className="forgot-password" 
                 style={{ textDecoration: 'none', color: '#666' }}
               >
                 Forgot Password?
               </Link>

               {/* 2. Register Link */}
               <div className="forgot-password" style={{ cursor: 'default' }}>
                 Don't have an account?{' '}
                 <Link 
                   to="/signup" 
                   style={{ 
                     color: "#586bff", // Matches your login button blue
                     fontWeight: "bold", 
                     textDecoration: 'none' 
                   }}
                 >
                   Register
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