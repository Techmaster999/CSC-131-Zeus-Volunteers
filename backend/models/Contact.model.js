import mongoose from 'mongoose';

const ContactSchema = new mongoose.Schema({
    // Message content
    message: {
        type: String,
        required: true
    },
    // User info (populated if logged in, otherwise optional)
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    // For anonymous submissions
    email: {
        type: String,
        default: null
    },
    name: {
        type: String,
        default: null
    },
    // Status tracking
    status: {
        type: String,
        enum: ['pending', 'reviewed', 'resolved'],
        default: 'pending'
    },
    // Admin response
    adminNotes: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

const Contact = mongoose.model('Contact', ContactSchema);
export default Contact;
