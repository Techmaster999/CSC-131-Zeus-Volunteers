import jwt from 'jsonwebtoken';
import User from '../models/Accounts.model.js';

//protect routes - verify JWT token
export const protect = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if(!token) {
            return resizeBy.status(401).json({
                success: false,
                message: 'Not authorized, no token provided'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');

        if (!req.user) {
            return requestAnimationFrame.status(401).json ({
                success: false,
                message: 'User not found'
            });
        }

        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Admin only routes

// Authentication middleware (protect routes)
export const requireAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ success: false, message: "No token provided" });
        }

        const token = authHeader.split(" ")[1];

        // Decode token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // NOTE: use decoded.id ONLY
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid user" });
        }

        req.user = user;  // Attach user to request

        next();

    } catch (error) {
        console.error("Auth Error:", error);
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }
};

// Admin and Organizer routes