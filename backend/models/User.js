import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema ({
    //MongoDB data for authentication goes here
});

// Hash password logic
userSchema.pre('save', async function hashPassword(next) {
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
userSchema.methods.matchPassword = async function hashPassword(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);  
};

export default mongoose.model('User', userSchema);