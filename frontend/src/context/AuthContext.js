import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../config";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  //
  // Load user from localStorage on app start
  //
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
    }

    setLoading(false);
  }, []);

  //
  // Login function (calls backend)
  //
  async function login(identifier, password) {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Login failed");
    }

    const userData = data.data; // id, name, email, role, token

    // Save auth info
    localStorage.setItem("token", userData.token);
    localStorage.setItem("user", JSON.stringify(userData));

    setUser(userData);

    return userData;
  }

  //
  // Registration
  //
  async function registerUser(formData) {
    const res = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Registration failed");
    }

    return data;
  }

  //
  // LOGOUT — FULL FIXED VERSION
  //
  async function logout() {
    const token = localStorage.getItem("token");

    try {
      // optional backend logout call
      await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "application/json",
        },
      });
    } catch (err) {
      console.warn("Logout request failed:", err);
    }

    // Clear stored auth data
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Clear context state
    setUser(null);

    // Redirect to homepage
    navigate("/");
  }

  //
  // authFetch adds Authorization to requests
  //
  function authFetch(url, options = {}) {
    const token = localStorage.getItem("token");

    return fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
        ...(options.headers || {}),
      },
    });
  }

  //
  // Context API value
  //
  const value = {
    user,
    loading,
    login,
    registerUser,
    logout,
    authFetch,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
