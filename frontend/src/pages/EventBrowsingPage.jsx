import React, { useState, useEffect, useRef } from "react";
import NavigationBar from "../components/NavigationBar";
import Sidebar from "../components/Sidebar";
import EventCard from "../components/EventCard";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";

import "../styles/globals.css";
import "../styles/style.css";
import "../styles/styleguide.css";

function EventBrowsingPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
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
        const res = await fetch("http://localhost:5001/api/events/my/registered", {
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
      const res = await fetch("http://localhost:5001/api/events");
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

      const res = await fetch(`http://localhost:5001/api/events/search?${params}`);
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

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
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
                onChange={(e) => setSearchFilters({ ...searchFilters, query: e.target.value })}
                style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
              />

              {/* Location Filter */}
              <input
                type="text"
                placeholder="Location..."
                value={searchFilters.location}
                onChange={(e) => setSearchFilters({ ...searchFilters, location: e.target.value })}
                style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
              />

              {/* Start Date */}
              <input
                type="date"
                value={searchFilters.startDate}
                onChange={(e) => setSearchFilters({ ...searchFilters, startDate: e.target.value })}
                style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                placeholder="Start Date"
              />

              {/* End Date */}
              <input
                type="date"
                value={searchFilters.endDate}
                onChange={(e) => setSearchFilters({ ...searchFilters, endDate: e.target.value })}
                style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                placeholder="End Date"
              />
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
              <select className="sort-select">
                <option>Most Recent</option>
                <option>Upcoming</option>
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