// src/App.js
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// PUBLIC PAGES
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ContactPage from "./pages/ContactPage";
import AdminLogin from "./pages/AdminLogin";

// GENERAL AUTHENTICATED PAGES
import HomePage from "./pages/HomePage";
import CalendarPage from "./pages/CalendarPage";

// EVENTS
import EventBrowsingPage from "./pages/EventBrowsingPage";
import EventDetailPage from "./pages/EventDetailPage";

// DASHBOARDS
import AdminDashboard from "./pages/AdminDashboard";
import OrganizerDashboard from "./pages/OrganizerDashboard";
import VolunteerDashboard from "./pages/VolunteerDashboard";

// ORGANIZER TOOLS
import EventCreationPage from "./pages/organizer/EventCreationPage";

// ACCESS CONTROL
import ProtectedRoute from "./components/ProtectedRoute";
import RoleProtectedRoute from "./components/RoleProtectedRoute";
import UnauthorizedPage from "./pages/UnauthorizedPage";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          {/* ------------------------- */}
          {/* PUBLIC ROUTES */}
          {/* ------------------------- */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Public View → Browsing Events */}
          <Route path="/events" element={<EventBrowsingPage />} />
          <Route path="/events/:id" element={<EventDetailPage />} />


          {/* ------------------------- */}
          {/* AUTHENTICATED (ANY ROLE) */}
          {/* ------------------------- */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/calendar"
            element={
              <ProtectedRoute>
                <CalendarPage />
              </ProtectedRoute>
            }
          />


          {/* ------------------------- */}
          {/* VOLUNTEER DASHBOARD */}
          {/* ------------------------- */}
          <Route
            path="/volunteer"
            element={
              <RoleProtectedRoute allowedRoles={["volunteer"]}>
                <VolunteerDashboard />
              </RoleProtectedRoute>
            }
          />


          {/* ------------------------- */}
          {/* ORGANIZER DASHBOARD + TOOLS */}
          {/* ------------------------- */}
          <Route
            path="/organizer"
            element={
              <RoleProtectedRoute allowedRoles={["organizer"]}>
                <OrganizerDashboard />
              </RoleProtectedRoute>
            }
          />

          <Route
            path="/events/create"
            element={
              <RoleProtectedRoute allowedRoles={["organizer"]}>
                <EventCreationPage />
              </RoleProtectedRoute>
            }
          />


          {/* ------------------------- */}
          {/* ADMIN DASHBOARD */}
          {/* ------------------------- */}
          <Route
            path="/admin"
            element={
              <RoleProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </RoleProtectedRoute>
            }
          />


          {/* ------------------------- */}
          {/* UNAUTHORIZED PAGE */}
          {/* ------------------------- */}
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
