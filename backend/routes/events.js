import express from "express";
const router = express.Router();
import { protect, admin, organizer } from "../middleware/auth.js";
import Event from "../models/Events.model.js";
import User from "../models/Accounts.model.js";
import UserEvent from "../models/User_Events.models.js";

// Import email service
import { sendEventCreatedEmail } from "../services/emailService.js";

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
    removeUserFromEvent,
    checkUserRegistration,
    getUserRegisteredEvents,
    getUserHistory,
    reviewEvent,
    getOrganizerEvents
} from "../controllers/eventController.js";

// ===== PUBLIC ROUTES =====

// Browse all approved upcoming events (uses filtering logic)
router.get("/", getEvents);

// Search with filters (query, category, location, dates, skills)
router.get("/search", searchEvents);

// Get all categories
router.get("/categories", getCategories);

// Get events by category
router.get("/category/:category", getEventsByCategory);

// ===== VOLUNTEER ROUTES (Protected) =====

// Get user's registered events
router.get("/my/registered", protect, getUserRegisteredEvents);

// Get user's participation history
router.get("/my/history", protect, getUserHistory);

// Get organizer's created events (includes pending/denied)
router.get("/my/created", protect, getOrganizerEvents);

// Check if user is registered for event (MUST BE BEFORE /:id)
router.get("/check-registration", protect, checkUserRegistration);

// Sign up for event
router.post("/signup", protect, addUserToEvent);

// Un-volunteer from event
router.delete("/signup", protect, removeUserFromEvent);

// ===== ROUTES WITH :id PARAMETER (MUST BE AFTER SPECIFIC ROUTES) =====

// Get single event by id
router.get("/:eventId", getEventById);

// ===== ORGANIZER ROUTES =====

// Create new event
router.post("/", async (req, res) => {  // (with or without protect, organizer)
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

        // Flexible field names
        const eventTitle = title || eventName;
        const eventDescription = description || details;

        // ✅ FIXED VALIDATION:
        if (!eventTitle || !organizer || !eventDescription || !category || !location) {
            return res.status(400).json({
                success: false,
                message: "Required fields missing: eventName, organizer, details, category, location"
            });
        }

        // Build dateTime from date+time or use provided dateTime
        let finalDateTime;
        if (dateTime) {
            finalDateTime = new Date(dateTime);
        } else if (date && time) {
            finalDateTime = new Date(`${date}T${time}`);
        } else if (date) {
            finalDateTime = new Date(date);
        } else {
            return res.status(400).json({
                success: false,
                message: "Either dateTime or date is required"
            });
        }

        const newEvent = new Event({
            eventName: eventTitle,
            title: eventTitle,
            organizer,
            organization: organizer,
            date: date ? new Date(date) : finalDateTime,
            time: time || "00:00",
            dateTime: finalDateTime,
            details: eventDescription,
            description: eventDescription,
            category,
            location,
            skills: skills || [],
            announcements: announcements || "",
            commitments: commitments || "",
            eventPicture: imageUrl,
            imageUrl: imageUrl,
            maxVolunteers: maxVolunteers || 0,
            duration: duration || 2,
            status: 'upcoming',
            approvalStatus: 'pending'  // Events now require admin approval
        });

        await newEvent.save();

        // Send email notification to organizer
        // Note: Using organizer field as email for now
        // In production, you'd fetch the actual organizer's email from User model
        if (organizer) {
            await sendEventCreatedEmail(newEvent, organizer).catch(err => {
                console.error('Email notification failed (non-blocking):', err.message);
            });
        }

        res.status(201).json({
            success: true,
            message: "Event created successfully",
            data: newEvent,
        });

    } catch (err) {
        console.error("Error creating event:", err);
        res.status(500).json({
            success: false,
            message: err.message
        });
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