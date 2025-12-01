import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
    eventName:{
        type: String,
        required: true
    },
    organizer:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        required: true
    },
    time:{
        type: String,
        required: true
    },
    details:{
        type: String,
        required: true
    },
    imageUrl:{
        type: String,
        required: false
    },
    // New status field for approval or denial
    status:{
        type: String,
        enum: ['pending', 'approved', 'denied'],
        default: 'pending'
    },
    reviewedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',    // admin user who approved/denied
        required: false
    },
    reviewNotes:{
        type: String,
        required: false
    }
}, { timestamps: true });

const Event = mongoose.model('Event', EventSchema);

export default Event;