import Reminder from "../models/Reminder.model.js";
import Event from "../models/Events.model.js";
import User from "../models/Accounts.model.js";
import { isValidObjectId } from "mongoose";
import {
    createReminder,
    createPreferenceReminders,
    getUserReminders,
    deleteReminder,
    calculateTriggerTime,
    getLabel
} from "../services/reminderServices.js";

/**
 * GET /api/reminders
 * Get all reminders for the logged-in user
 */
export const getReminders = async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await getUserReminders(userId);

        if (!result.success) {
            return res.status(500).json(result);
        }

        res.json({
            success: true,
            count: result.data.length,
            data: result.data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * POST /api/reminders
 * Create a custom reminder
 * Body: { eventId, triggerTime, notificationType, label }
 * OR
 * Body: { eventId, reminderOffset } - for preset times like '1day', '1hour'
 */
export const addReminder = async (req, res) => {
    try {
        const userId = req.user.id;
        const { eventId, triggerTime, reminderOffset, notificationType, label } = req.body;

        if (!eventId) {
            return res.status(400).json({
                success: false,
                message: "Event ID is required"
            });
        }

        if (!isValidObjectId(eventId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid event ID"
            });
        }

        // Get event to calculate trigger time if offset provided
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        let finalTriggerTime = triggerTime ? new Date(triggerTime) : null;
        let finalLabel = label || '';

        // If reminderOffset is provided, calculate trigger time
        if (reminderOffset && !triggerTime) {
            finalTriggerTime = calculateTriggerTime(event.dateTime || event.date, reminderOffset);
            finalLabel = getLabel(reminderOffset);
        }

        if (!finalTriggerTime) {
            return res.status(400).json({
                success: false,
                message: "Either triggerTime or reminderOffset is required"
            });
        }

        // Check if trigger time is in the future
        if (finalTriggerTime <= new Date()) {
            return res.status(400).json({
                success: false,
                message: "Reminder time must be in the future"
            });
        }

        // Check if trigger time is before the event
        const eventTime = new Date(event.dateTime || event.date);
        if (finalTriggerTime >= eventTime) {
            return res.status(400).json({
                success: false,
                message: "Reminder must be set before the event time"
            });
        }

        const result = await createReminder(
            userId,
            eventId,
            finalTriggerTime,
            'custom',
            finalLabel,
            notificationType || 'both'
        );

        if (!result.success) {
            return res.status(400).json(result);
        }

        res.status(201).json({
            success: true,
            message: "Reminder created successfully",
            data: result.data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * DELETE /api/reminders/:id
 * Delete a reminder
 */
export const removeReminder = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid reminder ID"
            });
        }

        const result = await deleteReminder(id, userId);

        if (!result.success) {
            return res.status(404).json(result);
        }

        res.json({
            success: true,
            message: "Reminder deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * PUT /api/reminders/preferences
 * Update user's reminder preferences
 * Body: { emailNotifications, defaultReminders }
 */
export const updatePreferences = async (req, res) => {
    try {
        const userId = req.user.id;
        const { emailNotifications, defaultReminders } = req.body;

        // Validate defaultReminders array
        const validOffsets = ['1hour', '3hours', '1day', '3days', '1week'];
        if (defaultReminders) {
            const invalidOffsets = defaultReminders.filter(o => !validOffsets.includes(o));
            if (invalidOffsets.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: `Invalid reminder offsets: ${invalidOffsets.join(', ')}. Valid options: ${validOffsets.join(', ')}`
                });
            }
        }

        const updateData = {};
        if (emailNotifications !== undefined) {
            updateData['reminderPreferences.emailNotifications'] = emailNotifications;
        }
        if (defaultReminders !== undefined) {
            updateData['reminderPreferences.defaultReminders'] = defaultReminders;
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true, runValidators: true }
        ).select('reminderPreferences');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.json({
            success: true,
            message: "Reminder preferences updated",
            data: user.reminderPreferences
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * GET /api/reminders/preferences
 * Get user's reminder preferences
 */
export const getPreferences = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId).select('reminderPreferences');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.json({
            success: true,
            data: user.reminderPreferences || {
                emailNotifications: true,
                defaultReminders: []
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export default {
    getReminders,
    addReminder,
    removeReminder,
    updatePreferences,
    getPreferences
};
