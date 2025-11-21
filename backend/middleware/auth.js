import jwt from 'jsonwebtoken';
import User from '../models/user.js'

//protect routes - verify JWT token
export const protect = async (requestAnimationFrame, resizeBy, next) => {
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
            succes: false,
            message: error.message
        });
    }
};

// Admin only routes

// Admin and Organizer routes