import express from "express";
const router = express.Router();
import { protect, admin, organizer } from "../middleware/auth.js";
import Event from "../models/Events.model.js";
import User from "../models/Accounts.model.js";
import UserEvent from "../models/User_Events.models.js";

// Import controller functions
import {
    getEvents,
    searchEvents,
    getEventById,
    getEventsByCategory,
    getCategories,
    getAllEvents,
    getEventUsers,
    getEventUsersAgg,
    addUserToEvent,
    getUserRegisteredEvents,
    getUserHistory,
    reviewEvent
} from "../controllers/eventController.js";

// ===== PUBLIC ROUTES =====

// Browse all approved upcoming events (uses filtering logic)
router.get("/", getEvents);

// Search with filters (query, category, location, dates, skills)
router.get("/search", searchEvents);

// Get all categories with counts
router.get("/categories/list", getCategories);

// Get events by category
router.get("/category/:category", getEventsByCategory);

// Get single event by ID
router.get("/:eventId", getEventById);

// ===== VOLUNTEER ROUTES (Protected) =====

// Get user's registered events
router.get("/my/registered", protect, getUserRegisteredEvents);

// Get user's participation history
router.get("/my/history", protect, getUserHistory);

// Sign up for event
router.post("/signup", protect, addUserToEvent);

// ===== ORGANIZER ROUTES =====

// Create new event
router.post("/", protect, organizer, async (req, res) => {
    try {
        const { 
            eventName, 
            title,
            organizer, 
            date, 
            time, 
            dateTime,
            details, 
            description,
            category,
            location,
            skills,
            announcements = "", 
            commitments = "", 
            imageUrl = "",
            maxVolunteers,
            duration
        } = req.body;

        // Flexible field names (eventName or title, details or description)
        const eventTitle = title || eventName;
        const eventDescription = description || details;

        if (!eventTitle || !organizer || (date && time) || dateTime) {
            return res.status(400).json({
                success: false,
                message: "Required fields missing",
            });
        }

        const newEvent = new Event({
            eventName: eventTitle,
            title: eventTitle,
            organizer,
            date,
            time,
            dateTime: dateTime || new Date(`${date}T${time}`),
            details: eventDescription,
            description: eventDescription,
            category,
            location,
            skills,
            announcements,
            commitments,
            eventPicture: imageUrl,
            maxVolunteers,
            duration,
            status: 'pending', // Requires admin approval
            approvalStatus: 'pending',
            createdBy: req.user.id
        });

        await newEvent.save();

        res.status(201).json({
            success: true,
            message: "Event created successfully and pending approval",
            data: newEvent,
        });

    } catch (err) {
        console.error("Error creating event:", err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// Get users registered for an event (organizer view)
router.get("/:eventId/users", protect, organizer, getEventUsers);

// Get users via aggregation
router.get("/:eventId/users-agg", protect, organizer, getEventUsersAgg);

// Update event
router.put("/:id", protect, organizer, async (req, res) => {
    try {
        const updatedEvent = await Event.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updatedEvent) {
            return res.status(404).json({ success: false, message: "Event not found" });
        }

        res.json({
            success: true,
            message: "Event updated",
            data: updatedEvent
        });

    } catch (err) {
        console.error("Error updating event:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// Delete event
router.delete("/:id", protect, organizer, async (req, res) => {
    try {
        const deleted = await Event.findByIdAndDelete(req.params.id);

        if (!deleted) {
            return res.status(404).json({ success: false, message: "Event not found" });
        }

        res.json({ success: true, message: "Event deleted" });

    } catch (err) {
        console.error("Error deleting event:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// ===== ADMIN ROUTES =====

// Review event (approve/deny)
router.put("/:eventId/review", protect, admin, reviewEvent);

// Get all events (admin/testing)
router.get("/admin/all", protect, admin, getAllEvents);

export default router;