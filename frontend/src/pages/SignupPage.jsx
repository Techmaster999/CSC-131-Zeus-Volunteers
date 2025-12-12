import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";

/* ======== CSS IMPORTS ======== */
import "../styles/signuppage-styleguide.css";
import "../styles/signuppage-global.css";
import "../styles/signuppage-style.css";

function SignupPage() {
  const { registerUser } = useAuth();
  const navigate = useNavigate();

  /* ============================
     FORM DATA — MATCHES BACKEND
  ============================ */
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    userName: "", // 🔥 FIXED (backend requires userName)
    email: "",
    phone: "",
    password: "",
    country: "",
    state: "",
    city: "",
    role: "volunteer",
  });

  /* ============================
      DROPDOWN ARRAYS
  ============================ */
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  /* ============================
      UI STATE
  ============================ */
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* ============================
      LOAD ALL COUNTRIES
  ============================ */
  useEffect(() => {
    async function loadCountries() {
      try {
        const res = await fetch("https://countriesnow.space/api/v0.1/countries");
        const data = await res.json();
        setCountries(data.data);
      } catch (err) {
        console.error("Failed loading countries:", err);
      }
    }
    loadCountries();
  }, []);

  /* ============================
      COUNTRY SELECTED → LOAD STATES
  ============================ */
  async function handleCountryChange(e) {
    const selectedCountry = e.target.value;

    setFormData({
      ...formData,
      country: selectedCountry,
      state: "",
      city: "",
    });

    setStates([]);
    setCities([]);

    if (!selectedCountry) return;

    try {
      const res = await fetch("https://countriesnow.space/api/v0.1/countries/states", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country: selectedCountry }),
      });

      const data = await res.json();
      setStates(data.data?.states || []);
    } catch (err) {
      console.error("Error loading states:", err);
    }
  }

  /* ============================
      STATE SELECTED → LOAD CITIES
  ============================ */
  async function handleStateChange(e) {
    const selectedState = e.target.value;

    setFormData({
      ...formData,
      state: selectedState,
      city: "",
    });

    setCities([]);

    if (!selectedState || !formData.country) return;

    try {
      const res = await fetch(
        "https://countriesnow.space/api/v0.1/countries/state/cities",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            country: formData.country,
            state: selectedState,
          }),
        }
      );

      const data = await res.json();
      setCities(data.data || []);
    } catch (err) {
      console.error("Error loading cities:", err);
    }
  }

  /* ============================
      GENERIC FORM CHANGE
  ============================ */
  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  /* ============================
      SUBMIT FORM
  ============================ */
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // 🔥 Make sure all required fields have values
    if (!formData.country || !formData.state || !formData.city) {
      setError("Please select your country, state, and city.");
      setLoading(false);
      return;
    }

    if (!formData.userName) {
      setError("Username is required.");
      setLoading(false);
      return;
    }

    try {
      await registerUser(formData);
      setSuccess("Account created successfully! Redirecting...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  }

  /* ============================
      RENDER
  ============================ */
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

          <form className="signup-form" onSubmit={handleSubmit}>

            {/* First Name */}
            <div className="input-group">
              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                placeholder="Enter first name"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>

            {/* Last Name */}
            <div className="input-group">
              <label>Last Name</label>
              <input
                type="text"
                name="lastName"
                placeholder="Enter last name"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>

            {/* Email */}
            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Phone */}
            <div className="input-group">
              <label>Phone</label>
              <input
                type="text"
                name="phone"
                placeholder="Phone number"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            {/* Username (backend expects userName) */}
            <div className="input-group">
              <label>Username</label>
              <input
                type="text"
                name="userName"
                placeholder="Create a username"
                value={formData.userName}
                onChange={handleChange}
                required
              />
            </div>

            {/* Password */}
            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {/* ROLE SELECTOR (Added for testing) */}
            <div className="input-group">
              <label>I want to join as a:</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
              >
                <option value="volunteer">Volunteer</option>
                <option value="organizer">Organizer</option>
                <option value="admin">Admin (Test)</option>
              </select>
            </div>

            {/* COUNTRY */}
            <div className="input-group">
              <label>Country</label>
              <select
                name="country"
                value={formData.country}
                onChange={handleCountryChange}
                required
              >
                <option value="">Select Country</option>
                {countries.map((c) => (
                  <option key={c.country} value={c.country}>
                    {c.country}
                  </option>
                ))}
              </select>
            </div>

            {/* STATE */}
            <div className="input-group">
              <label>State/Province</label>
              <select
                name="state"
                value={formData.state}
                onChange={handleStateChange}
                required
                disabled={states.length === 0}
              >
                <option value="">Select State</option>
                {states.map((s) => (
                  <option key={s.name} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* CITY */}
            <div className="input-group">
              <label>City</label>
              <select
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                disabled={cities.length === 0}
              >
                <option value="">Select City</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            {/* STATUS MESSAGES */}
            {error && <p style={{ color: "red", marginTop: 10 }}>{error}</p>}
            {success && <p style={{ color: "green", marginTop: 10 }}>{success}</p>}

            {/* BUTTON */}
            <button className="signup-btn" type="submit" disabled={loading}>
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default SignupPage;
