import Event from "../models/Event.js";
import SignUp from "../models/SignUp.js";
import User from "../models/user.js";
import Notification from "../models/Notification.js";


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
            attended: hisotry.filter(p => p.status === 'attended').length,
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
            succes: false,
            message: error.message
        });
    }
};
