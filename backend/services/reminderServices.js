import Reminder from "../models/Reminder.model.js";
import Event from "../models/Events.model.js";
import User from "../models/Accounts.model.js";
import UserEvent from "../models/User_Events.models.js";
import { sendEventReminderEmail } from "./emailService.js";

/**
 * Calculate trigger time based on event time and reminder offset
 * @param {Date} eventDateTime - The event's date/time
 * @param {String} offset - Offset like '1hour', '1day', '3days', '1week'
 * @returns {Date} - The reminder trigger time
 */
export const calculateTriggerTime = (eventDateTime, offset) => {
    const eventTime = new Date(eventDateTime);

    switch (offset) {
        case '1hour':
            return new Date(eventTime.getTime() - (1 * 60 * 60 * 1000));
        case '3hours':
            return new Date(eventTime.getTime() - (3 * 60 * 60 * 1000));
        case '1day':
            return new Date(eventTime.getTime() - (24 * 60 * 60 * 1000));
        case '3days':
            return new Date(eventTime.getTime() - (3 * 24 * 60 * 60 * 1000));
        case '1week':
            return new Date(eventTime.getTime() - (7 * 24 * 60 * 60 * 1000));
        default:
            return new Date(eventTime.getTime() - (24 * 60 * 60 * 1000)); // Default to 1 day
    }
};

/**
 * Get human-readable label for reminder offset
 */
export const getLabel = (offset) => {
    const labels = {
        '1hour': '1 hour before',
        '3hours': '3 hours before',
        '1day': '1 day before',
        '3days': '3 days before',
        '1week': '1 week before'
    };
    return labels[offset] || offset;
};

/**
 * Create a single reminder
 */
export const createReminder = async (userId, eventId, triggerTime, reminderType = 'custom', label = '', notificationType = 'both') => {
    try {
        // Check if event exists
        const event = await Event.findById(eventId);
        if (!event) {
            return { success: false, error: 'Event not found' };
        }

        // Check if reminder already exists
        const existingReminder = await Reminder.findOne({
            userId,
            eventId,
            triggerTime
        });

        if (existingReminder) {
            return { success: false, error: 'Reminder already exists for this time' };
        }

        // Create reminder
        const reminder = await Reminder.create({
            userId,
            eventId,
            triggerTime,
            reminderType,
            notificationType,
            label: label || 'Custom reminder',
            sent: false
        });

        console.log(`✅ Reminder created: ${reminder._id} for event ${eventId}`);
        return { success: true, data: reminder };
    } catch (error) {
        console.error('❌ Error creating reminder:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Create reminders based on user's default preferences
 * Called when user registers for an event
 */
export const createPreferenceReminders = async (userId, eventId) => {
    try {
        // Get user preferences
        const user = await User.findById(userId);
        if (!user) {
            return { success: false, error: 'User not found' };
        }

        // Get event details
        const event = await Event.findById(eventId);
        if (!event) {
            return { success: false, error: 'Event not found' };
        }

        const eventDateTime = event.dateTime || event.date;
        const defaultReminders = user.reminderPreferences?.defaultReminders || ['1day'];
        const remindersCreated = [];

        for (const offset of defaultReminders) {
            const triggerTime = calculateTriggerTime(eventDateTime, offset);

            // Only create reminder if trigger time is in the future
            if (triggerTime > new Date()) {
                const result = await createReminder(
                    userId,
                    eventId,
                    triggerTime,
                    'preference',
                    getLabel(offset),
                    'both'
                );

                if (result.success) {
                    remindersCreated.push(result.data);
                }
            }
        }

        console.log(`✅ Created ${remindersCreated.length} preference reminders for user ${userId}`);
        return { success: true, count: remindersCreated.length, data: remindersCreated };
    } catch (error) {
        console.error('❌ Error creating preference reminders:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Get all reminders for a user
 */
export const getUserReminders = async (userId) => {
    try {
        const reminders = await Reminder.find({ userId })
            .populate('eventId', 'eventName title dateTime date time location')
            .sort({ triggerTime: 1 });

        return { success: true, data: reminders };
    } catch (error) {
        console.error('❌ Error getting user reminders:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Delete a reminder
 */
export const deleteReminder = async (reminderId, userId) => {
    try {
        const reminder = await Reminder.findOneAndDelete({
            _id: reminderId,
            userId
        });

        if (!reminder) {
            return { success: false, error: 'Reminder not found or not authorized' };
        }

        console.log(`✅ Reminder deleted: ${reminderId}`);
        return { success: true, message: 'Reminder deleted' };
    } catch (error) {
        console.error('❌ Error deleting reminder:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Process due reminders - called by cron job
 * Finds reminders where triggerTime <= now and sent = false
 */
export const processReminders = async () => {
    const now = new Date();
    console.log(`⏰ Processing reminders at ${now.toISOString()}`);

    try {
        // Find all unsent reminders that are due
        const dueReminders = await Reminder.find({
            triggerTime: { $lte: now },
            sent: false
        }).populate('eventId').populate('userId', 'email firstName lastName reminderPreferences');

        console.log(`📋 Found ${dueReminders.length} due reminders`);

        let sentCount = 0;
        let errorCount = 0;

        for (const reminder of dueReminders) {
            try {
                const user = reminder.userId;
                const event = reminder.eventId;

                // Skip if user has email notifications disabled
                if (user?.reminderPreferences?.emailNotifications === false) {
                    console.log(`⏭️  Skipping reminder ${reminder._id} - user has email notifications disabled`);
                    // Still mark as sent so it doesn't keep trying
                    await Reminder.findByIdAndUpdate(reminder._id, { sent: true, sentAt: now });
                    continue;
                }

                // Skip if event is cancelled or doesn't exist
                if (!event || event.status === 'cancelled') {
                    console.log(`⏭️  Skipping reminder ${reminder._id} - event cancelled or not found`);
                    await Reminder.findByIdAndUpdate(reminder._id, { sent: true, sentAt: now });
                    continue;
                }

                // Calculate time until event
                const eventTime = new Date(event.dateTime || event.date);
                const timeDiff = eventTime - now;
                const hoursUntil = Math.round(timeDiff / (1000 * 60 * 60));
                const timeUntilEvent = hoursUntil > 24
                    ? `${Math.round(hoursUntil / 24)} days`
                    : `${hoursUntil} hours`;

                // Send email reminder
                if (reminder.notificationType === 'email' || reminder.notificationType === 'both') {
                    await sendEventReminderEmail(
                        event,
                        user.email,
                        `${user.firstName} ${user.lastName}`,
                        timeUntilEvent
                    );
                }

                // Mark as sent
                await Reminder.findByIdAndUpdate(reminder._id, {
                    sent: true,
                    sentAt: now
                });

                sentCount++;
                console.log(`✅ Reminder sent: ${reminder._id}`);

            } catch (reminderError) {
                console.error(`❌ Error processing reminder ${reminder._id}:`, reminderError);
                errorCount++;
            }
        }

        console.log(`📊 Reminder processing complete: ${sentCount} sent, ${errorCount} errors`);
        return { success: true, sent: sentCount, errors: errorCount };

    } catch (error) {
        console.error('❌ Error processing reminders:', error);
        return { success: false, error: error.message };
    }
};

export default {
    createReminder,
    createPreferenceReminders,
    getUserReminders,
    deleteReminder,
    processReminders,
    calculateTriggerTime,
    getLabel
};
