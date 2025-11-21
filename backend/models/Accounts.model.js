import mongoose from 'mongoose';
import bcrypt from "bcrypt";

const UserAccountSchema = new mongoose.Schema({
    firstName:{
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
    password: { // add hashing
        type: String,
        required: true
    },
    country:{
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
    }
}, { timestamps: true });


// Hash password logic
UserAccountSchema.pre('save', async function hashPassword(next) {
    //Only hash if password is modified
    if (!this.isModified('password')) {
        return next();
    }

    //generate a salt for the password
    const salt = await bcrypt.genSalt(10);
    //adds the salt to the password
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

//Compare entered password with hashed password
UserAccountSchema.methods.matchPassword = async function hashPassword(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);  
};


const User = mongoose.model('User', UserAccountSchema);
export default User;