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
UserEventsSchema.index({ eventId: 1, userId: 1}, { unique:true});
UserEventsSchema.index({ eventId: 1});


const UserEvent = mongoose.model('UserEvent', UserEventsSchema);
export default UserEvent;