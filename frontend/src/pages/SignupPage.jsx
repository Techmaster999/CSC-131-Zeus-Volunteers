import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import NavigationBar from "../components/NavigationBar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import "../styles/signuppage-styleguide.css";
import "../styles/signuppage-global.css";
import "../styles/signuppage-style.css";

function SignupPage() {
  const { registerUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    phone: "",
    password: "",
    country: "",
    state: "",
    city: "",
    role: "volunteer", // Default role
  });

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

  async function handleCountryChange(e) {
    const selectedCountry = e.target.value;
    setFormData({ ...formData, country: selectedCountry, state: "", city: "" });
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

  async function handleStateChange(e) {
    const selectedState = e.target.value;
    setFormData({ ...formData, state: selectedState, city: "" });
    setCities([]);

    if (!selectedState || !formData.country) return;

    try {
      const res = await fetch("https://countriesnow.space/api/v0.1/countries/state/cities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country: formData.country, state: selectedState }),
      });
      const data = await res.json();
      setCities(data.data || []);
    } catch (err) {
      console.error("Error loading cities:", err);
    }
  }

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

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
      maxWidth: "600px",
    },
    header: {
      textAlign: "center",
      marginBottom: "30px"
    },
    logo: {
      width: "60px",
      height: "60px",
      marginBottom: "15px",
      objectFit: "contain"
    },
    title: {
      fontSize: "28px",
      fontWeight: "700",
      color: "#333",
      marginBottom: "10px"
    },
    subtitle: {
      color: "#666",
      fontSize: "16px"
    },
    inputGroup: {
      marginBottom: "20px"
    },
    label: {
      display: "block",
      marginBottom: "8px",
      fontWeight: "600",
      color: "#444",
      fontSize: "14px"
    },
    input: {
      width: "100%",
      padding: "12px 16px",
      borderRadius: "8px",
      border: "1px solid #ddd",
      fontSize: "16px",
      transition: "border-color 0.2s"
    },
    select: {
      width: "100%",
      padding: "12px 16px",
      borderRadius: "8px",
      border: "1px solid #ddd",
      fontSize: "16px",
      backgroundColor: "white"
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
      marginTop: "10px",
      transition: "transform 0.1s, background-color 0.2s"
    },
    error: {
      backgroundColor: "#fee2e2",
      color: "#dc2626",
      padding: "12px",
      borderRadius: "8px",
      marginBottom: "20px",
      fontSize: "14px"
    },
    success: {
      backgroundColor: "#d1fae5",
      color: "#059669",
      padding: "12px",
      borderRadius: "8px",
      marginBottom: "20px",
      fontSize: "14px"
    },
    grid2: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "20px"
    }
  };

  return (
    <div style={styles.wrapper}>
      <NavigationBar />

      <div style={styles.mainContainer}>
        <div style={styles.card}>
          <div style={styles.header}>
            <h2 style={styles.title}>Join Zeus Volunteers</h2>
            <p style={styles.subtitle}>Create an account to start volunteering</p>
          </div>

          {error && <div style={styles.error}>{error}</div>}
          {success && <div style={styles.success}>{success}</div>}

          <form onSubmit={handleSubmit}>
            <div style={styles.grid2}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Username</label>
              <input
                type="text"
                name="userName"
                placeholder="Choose a username"
                value={formData.userName}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Phone Number (Optional)</label>
              <input
                type="text"
                name="phone"
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={handleChange}
                style={styles.input}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>I want to join as a:</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                style={styles.select}
              >
                <option value="volunteer">Volunteer</option>
                <option value="organizer">Organizer</option>
                {/* Admin role removed as per request */}
              </select>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Location</label>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <select name="country" value={formData.country} onChange={handleCountryChange} required style={styles.select}>
                  <option value="">Select Country</option>
                  {countries.map((c) => (<option key={c.country} value={c.country}>{c.country}</option>))}
                </select>

                <div style={styles.grid2}>
                  <select name="state" value={formData.state} onChange={handleStateChange} required disabled={states.length === 0} style={styles.select}>
                    <option value="">Select State</option>
                    {states.map((s) => (<option key={s.name} value={s.name}>{s.name}</option>))}
                  </select>

                  <select name="city" value={formData.city} onChange={handleChange} required disabled={cities.length === 0} style={styles.select}>
                    <option value="">Select City</option>
                    {cities.map((city) => (<option key={city} value={city}>{city}</option>))}
                  </select>
                </div>
              </div>
            </div>

            <button type="submit" style={styles.button} disabled={loading}>
              {loading ? "Creating Account..." : "Create Account"}
            </button>

            <p style={{ textAlign: "center", marginTop: "20px", color: "#666" }}>
              Already have an account? <Link to="/login" style={{ color: "#FFC300", fontWeight: "bold", textDecoration: "none" }}>Log in</Link>
            </p>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default SignupPage;
