import Event from "../models/Events.model.js";
import User from "../models/Accounts.model.js";
import mongoose from "mongoose";
import { isValidObjectId } from "mongoose";
import UserEvent from "../models/User_Events.models.js";
import { sendEventApprovedEmail, sendEventDeniedEmail } from "../services/emailService.js";
// import Notification from "../models/Notification.js";
// import SignUp from "../models/SignUp.js"; // file doesn't exist 



// Get /events/:eventID/users
export const getEventUsers = async (req, res) => {
    const { eventId } = req.params;

    if (!isValidObjectId(eventId)) {
        return res.status(400).json({ message: "Invalid event ID" });
    }
    try {
        console.log("eventId param:", eventId);
        const links = await UserEvent.find({ eventId })
            //        .populate({ path: "userId", select: "_id firstName lastName userName email role"})
            .sort({ createdAt: 1 })
            .lean();

        console.log("UserEvent matches:", links.length);

        const attendees = links
            .map(l => ({
                user: l.userId,
                joinedAt: l.createdAt,
            }));

        return res.json({
            success: true,
            count: attendees.length,
            attendees,
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

// GET /api/events/:eventId/users-agg
export const getEventUsersAgg = async (req, res) => {
    const { eventId } = req.params;

    if (!isValidObjectId(eventId)) {
        return res.status(400).json({ success: false, message: "Invalid event ID" });
    }

    try {
        const _eventId = new mongoose.Types.ObjectId(eventId);

        const docs = await UserEvent.aggregate([
            { $match: { eventId: _eventId } },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user"
                }
            },
            { $unwind: "$user" },
            {
                $project: {
                    _id: 0,
                    joinedAt: "$createdAt",
                    "user._id": 1,
                    "user.firstName": 1,
                    "user.lastName": 1,
                    "user.userName": 1,
                    "user.email": 1,
                    "user.role": 1
                }
            },
            { $sort: { joinedAt: 1 } }
        ]);

        const attendees = docs.map(d => ({ user: d.user, joinedAt: d.joinedAt }));

        return res.json({
            success: true,
            count: attendees.length,
            attendees
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};



// Get user's participation history
export const getUserHistory = async (req, res) => {
    try {
        const userId = req.user.id;

        const history = await Participation.find({ user: userId })
            //            .populate('activity')
            .sort({ createdAt: -1 });

        const stats = {
            total: history.length,
            attended: history.filter(p => p.status === 'attended').length,
            registered: history.filter(p => p.status === 'registered').length,
            cancelled: history.filter(p => p.status === 'cancelled').length
        };

        res.json({
            success: true,
            data: {
                participation: history,
                stats
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Attach a user to an event 
export const addUserToEvent = async (req, res) => {
    const { userId, eventId, role, notes } = req.body;

    if (!isValidObjectId(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
    }
    if (!isValidObjectId(eventId)) {
        return res.status(400).json({ message: "Invalid event ID" });
    }

    // Validate role if provided
    const validRoles = ['Team Lead', 'Setup Crew', 'Registration', 'Cleanup', 'General Volunteer', 'Coordinator', 'Other'];
    const volunteerRole = role && validRoles.includes(role) ? role : 'General Volunteer';

    const [userExists, eventExists] = await Promise.all([
        User.exists({ _id: userId }),
        Event.exists({ _id: eventId }),
    ]);

    if (!userExists) return res.status(404).json({ success: false, message: "User not found" });
    if (!eventExists) return res.status(404).json({ success: false, message: "Event not found" });

    try {
        // Check if already registered
        const existing = await UserEvent.findOne({ userId, eventId });
        if (existing) {
            return res
                .status(409)
                .json({ success: false, message: "User is already registered for this event" });
        }

        // Create new registration with role
        const link = await UserEvent.create({
            userId,
            eventId,
            role: volunteerRole,
            status: 'registered',
            notes: notes || ''
        });

        return res.status(201).json({
            success: true,
            message: "User successfully registered for the event",
            data: link
        });
    }
    catch (err) {
        if (err.code === 11000) {
            return res
                .status(409)
                .json({ success: false, message: "User is already registered for this event" })
        }
        return res.status(500).json({ success: false, message: err.message || "Server Error" });
    }
};

// Remove a user from an event (un-volunteer)
export const removeUserFromEvent = async (req, res) => {
    const { userId, eventId } = req.body;

    if (!isValidObjectId(userId)) {
        return res.status(400).json({ success: false, message: "Invalid user ID" });
    }
    if (!isValidObjectId(eventId)) {
        return res.status(400).json({ success: false, message: "Invalid event ID" });
    }

    try {
        const result = await UserEvent.findOneAndDelete({ userId, eventId });

        if (!result) {
            return res.status(404).json({
                success: false,
                message: "User was not registered for this event"
            });
        }

        return res.status(200).json({
            success: true,
            message: "User successfully unregistered from the event"
        });
    } catch (err) {
        console.error("Error removing user from event:", err);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Update a volunteer's role for an event
export const updateVolunteerRole = async (req, res) => {
    const { eventId, volunteerId } = req.params;
    const { role, status, notes } = req.body;

    if (!isValidObjectId(eventId) || !isValidObjectId(volunteerId)) {
        return res.status(400).json({
            success: false,
            message: "Invalid event ID or volunteer ID"
        });
    }

    const validRoles = ['Team Lead', 'Setup Crew', 'Registration', 'Cleanup', 'General Volunteer', 'Coordinator', 'Other'];
    const validStatuses = ['registered', 'confirmed', 'attended', 'no-show', 'cancelled'];

    const updateData = {};
    if (role && validRoles.includes(role)) updateData.role = role;
    if (status && validStatuses.includes(status)) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;

    if (Object.keys(updateData).length === 0) {
        return res.status(400).json({
            success: false,
            message: "No valid fields to update. Valid roles: " + validRoles.join(', ')
        });
    }

    try {
        const registration = await UserEvent.findOneAndUpdate(
            { userId: volunteerId, eventId },
            { $set: updateData },
            { new: true }
        ).populate('userId', 'firstName lastName email');

        if (!registration) {
            return res.status(404).json({
                success: false,
                message: "Volunteer registration not found"
            });
        }

        return res.json({
            success: true,
            message: "Volunteer role updated successfully",
            data: registration
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message || "Server Error"
        });
    }
};

// Get all volunteers for an event with their roles
export const getEventVolunteers = async (req, res) => {
    const { eventId } = req.params;

    if (!isValidObjectId(eventId)) {
        return res.status(400).json({
            success: false,
            message: "Invalid event ID"
        });
    }

    try {
        const volunteers = await UserEvent.find({ eventId })
            .populate('userId', 'firstName lastName email phone role')
            .sort({ role: 1, createdAt: 1 });

        // Group by role for easy viewing
        const byRole = volunteers.reduce((acc, v) => {
            const role = v.role || 'General Volunteer';
            if (!acc[role]) acc[role] = [];
            acc[role].push({
                _id: v._id,
                volunteerId: v.userId?._id,
                firstName: v.userId?.firstName,
                lastName: v.userId?.lastName,
                email: v.userId?.email,
                phone: v.userId?.phone,
                role: v.role,
                status: v.status,
                notes: v.notes,
                registeredAt: v.createdAt
            });
            return acc;
        }, {});

        return res.json({
            success: true,
            count: volunteers.length,
            byRole,
            data: volunteers
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message || "Server Error"
        });
    }
};

// Check if user is registered for an event
export const checkUserRegistration = async (req, res) => {
    const { userId, eventId } = req.query;

    console.log("checkUserRegistration called with userId:", userId, "eventId:", eventId);

    if (!isValidObjectId(userId) || !isValidObjectId(eventId)) {
        console.log("Invalid ObjectId detected");
        return res.status(400).json({ success: false, message: "Invalid user or event ID" });
    }

    try {
        // Convert string IDs to ObjectId
        const userObjectId = new mongoose.Types.ObjectId(userId);
        const eventObjectId = new mongoose.Types.ObjectId(eventId);

        const registration = await UserEvent.findOne({
            userId: userObjectId,
            eventId: eventObjectId
        });
        console.log("Registration found:", registration);

        return res.status(200).json({
            success: true,
            isRegistered: !!registration
        });
    } catch (err) {
        console.error("Error checking registration:", err);
        return res.status(500).json({ success: false, message: "Server Error", error: err.message });
    }
};

// Approve or deny events 
export const reviewEvent = async (req, res) => {
    const { eventId } = req.params;
    const { decision, adminId, notes } = req.body;

    if (!["approved", "denied"].includes(decision)) {
        return res.status(400).json({ success: false, message: "Decision must be 'approved' or 'denied'" });
    }

    if (!isValidObjectId(eventId) || !isValidObjectId(adminId)) {
        return res.status(400).json({ success: false, message: "Invalid event ID or admin ID" });
    }

    try {
        const event = await Event.findByIdAndUpdate(
            eventId,
            {
                approvalStatus: decision,
                reviewedBy: adminId,
                reviewNotes: notes || ""
            },
            { new: true }
        );
        if (!event) {
            return res.status(404).json({ success: false, message: "Event not found" });
        }

        // Send email notification to organizer
        // Note: Using organizer field as email for now
        // In production, you'd fetch the actual organizer's email from User model
        if (event.organizer) {
            if (decision === "approved") {
                await sendEventApprovedEmail(event, event.organizer, notes).catch(err => {
                    console.error('Email notification failed (non-blocking):', err.message);
                });
            } else if (decision === "denied") {
                await sendEventDeniedEmail(event, event.organizer, notes).catch(err => {
                    console.error('Email notification failed (non-blocking):', err.message);
                });
            }
        }

        res.json({
            success: true,
            message: `Event ${decision} successfully`,
            data: {
                _id: event._id,
                eventName: event.eventName,
                Organizer: event.organizer,
                status: event.status,
                reviewedBy: event.reviewedBy,
                reviewNotes: event.reviewNotes
            }
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message || "Server Error"
        })
    }
};

// GET all events (for testing/admin)
export const getAllEvents = async (req, res) => {
    try {
        const events = await Event.find();

        res.json({
            success: true,
            count: events.length,
            data: events
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

// ====== NEW FILTERING FUNCTIONS ======

// Get events the user has signed up for
export const getUserRegisteredEvents = async (req, res) => {
    try {
        const userId = req.user._id;

        console.log("Fetching registered events for user:", userId);

        // Find all UserEvent records for this user and populate the event details
        const registrations = await UserEvent.find({ userId })
            .populate('eventId')
            .lean();

        console.log("Found registrations:", registrations.length);

        // Extract the event details (filter out any null eventIds)
        const events = registrations
            .filter(reg => reg.eventId)
            .map(reg => reg.eventId);

        console.log("Returning events:", events.length);

        res.json({
            success: true,
            data: events
        });

    } catch (error) {
        console.error('Error in getUserRegisteredEvents:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Browse all approved upcoming events
export const getEvents = async (req, res) => {
    try {
        const events = await Event.find({
            status: 'upcoming',
            approvalStatus: 'approved'
        })
            //        .populate('createdBy', 'username organization email')
            .sort({ dateTime: 1 })
            .lean();

        console.log("📊 Total events in DB:", events.length);

        res.json({
            success: true,
            count: events.length,
            data: events
        });

    } catch (error) {
        console.error("❌ Error:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Search events with filters INCLUDING SKILLS
export const searchEvents = async (req, res) => {
    try {
        const { query, category, location, startDate, endDate, skills } = req.query;

        // ✅ START WITH EMPTY CRITERIA
        let searchCriteria = {};

        // Only add filters if they're provided
        if (query && query.trim()) {
            searchCriteria.$text = { $search: query };
        }

        if (category && category !== 'all') {
            searchCriteria.category = category;
        }

        if (location) {
            searchCriteria.location = {
                $regex: location,
                $options: 'i'
            };
        }

        if (startDate || endDate) {
            searchCriteria.dateTime = {};
            if (startDate) {
                searchCriteria.dateTime.$gte = new Date(startDate);
            }
            if (endDate) {
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                searchCriteria.dateTime.$lte = end;
            }
        }

        if (skills) {
            const skillsArray = Array.isArray(skills)
                ? skills
                : skills.split(',').map(s => s.trim());
            searchCriteria.skills = { $in: skillsArray };
        }

        console.log("🔍 Search criteria:", searchCriteria);

        const events = await Event.find(searchCriteria)
            //    .populate('createdBy', 'username organization email')
            .sort({ dateTime: 1 })
            .lean();

        res.json({
            success: true,
            count: events.length,
            data: events
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get single event by ID
export const getEventById = async (req, res) => {
    try {
        const { eventId } = req.params;

        const event = await Event.findById(eventId)
        //            .populate('createdBy', 'username email organization phoneNumber');

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        res.json({
            success: true,
            data: event
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get events by category
export const getEventsByCategory = async (req, res) => {
    try {
        const { category } = req.params;

        const events = await Event.find({
            category,
            //            status: 'upcoming',
            approvalStatus: 'approved'
        })
            //        .populate('createdBy', 'username organization')
            .sort({ dateTime: 1 });

        res.json({
            success: true,
            category,
            count: events.length,
            data: events
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get all categories with counts
export const getCategories = async (req, res) => {
    try {
        const categories = [
            'cultural',
            'environmental',
            'health',
            'education',
            'community service',
            'other'
        ];

        const categoriesWithCounts = await Promise.all(
            categories.map(async (cat) => {
                const count = await Event.countDocuments({
                    category: cat,
                    //                    status: 'upcoming',
                    approvalStatus: 'approved'
                });

                return {
                    name: cat,
                    count
                };
            })
        );

        res.json({
            success: true,
            data: categoriesWithCounts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
