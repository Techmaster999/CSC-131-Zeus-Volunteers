import React, { useState, useEffect, useRef } from "react";
import NavigationBar from "../components/NavigationBar";
import Sidebar from "../components/Sidebar";
import EventCard from "../components/EventCard";
import Footer from "../components/Footer";
import API_URL from "../config";
import { useAuth } from "../context/AuthContext";

import "../styles/globals.css";
import "../styles/style.css";
import "../styles/styleguide.css";

function EventBrowsingPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [sortOption, setSortOption] = useState("Soonest");
  const [loading, setLoading] = useState(true);
  const [registeredEventIds, setRegisteredEventIds] = useState(new Set());
  const initialLoad = useRef(true);

  // Top search bar filters (no category here)
  const [searchFilters, setSearchFilters] = useState({
    query: '',
    location: '',
    startDate: '',
    endDate: ''
  });

  // Sidebar filters
  const [sidebarFilters, setSidebarFilters] = useState({
    categories: [],
    skills: [],
    distance: null
  });

  // Fetch user's registered events
  useEffect(() => {
    async function fetchRegisteredEvents() {
      if (!user) {
        console.log("No user, skipping registered events fetch");
        return;
      }

      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/api/events/my/registered`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const json = await res.json();
        console.log("Registered events response:", json);
        if (json.success && json.data) {
          const eventIds = new Set(json.data.map(event => event._id));
          console.log("Registered event IDs:", Array.from(eventIds));
          setRegisteredEventIds(eventIds);
        }
      } catch (err) {
        console.error("Error fetching registered events:", err);
      }
    }

    fetchRegisteredEvents();
  }, [user]);

  // Load events on mount
  useEffect(() => {
    loadEvents();
  }, []);

  // Auto-search when sidebar filters change
  useEffect(() => {
    // Skip on initial load
    if (initialLoad.current) {
      initialLoad.current = false;
      return;
    }

    // If any filters are active, search
    if (sidebarFilters.categories.length > 0 || sidebarFilters.skills.length > 0 || sidebarFilters.distance) {
      handleSearch();
    } else {
      // If all filters are cleared, reload all events
      console.log("🔄 Filters cleared, reloading all events");
      loadEvents();
    }
  }, [sidebarFilters]);

  // Fetch all events (initial load)
  const loadEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/events`);
      const json = await res.json();

      console.log("📥 Loaded events:", json.count || json.data?.length);

      if (json.success && Array.isArray(json.data)) {
        setEvents(json.data);
      } else if (Array.isArray(json)) {
        setEvents(json);
      } else {
        setEvents([]);
      }
    } catch (err) {
      console.error("Error loading events:", err);
      setEvents([]);
    }
    setLoading(false);
  };

  // Handle search with ALL filters (top bar + sidebar)
  const handleSearch = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();

      // Top search bar filters
      if (searchFilters.query) params.append('query', searchFilters.query);
      if (searchFilters.location) params.append('location', searchFilters.location);
      if (searchFilters.startDate) params.append('startDate', searchFilters.startDate);
      if (searchFilters.endDate) params.append('endDate', searchFilters.endDate);

      // Sidebar filters
      if (sidebarFilters.categories && sidebarFilters.categories.length > 0) {
        params.append('category', sidebarFilters.categories.join(','));
      }

      if (sidebarFilters.skills && sidebarFilters.skills.length > 0) {
        params.append('skills', sidebarFilters.skills.join(','));
      }

      console.log("🔍 Search params:", params.toString());

      const res = await fetch(`${API_URL}/api/events/search?${params}`);
      const json = await res.json();

      console.log("📥 Search results:", json.count || json.data?.length);

      if (json.success && Array.isArray(json.data)) {
        setEvents(json.data);
      } else {
        setEvents([]);
      }
    } catch (err) {
      console.error("Error searching events:", err);
      setEvents([]);
    }
    setLoading(false);
  };

  // Reset all filters
  const handleReset = () => {
    setSearchFilters({
      query: '',
      location: '',
      startDate: '',
      endDate: ''
    });
    setSidebarFilters({
      categories: [],
      skills: [],
      distance: null
    });
    loadEvents();
  };

  // Sort events when option changes
  useEffect(() => {
    if (events.length === 0) return;

    const sortedEvents = [...events].sort((a, b) => {
      // Logic for chronological or creation-based sorting
      if (sortOption === "Soonest") {
        // Event Date Ascending
        return new Date(a.date) - new Date(b.date);
      } else if (sortOption === "Furthest") {
        // Event Date Descending
        return new Date(b.date) - new Date(a.date);
      } else if (sortOption === "Recently Added") {
        // Creation Date Descending
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      return 0;
    });

    // Only update if order actually changed to avoid infinite loops
    if (JSON.stringify(sortedEvents) !== JSON.stringify(events)) {
      setEvents(sortedEvents);
    }
  }, [sortOption, events]); // Depend on sortOption and events

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "#e8e8e8" }}>
        <NavigationBar />

        <main className="event-browsing-page" style={{ flex: 1 }}>
          {/* TOP SEARCH BAR - NO CATEGORY */}
          <section className="filter-section" style={{ padding: '20px', backgroundColor: '#f5f5f5', marginBottom: '20px' }}>
            <h3>Search Events</h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginTop: '15px' }}>
              {/* Keyword Search */}
              <input
                type="text"
                placeholder="Search by keyword..."
                value={searchFilters.query}
                onChange={(e) => setSearchFilters(prev => ({ ...prev, query: e.target.value }))}
                style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
              />

              {/* Location Filter */}
              <input
                type="text"
                placeholder="Location..."
                value={searchFilters.location}
                onChange={(e) => setSearchFilters(prev => ({ ...prev, location: e.target.value }))}
                style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
              />

              {/* Start Date */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '14px', color: '#666', fontWeight: '500' }}>From:</label>
                <input
                  type="date"
                  value={searchFilters.startDate}
                  onChange={(e) => setSearchFilters(prev => ({ ...prev, startDate: e.target.value }))}
                  style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px', width: "100%", boxSizing: "border-box" }}
                  placeholder="Start Date"
                />
              </div>

              {/* End Date */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '14px', color: '#666', fontWeight: '500' }}>To:</label>
                <input
                  type="date"
                  value={searchFilters.endDate}
                  onChange={(e) => setSearchFilters(prev => ({ ...prev, endDate: e.target.value }))}
                  style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px', width: "100%", boxSizing: "border-box" }}
                  placeholder="End Date"
                />
              </div>
            </div>

            {/* Search & Reset Buttons */}
            <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
              <button
                onClick={handleSearch}
                style={{
                  padding: '10px 30px',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                🔍 Search
              </button>

              <button
                onClick={handleReset}
                style={{
                  padding: '10px 30px',
                  backgroundColor: '#666',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Reset All Filters
              </button>
            </div>
          </section>

          {/* RESULTS COUNT */}
          <section className="filter-top">
            <p>Showing {loading ? '...' : events.length} Results</p>

            <div className="filter-right">
              <label>Sort by:</label>
              <select
                className="sort-select"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="Soonest">Date: Soonest</option>
                <option value="Furthest">Date: Furthest</option>
                <option value="Recently Added">Recently Added</option>
              </select>
            </div>
          </section>

          <div className="event-browsing-content">
            {/* SIDEBAR - Category, Skills, Distance */}
            <Sidebar
              onFilterChange={setSidebarFilters}
              selectedFilters={sidebarFilters}
            />

            <section className="event-list events-grid">
              {loading ? (
                <p>Loading events...</p>
              ) : events.length === 0 ? (
                <p>No events found. Try different filters!</p>
              ) : (
                events.map((event) => (
                  <EventCard
                    key={event._id}
                    event={event}
                    isRegistered={registeredEventIds.has(event._id)}
                  />
                ))
              )}
            </section>
          </div>

        </main>

        <Footer />
      </div>
    </>
  );
}

export default EventBrowsingPage;