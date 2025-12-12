import React, { useEffect, useState } from "react";
import NavigationBar from "../components/NavigationBar";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";

function AdminDashboard() {
  const { user } = useAuth();

  // Hardcoded stats for admin view
  const stats = [
    { label: "Total Users", value: 1250 },
    { label: "Active Events", value: 45 },
    { label: "Pending Approvals", value: 12 },
    { label: "Reports", value: 3 }
  ];

  const buttonStyle = {
    backgroundColor: "#FFC300", // Yellow
    color: "black",
    padding: "10px 20px",
    borderRadius: "5px",
    textDecoration: "none",
    textAlign: "center",
    display: "inline-block",
    margin: "5px",
    border: "2px solid #FFC300",
    fontWeight: "bold"
  };

  const outlineButtonStyle = {
    backgroundColor: "white",
    color: "#FFC300", // Yellow text
    padding: "10px 20px",
    borderRadius: "5px",
    textDecoration: "none",
    textAlign: "center",
    display: "inline-block",
    margin: "5px",
    border: "2px solid #FFC300",
    fontWeight: "bold"
  };

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <NavigationBar />

        <div className="admin-dashboard-container" style={{ padding: "40px", flex: 1 }}>

          {/* HEADER */}
          <div style={{ marginBottom: "30px", borderBottom: "2px solid #eee", paddingBottom: "20px" }}>
            <h1 style={{ fontSize: "32px", marginBottom: "10px" }}>Admin Dashboard</h1>
            <p style={{ color: "#666" }}>Welcome back, Administrator {user?.firstName}</p>
          </div>

          {/* STATS GRID */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "40px" }}>
            {stats.map((stat, index) => (
              <div key={index} style={{ padding: "20px", backgroundColor: "#f9f9f9", borderRadius: "8px", textAlign: "center", border: "1px solid #ddd" }}>
                <h3 style={{ fontSize: "36px", margin: "0 0 10px 0", color: "#FFC300" }}>{stat.value}</h3>
                <p style={{ margin: 0, fontWeight: "bold", color: "#444" }}>{stat.label}</p>
              </div>
            ))}
          </div>

          {/* QUICK ACTIONS */}
          <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "8px", border: "1px solid #eee" }}>
            <h3 style={{ marginBottom: "20px" }}>Quick Actions</h3>
            <div className="dashboard-buttons">
              <Link to="/admin/users" style={buttonStyle}>Manage Users</Link>
              <Link to="/admin/events" style={buttonStyle}>Manage Events</Link>
              <Link to="/admin/reports" style={buttonStyle}>View Reports</Link>
              <Link to="/admin/settings" style={outlineButtonStyle}>System Settings</Link>
            </div>
          </div>

        </div>

        <Footer />
      </div>
    </>
  );
}

export default AdminDashboard;
