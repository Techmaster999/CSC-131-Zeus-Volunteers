import User from "../models/user.js";
import generateToken from "../utils/generateToken.js";

// Register new user
export const register = async (req, res) => {
    try {
        const { username, email, password, firstName, lastName, accountType, phoneNumber } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ $or: [{ email }, { username }] });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with that email or username'
            });
        }

        // Create user
        const user = await User.create ({
            username,
            email,
            password,
            firstName,
            lastName,
            accountType: accountType || 'volunteer',
            phoneNumber
        });

        res.status(201).json({
            success: true,
            message: 'Account created successfully',
            data: {
                id: user._id,
                username: user.username,
                email: user.email,
                accountType: user.accountType,
                token: generateToken(user._id)
            }
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Login user 
export const login = async (req, res) => {
    try {
        const { email, password } = req.body; // add username here

        const user = await User.findOne({ email }).select('+password');

        if(!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check password
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                id: user._id,
                username: user.username,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                accountType: user.accountType,
                token: generateToken(user._id)
            }
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Get user profile
export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        res.json({
            success: true,
            data: user
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Update user profile
export const updateProfile = async (req, res) => {
    try {
        const { firstName, lastName, phoneNumber, city, state, country, emailNotifications, reminderFrequency} = req.body;

        const user = await User.findByIdAndUpdate(
            req.user.id,
            {
                firstName,
                lastName,
                phoneNumber,
                city,
                state,
                country,
                emailNotifications,
                reminderFrequency
            },
            { new: true, runValidators: true}
        );

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: user
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}