import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";


/* ======== CSS IMPORTS (correct order) ======== */
import "../styles/signuppage-styleguide.css";   // design tokens
import "../styles/signuppage-global.css";      // reset + global rules
import "../styles/signuppage-style.css";        // signup page styling



function SignupPage() {
  return (
    <>
      <Header />

      <div className="signup-wrapper">
        <div className="signup-card">
          <div className="signup-logo">
            <img src="/img/logo.png" alt="Zeus Volunteers" />
            <h2>Zeus Volunteers</h2>
            <p className="signup-sub">Create an account to get started</p>
          </div>

          <form className="signup-form">
            <div className="input-group">
              <label>First Name</label>
              <input type="text" placeholder="Enter first name" />
            </div>

            <div className="input-group">
              <label>Last Name</label>
              <input type="text" placeholder="Enter last name" />
            </div>

            <div className="input-group">
              <label>Email</label>
              <input type="email" placeholder="Enter your email" />
            </div>

            <div className="input-group">
              <label>Phone</label>
              <input type="text" placeholder="Phone number" />
            </div>

            <div className="input-group">
              <label>Username</label>
              <input type="text" placeholder="Create a username" />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input type="password" placeholder="Create a password" />
            </div>

            <div className="input-group">
              <label>Country</label>
              <select>
                <option>Select Country</option>
              </select>
            </div>

            <div className="input-group">
              <label>State/Province</label>
              <select>
                <option>Select State</option>
              </select>
            </div>

            <div className="input-group">
              <label>City</label>
              <select>
                <option>Select City</option>
              </select>
            </div>

            <button className="signup-btn">Create Account</button>
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default SignupPage;