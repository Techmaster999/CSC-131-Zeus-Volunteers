import User from "../models/Accounts.model.js";
import generateToken from "../utils/generateToken.js";

// REGISTER USER
export const register = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            userName,
            email,
            password,
            country,
            state,
            city,
            role,
            phone
        } = req.body;

        // Check required fields
        if (
            !firstName ||
            !lastName ||
            !userName ||
            !email ||
            !password ||
            !country ||
            !state ||
            !city ||
            !role ||
            !phone
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        // Check if user already exists
        const userExists = await User.findOne({
            $or: [{ email }, { userName }],
        });

        if (userExists) {
            return res.status(400).json({
                success: false,
                message: "User already exists with that username or email",
            });
        }

        // Create user
        const user = await User.create({
            firstName,
            lastName,
            userName,
            email,
            password,
            country,
            state,
            city,
            role: role || "volunteer",
            phone
        });

        res.status(201).json({
            success: true,
            message: "Account created successfully",
            data: {
                id: user._id,
                userName: user.userName,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            },
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// LOGIN USER
export const login = async (req, res) => {
    try {
        console.log("REQ BODY:", req.body);

        const { identifier, email, password } = req.body;

        // allow login via email OR username
        const loginValue = email || identifier;

        // Validate input
        if (!loginValue || !password) {
            return res.status(400).json({
                success: false,
                message: "Email/Username and password are required",
            });
        }

        // Find user by email OR username
        const user = await User.findOne({
            $or: [
                { email: loginValue },
                { userName: loginValue }
            ]
        }).select("+password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid login credentials",
            });
        }

        // Check password
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid login credentials",
            });
        }

        res.json({
            success: true,
            message: "Login successful",
            data: {
                id: user._id,
                userName: user.userName,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                token: generateToken(user._id),
            },
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};


// GET USER PROFILE
export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        res.json({
            success: true,
            data: user,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// UPDATE USER PROFILE
export const updateProfile = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            phone,
            city,
            state,
            country,
            emailNotifications,
            reminderFrequency,
        } = req.body;

        const user = await User.findByIdAndUpdate(
            req.user.id,
            {
                firstName,
                lastName,
                phone,
                city,
                state,
                country,
                emailNotifications,
                reminderFrequency,
            },
            { new: true, runValidators: true }
        ).select("-password");

        res.json({
            success: true,
            message: "Profile updated successfully",
            data: user,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
