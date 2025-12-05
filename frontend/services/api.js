const API_URL = 'http://localhost:5001/api';

// Fetch all events
export const fetchEvents = async () => {
  try {
    const response = await fetch(`${API_URL}/events`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching events:', error);
    return { success: false, data: [] };
  }
};

// Search events with filters
export const searchEvents = async (filters) => {
  try {
    // Build query string from filters
    const params = new URLSearchParams();
    
    if (filters.query) params.append('query', filters.query);
    if (filters.category && filters.category !== 'all') params.append('category', filters.category);
    if (filters.location) params.append('location', filters.location);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    
    const response = await fetch(`${API_URL}/events/search?${params}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching events:', error);
    return { success: false, data: [] };
  }
};

// Get single event by ID
export const getEventById = async (eventId) => {
  try {
    const response = await fetch(`${API_URL}/events/${eventId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching event:', error);
    return { success: false };
  }
};

// Get categories with counts
export const getCategories = async () => {
  try {
    const response = await fetch(`${API_URL}/events/categories/list`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return { success: false, data: [] };
  }
};