import express from "express";
import { protect } from "../middleware/auth.js";
import {
    getReminders,
    addReminder,
    removeReminder,
    updatePreferences,
    getPreferences
} from "../controllers/reminderController.js";

const router = express.Router();

// ===== ALL ROUTES REQUIRE AUTHENTICATION =====

// Get user's reminders
router.get("/", protect, getReminders);

// Create a new reminder
router.post("/", protect, addReminder);

// Delete a reminder
router.delete("/:id", protect, removeReminder);

// Get reminder preferences
router.get("/preferences", protect, getPreferences);

// Update reminder preferences
router.put("/preferences", protect, updatePreferences);

export default router;
