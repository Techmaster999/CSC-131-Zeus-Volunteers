import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // ⭐ Do not render anything until auth loads
  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
      </div>
    );
  }

  // ❌ Not logged in → redirect
  if (!user) return <Navigate to="/login" replace />;

  // ✅ Logged in → allow route
  return children;
}

const styles = {
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "80vh",
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "4px solid #ddd",
    borderTop: "4px solid #555",
    borderRadius: "50%",
    animation: "spin 0.9s linear infinite",
  },
};

export default ProtectedRoute;
