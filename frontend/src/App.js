import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import LandingPage from "./pages/LandingPage";
import EventBrowsingPage from "./pages/EventBrowsingPage";
import CalendarPage from "./pages/CalendarPage";
import SignupPage from "./pages/SignupPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* LANDING PAGE */}
        <Route path="/" element={<LandingPage />} />

        {/* HOME PAGE */}
        <Route path="/home" element={<HomePage />} />

        {/* EVENT BROWSING */}
        <Route path="/events" element={<EventBrowsingPage />} />

        {/* CALENDAR */}
        <Route path="/calendar" element={<CalendarPage />} />

        {/* SIGN UP */}
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
