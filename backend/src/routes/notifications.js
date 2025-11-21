import express from "express";
const router = express.Router();

// ==== TEMP MOCK NOTIFICATIONS ====
let mockNotifications = [
  {
    id: 1,
    message: "You registered for Beach Cleanup!",
    date: "2025-11-10",
    read: false
  },
  {
    id: 2,
    message: "Food Drive starts soon!",
    date: "2025-11-12",
    read: false
  }
];

// ==== GET all notifications ====
router.get("/", (req, res) => {
  res.json(mockNotifications);
});

// ==== MARK notification as read ====
router.put("/:id/read", (req, res) => {
  const notification = mockNotifications.find(n => n.id === parseInt(req.params.id));
  if (!notification) return res.status(404).json({ message: "Notification not found" });

  notification.read = true;
  res.json({ message: "Notification marked as read", data: notification });
});

// ==== ADD notification ====
export default router;

