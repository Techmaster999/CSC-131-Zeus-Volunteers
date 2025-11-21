import express from "express";
const router = express.Router();

// Temporary mock participation history
let mockParticipation = [
  {
    id: 1,
    eventName: "Shoe Fitting",
    organizer: "Cinderella",
    description: "Does your shoe fit me?",
    date: "October 12, 2025",
  }
];

// GET participation history
router.get("/", (req, res) => {
  res.json(mockParticipation);
});

// Add participation record
router.post("/", (req, res) => {
  const newParticipation = {
    id: mockParticipation.length + 1,
    ...req.body,
  };

  mockParticipation.push(newParticipation);
  res.json({ message: "Participation added", data: newParticipation });
});

// Test route
router.get("/test", (req, res) => {
  res.send("Participation route working");
});

export default router;
