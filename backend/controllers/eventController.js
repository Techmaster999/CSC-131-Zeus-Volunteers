import Event from "../models/Events.model.js";
import User from "../models/Accounts.model.js";
import mongoose from "mongoose";
import { isValidObjectId } from "mongoose";
import UserEvent from "../models/User_Events.models.js";
// import Notification from "../models/Notification.js";
// import SignUp from "../models/SignUp.js"; // file doesn't exist 


// Get /events/:eventID/users
export const getEventUsers = async (req, res) => {
    const { eventId } = req.params;

    if(!isValidObjectId(eventId)) {
        return res.status(400).json({ message: "Invalid event ID" });
    }
    try {
        console.log("eventId param:", eventId);
        const links = await UserEvent.find({ eventId })
        // Populating the VIRTUAL field 'user' to get user details along with role, not the userId
        .populate({ path: "userId", select: "_id firstName lastName userName email role"})
        .sort ({ createdAt: 1 })
        .lean();

        console.log("UserEvent matches:", links.length);

        const attendees = links
        // .filter(l => l.user) // virtual 'user' is now present
        .map(l => ({
            user: l.userId,   // contains role from Accounts.model.js
            joinedAt: l.createdAt,
        }));

        return res.json({
            success: true,
            count: attendees.length,
            attendees,
        });
    } catch (err) {
            return res.status(500).json({ success: false, message: err.message } );
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
                    from: "users",              // <- collection for Accounts.model.js
                    localField: "userId",
                    foreignField: "_id",
                    as: "user"
                }
            },
          { $unwind: "$user" },           // remove docs where no matching user
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

        // shape to match your previous response
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



//Get user's registered events 
export const getUserRegisteredEvents = async (req, res) => {
    try {
        const userId = req.user.id;

        const signups = await SignUp.find({
            user: userId,
            status: { $in: ['registered']}
        })
        .populate('event')
        .sort({ 'event.dateTime': 1});

        const activeEvents = signups
            .filter(s => s.event && s.event.status !== 'cancelled')
            .map(s => ({
                signUpId: s._id,
                role: s.role,
                status: s.status,
                ...s.event.toObject()
            }));

            res.json({
                success: true,
                data: activeEvents
            });
    } catch (error) {
        res.status(500).json({
            succes: false,
            message: error.message
        });
    }
};

//Get user's participation history
export const getUserHistory = async (req, res) => {
    try {
        const userId = req.user.id; // From auth middleware

        const history = await Participation.find({ user: userId })
            .populate('activity') // Get Full activity details
            .sort({ createdAt: -1 }); // Most recent first

        // Count activities by status
        const stats = {
            total: history.length,
            attended: history.filter(p => p.status === 'attended').length,
            registered: history.filter(p => p.status === 'registered').length,
            cancelled: history.filter([p => p.status === 'cancelled']).length
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
    const { userId, eventId } = req.body;

    if (!isValidObjectId(userId) ) {
        return res.status(400).json({ message: "Invalid user ID" });
    }
    if (!isValidObjectId(eventId)) {
        return res.status(400).json({ message: "Invalid event ID" });
    }

    const [userExists, eventExists] = await Promise.all([
        User.exists({ _id: userId}),
        Event.exists({ _id: eventId}),
    ]);
    
    if (!userExists) return res.status(404).json({ success: false, message: "User not found" });
    if (!eventExists) return res.status(404).json({ success: false, message: "Event not found" });

    try {
        const link = await UserEvent.findOOneAndUpdate(
            {userId, eventId},
            { $setOnInsert: { userId, eventId } },
            { new: true, upsert: true }
        ).lean();

        const alreadyExists = await UserEvent.findOne({ userId, eventId });
        if(alreadyExists && alreadyExists._id.toString() !== link._id.toString()) {
            return res
            .status(409)
            .json({ success: false, message: "User is already registered for this event" });
        }

        return res.status(201).json({
            success: true,
            message: "User successfully registered for the event",
            data: link
        });
    }
    catch (err) {
        if(err.code === 11000) {
            return res
            .status(409)
            .json({ success: false, message: "User is already registered for this event" })

        }
    }
    return res.status(500).json({ success: false, message: "Server Error" });
}

// approve or deny events 
export const reviewEvent = async (req, res) => {
    const { eventId } = req.params;
    const { decision, adminId, notes } = req.body;

    if(!["approved", "denied"].includes(decision)) {
        return res.status(400).json({ success: false, message: "Decision must be 'approved' or 'denied'" });
    }

    if(!isValidObjectId(eventId) || !isValidObjectId(adminId)) {
        return res.status(400).json({ success: false, message: "Invalid event ID or admin ID" });
    }

    try {
        const event = await Event.findByIdAndUpdate(
            eventId,
            {
                status: decision,
                reviewedBy: adminId,
                reviewNotes: notes || ""
            },
            { new: true }
        );
        if(!event) {
            return res.status(404).json({ success: false, message: "Event not found" });
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
        return res.status(500).json(
            {
                success: false,
                message: err.message || "Server Error"
        })
    }
}