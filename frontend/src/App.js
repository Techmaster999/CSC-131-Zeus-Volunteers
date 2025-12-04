import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage.jsx";
import SignupPage from "./pages/SignupPage";
import ContactPage from "./pages/ContactPage.jsx";


import EventBrowsingPage from "./pages/EventBrowsingPage";
import EventDetailPage from "./pages/EventDetailPage";
import CalendarPage from "./pages/CalendarPage";

import AdminDashboard from "./pages/AdminDashboard";
import OrganizerDashboard from "./pages/OrganizerDashboard";
import VolunteerDashboard from "./pages/VolunteerDashboard";
import UnauthorizedPage from "./pages/UnauthorizedPage";

import EventCreationPage from "./pages/organizer/EventCreationPage";


// import AnnouncementsPage from "./pages/AnnouncementsPage";

import ProtectedRoute from "./components/ProtectedRoute";
import RoleProtectedRoute from "./components/RoleProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* PUBLIC PAGES */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/contact" element={<ContactPage />} />


          {/* PUBLIC (VIEW ONLY, NO ACTIONS) */}
          <Route path="/events" element={<EventBrowsingPage />} />
          <Route path="/events/:id" element={<EventDetailPage />} />
          

          {/* ANY LOGGED-IN USER */}
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

          

          {/* VOLUNTEER DASHBOARD */}
          <Route
            path="/volunteer"
            element={
              <RoleProtectedRoute allowedRoles={["volunteer"]}>
                <VolunteerDashboard />
              </RoleProtectedRoute>
            }
            
          />

          {/* ORGANIZER ROUTES */}
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

          {/* <Route
            path="/organizer/announcements"
            element={
              <RoleProtectedRoute allowedRoles={["organizer"]}>
                <AnnouncementsPage />
              </RoleProtectedRoute>
            }
          /> */}

          {/* ADMIN */}
          <Route
            path="/admin"
            element={
              <RoleProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </RoleProtectedRoute>
            }
          />

          <Route path="/unauthorized" element={<UnauthorizedPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
