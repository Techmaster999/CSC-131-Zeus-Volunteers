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
    getOrganizerEvents,
    updateVolunteerRole,
    getEventVolunteers,
    startEvent,
    endEvent,
    cancelEvent,
    addAnnouncement,
    markAttendance,
    getUserCompletedEvents
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

// Get user's completed events (attended)
router.get("/my/completed", protect, getUserCompletedEvents);

// Check if user is registered for event (MUST BE BEFORE /:id)
router.get("/check-registration", protect, checkUserRegistration);

// Sign up for event
router.post("/signup", protect, addUserToEvent);

// Un-volunteer from event
router.delete("/signup", protect, removeUserFromEvent);

// ===== ROUTES WITH :id PARAMETER (MUST BE AFTER SPECIFIC ROUTES) =====

// Get single event by id
router.get("/:eventId", getEventById);

// Get all volunteers for an event (organizer/admin)
router.get("/:eventId/volunteers", protect, getEventVolunteers);

// Update a volunteer's role (organizer/admin)
router.put("/:eventId/volunteers/:volunteerId", protect, updateVolunteerRole);

// ===== EVENT LIFECYCLE ROUTES (organizer only) =====

// Start an event
router.put("/:eventId/start", protect, startEvent);

// End an event
router.put("/:eventId/end", protect, endEvent);

// Cancel an event
router.put("/:eventId/cancel", protect, cancelEvent);

// Mark attendance for a volunteer
router.put("/:eventId/attendance/:volunteerId", protect, markAttendance);

// Post an announcement
router.post("/:eventId/announcement", protect, addAnnouncement);

// ===== ORGANIZER ROUTES =====

// ===== MULTER CONFIGURATION =====
import multer from 'multer';
import path from 'path';

// Configure storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        // Create unique filename: fieldname-timestamp.ext
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Init upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 5000000 }, // 5MB limit
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
});

// Check file type
function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Error: Images Only!'));
    }
}

// ===== DEFAULT IMAGES MAP =====
const DEFAULT_IMAGES = {
    'community service': 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80',
    'environmental': 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80',
    'education': 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80',
    'health': 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80',
    'cultural': 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&q=80',
    'other': 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&q=80'
};

// ... existing routes ...

// ===== ORGANIZER ROUTES =====

// Create new event
// NOTE: Now using multer middleware 'upload.single'
router.post("/", upload.single('image'), async (req, res) => {
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
            maxVolunteers,
            duration
        } = req.body;

        // Flexible field names
        const eventTitle = title || eventName;
        const eventDescription = description || details;

        // Validation
        if (!eventTitle || !organizer || !eventDescription || !category || !location) {
            return res.status(400).json({
                success: false,
                message: "Required fields missing: eventName, organizer, details, category, location"
            });
        }

        // Build dateTime
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

        // --- IMAGE LOGIC ---
        let finalImageUrl = "";

        if (req.file) {
            // If file uploaded, use the local path served via static route
            // Construct full URL so frontend can use it directly
            const protocol = req.protocol;
            const host = req.get('host');
            finalImageUrl = `${protocol}://${host}/uploads/${req.file.filename}`;
        } else {
            // Apply default image based on category
            const catKey = (category || 'other').toLowerCase();
            finalImageUrl = DEFAULT_IMAGES[catKey] || DEFAULT_IMAGES['other'];
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
            announcements: announcements ? [{ message: announcements, sentAt: new Date() }] : [],
            commitments: commitments || "",
            // Save image URL
            eventPicture: finalImageUrl,
            imageUrl: finalImageUrl,
            maxVolunteers: maxVolunteers || 0,
            duration: duration || 2,
            status: 'upcoming',
            approvalStatus: 'pending'
        });

        await newEvent.save();

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