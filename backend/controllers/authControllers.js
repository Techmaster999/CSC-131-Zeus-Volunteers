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
                city: user.city,
                state: user.state,
                country: user.country,
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

// CHANGE PASSWORD
export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        // Validate input
        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Current password and new password are required"
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: "New password must be at least 6 characters"
            });
        }

        // Get user with password
        const user = await User.findById(req.user.id).select("+password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Check if current password is correct
        const isMatch = await user.matchPassword(currentPassword);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Current password is incorrect"
            });
        }

        // Update password (will be hashed by pre-save hook)
        user.password = newPassword;
        await user.save();

        res.json({
            success: true,
            message: "Password changed successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// FORGOT PASSWORD - Request reset email
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            // Don't reveal if email exists for security
            return res.json({
                success: true,
                message: "If an account with that email exists, a password reset link has been sent"
            });
        }

        // Generate reset token (simple random string)
        const crypto = await import('crypto');
        const resetToken = crypto.default.randomBytes(32).toString('hex');

        // Hash token for storage
        const hashedToken = crypto.default.createHash('sha256').update(resetToken).digest('hex');

        // Save to user
        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save({ validateBeforeSave: false });

        // Send email
        const { sendPasswordResetEmail } = await import('../services/emailService.js');
        await sendPasswordResetEmail(user.email, resetToken, user.firstName);

        res.json({
            success: true,
            message: "If an account with that email exists, a password reset link has been sent"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// RESET PASSWORD - Use token to set new password
export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Token and new password are required"
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters"
            });
        }

        // Hash the token from URL to match stored hash
        const crypto = await import('crypto');
        const hashedToken = crypto.default.createHash('sha256').update(token).digest('hex');

        // Find user with valid token
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }
        }).select('+resetPasswordToken +resetPasswordExpires');

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired reset token"
            });
        }

        // Set new password
        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.json({
            success: true,
            message: "Password reset successful. You can now login with your new password."
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
