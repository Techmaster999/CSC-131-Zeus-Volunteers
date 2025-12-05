import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import EventCard from "../components/EventCard";
import Footer from "../components/Footer";

import "../styles/globals.css";
import "../styles/style.css";
import "../styles/styleguide.css";

function EventBrowsingPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Combined filter state
  const [filters, setFilters] = useState({
    query: '',
    category: 'all',
    location: '',
    startDate: '',
    endDate: '',
    categories: [],  // from sidebar
    skills: [],      // from sidebar
    distance: null   // from sidebar
  });

  // Load events on mount
  useEffect(() => {
    loadEvents();
  }, []);

  // Auto-apply sidebar filters when they change
  useEffect(() => {
    if (events.length > 0 && (filters.categories.length > 0 || filters.skills.length > 0 || filters.distance)) {
      applyFilters();
    }
  }, [filters.categories, filters.skills, filters.distance]);

  // Fetch all events (initial load)
  const loadEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5001/api/events");
      const json = await res.json();

      console.log("EVENT RESPONSE:", json);

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

  // Handle search with top bar filters
  const handleSearch = async () => {
    setLoading(true);
    try {
      // Build query string from top search bar
      const params = new URLSearchParams();
      
      if (filters.query) params.append('query', filters.query);
      if (filters.category && filters.category !== 'all') params.append('category', filters.category);
      if (filters.location) params.append('location', filters.location);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      
      const res = await fetch(`http://localhost:5001/api/events/search?${params}`);
      const json = await res.json();

      if (json.success && Array.isArray(json.data)) {
        let filtered = json.data;
        
        // Apply sidebar filters on top of search results
        filtered = applySidebarFilters(filtered);
        
        setEvents(filtered);
      } else {
        setEvents([]);
      }
    } catch (err) {
      console.error("Error searching events:", err);
      setEvents([]);
    }
    setLoading(false);
  };

  // Apply sidebar filters to current events
  const applyFilters = () => {
    setLoading(true);
    loadEvents().then(() => {
      // After loading, filter will be applied automatically
      setLoading(false);
    });
  };

  // Helper function to apply sidebar filters
  const applySidebarFilters = (eventList) => {
    let filtered = [...eventList];
    
    // Filter by categories from sidebar
    if (filters.categories && filters.categories.length > 0) {
      filtered = filtered.filter(event => 
        filters.categories.includes(event.category?.toLowerCase())
      );
    }

    // TODO: Filter by skills when backend supports it
    // if (filters.skills && filters.skills.length > 0) {
    //   filtered = filtered.filter(event => 
    //     event.skills?.some(skill => filters.skills.includes(skill))
    //   );
    // }

    // TODO: Filter by distance when backend supports it
    // if (filters.distance) {
    //   filtered = filtered.filter(event => 
    //     calculateDistance(event.location) <= filters.distance
    //   );
    // }

    return filtered;
  };

  // Reset all filters
  const handleReset = () => {
    setFilters({
      query: '',
      category: 'all',
      location: '',
      startDate: '',
      endDate: '',
      categories: [],
      skills: [],
      distance: null
    });
    loadEvents();
  };

  // Handle sidebar filter changes
  const handleSidebarFilterChange = (newSidebarFilters) => {
    setFilters({
      ...filters,
      categories: newSidebarFilters.categories || [],
      skills: newSidebarFilters.skills || [],
      distance: newSidebarFilters.distance || null
    });
  };

  return (
    <>
      <Header />

      <main className="event-browsing-page">
        {/* FILTER SECTION */}
        <section className="filter-section" style={{ padding: '20px', backgroundColor: '#f5f5f5', marginBottom: '20px' }}>
          <h3>Search & Filter Events</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginTop: '15px' }}>
            {/* Keyword Search */}
            <input
              type="text"
              placeholder="Search by keyword..."
              value={filters.query}
              onChange={(e) => setFilters({ ...filters, query: e.target.value })}
              style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
            
            {/* Category Filter */}
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
            >
              <option value="all">All Categories</option>
              <option value="cultural">Cultural</option>
              <option value="environmental">Environmental</option>
              <option value="health">Health</option>
              <option value="education">Education</option>
              <option value="community service">Community Service</option>
              <option value="other">Other</option>
            </select>
            
            {/* Location Filter */}
            <input
              type="text"
              placeholder="Location..."
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
            
            {/* Start Date */}
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
              placeholder="Start Date"
            />
            
            {/* End Date */}
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
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
              Reset
            </button>
          </div>
        </section>

        {/* EXISTING FILTER TOP SECTION */}
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
          {/* FIXED: Pass correct props */}
          <Sidebar 
            onFilterChange={handleSidebarFilterChange}
            selectedFilters={{
              categories: filters.categories,
              skills: filters.skills,
              distance: filters.distance
            }}
          />

          <section className="event-list">
            {loading ? (
              <p>Loading events...</p>
            ) : events.length === 0 ? (
              <p>No events found. Try different filters!</p>
            ) : (
              events.map(event => (
                <EventCard key={event._id} event={event} />
              ))
            )}
          </section>
        </div>

        <Footer />
      </main>
    </>
  );
}

export default EventBrowsingPage;