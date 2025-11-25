import { mockEvents } from "../utils/mockDB.js";

// GET all events
export const getEvents = (req, res) => {
  res.json(mockEvents);
};

// GET events for a specific date
export const getEventsByDate = (req, res) => {
  const selected = req.params.date;
  const events = mockEvents.filter(
    (e) => new Date(e.date).toDateString() === new Date(selected).toDateString()
  );
  res.json(events);
};

// POST create event
export const createEvent = (req, res) => {
  const newEvent = {
    id: mockEvents.length + 1,
    ...req.body,
  };
  mockEvents.push(newEvent);
  res.json(newEvent);
};
