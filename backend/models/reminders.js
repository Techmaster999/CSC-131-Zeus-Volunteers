import express from "express";
const router = express.Router();

// ==== TEMP MOCK REMINDERS ====
let mockReminders = [
  {
    id: 1,
    event: "Beach Cleanup",
    reminderTime: "1 day before",
    sent: false
  },
  {
    id: 2,
    event: "Food Drive",
    reminderTime: "2 days before",
    sent: false
  }
];

// ==== GET all reminders ====
router.get("/", (req, res) => {
  res.json(mockReminders);
});

// ==== ADD a reminder ====
router.post("/", (req, res) => {
  const newReminder = {
    id: mockReminders.length + 1,
    sent: false,
    ...req.body
  };

  mockReminders.push(newReminder);
  res.json({ message: "Reminder added", data: newReminder });
});

// ==== MARK reminder as sent ====
router.put("/:id/sent", (req, res) => {
  const reminder = mockReminders.find(r => r.id === parseInt(req.params.id));
  if (!reminder) return res.status(404).json({ message: "Reminder not found" });

  reminder.sent = true;
  res.json({ message: "Reminder marked as sent", data: reminder });
});

// ==== DELETE a reminder ====
router.delete("/:id", (req, res) => {
  mockReminders = mockReminders.filter(r => r.id !== parseInt(req.params.id));
  res.json({ message: "Reminder deleted" });
});

export default router;
