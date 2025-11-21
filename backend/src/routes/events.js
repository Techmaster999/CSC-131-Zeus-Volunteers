import express from "express";
const router = express.Router();

let mockEvents = [
  {
    id: 1,
    title: "Beach Cleanup",
    location: "LA Beach",
    date: "Nov 20, 2025",
    description: "Help clean the beach!"
  }
];

// GET all events
router.get("/", (req, res) => {
  res.json(mockEvents);
});

// POST new event
router.post("/", (req, res) => {
  const newEvent = {
    id: mockEvents.length + 1,
    ...req.body,
  };

  mockEvents.push(newEvent);
  res.json({ message: "Event added", data: newEvent });
});

export default router;
