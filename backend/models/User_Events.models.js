import express from "express";
import User from "./Accounts.model.js";
import Event from "./Events.model.js";
import mongoose from "mongoose";



const UserEventsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    // Volunteer's assigned role for this event
    role: {
        type: String,
        enum: ['Team Lead', 'Setup Crew', 'Registration', 'Cleanup', 'General Volunteer', 'Coordinator', 'Other'],
        default: 'General Volunteer'
    },
    // Status of volunteer participation
    status: {
        type: String,
        enum: ['registered', 'confirmed', 'attended', 'no-show', 'cancelled'],
        default: 'registered'
    },
    // Optional notes about the volunteer's participation
    notes: {
        type: String,
        default: ''
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
}

);

// pull user role here 
UserEventsSchema.virtual("user", {
    ref: "User",
    localField: "userId",
    foreignField: "_id",
    justOne: true,
});

// helpful indexes 
UserEventsSchema.index({ eventId: 1, userId: 1 }, { unique: true });
UserEventsSchema.index({ eventId: 1 });


const UserEvent = mongoose.model('UserEvent', UserEventsSchema);
export default UserEvent;