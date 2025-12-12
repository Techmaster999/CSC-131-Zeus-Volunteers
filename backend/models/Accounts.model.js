import mongoose from 'mongoose';
import bcrypt from "bcrypt";

const UserAccountSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: false   // ✅ THIS FIXES LOGIN
    },
    country: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['volunteer', 'organizer', 'admin'],
        default: 'volunteer'
    },
    // Reminder preferences
    reminderPreferences: {
        emailNotifications: {
            type: Boolean,
            default: true
        },
        // Default reminder times: '1hour', '1day', '3days', '1week'
        defaultReminders: [{
            type: String,
            enum: ['1hour', '3hours', '1day', '3days', '1week']
        }]
    },
    phone: {
        type: String
    }
}, { timestamps: true });


// Hash password before saving
UserAccountSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare plain password with hashed password
UserAccountSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', UserAccountSchema);
export default User;
