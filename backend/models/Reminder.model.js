import mongoose from "mongoose";

const ReminderSchema = new mongoose.Schema({
    // User receiving the reminder
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // Event to remind about
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },

    // Type of reminder
    reminderType: {
        type: String,
        enum: ['custom', 'preference'],
        default: 'custom'
    },

    // When to send the reminder
    triggerTime: {
        type: Date,
        required: true
    },

    // How to notify (email, in-app, or both)
    notificationType: {
        type: String,
        enum: ['email', 'inApp', 'both'],
        default: 'both'
    },

    // Has the reminder been sent?
    sent: {
        type: Boolean,
        default: false
    },

    // When was the reminder sent?
    sentAt: {
        type: Date
    },

    // User-friendly label (e.g., "1 day before", "1 hour before")
    label: {
        type: String
    }

}, { timestamps: true });

// Indexes for efficient queries
ReminderSchema.index({ userId: 1, eventId: 1 });
ReminderSchema.index({ triggerTime: 1, sent: 1 });  // For cron job queries
ReminderSchema.index({ userId: 1, sent: 1 });

// Prevent duplicate reminders (same user, event, and trigger time)
ReminderSchema.index(
    { userId: 1, eventId: 1, triggerTime: 1 },
    { unique: true }
);

const Reminder = mongoose.model('Reminder', ReminderSchema);

export default Reminder;
