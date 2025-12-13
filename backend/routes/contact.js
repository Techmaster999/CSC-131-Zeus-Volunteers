import express from "express";
import { protect, admin } from "../middleware/auth.js";
import {
    submitContactForm,
    getContactSubmissions,
    updateContactStatus,
    deleteContact
} from "../controllers/contactController.js";

const router = express.Router();

// ===== PUBLIC ROUTE =====
// Submit contact form - works for anyone (logged in or not)
// If logged in, user info is automatically attached
router.post("/", (req, res, next) => {
    // Optional auth - try to get user if token exists, but don't require it
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        protect(req, res, () => {
            // User authenticated, continue
            submitContactForm(req, res);
        });
    } else {
        // No token, anonymous submission
        submitContactForm(req, res);
    }
});

// ===== ADMIN ROUTES =====
// Get all contact submissions
router.get("/", protect, admin, getContactSubmissions);

// Update contact status
router.put("/:id", protect, admin, updateContactStatus);

// Delete contact submission
router.delete("/:id", protect, admin, deleteContact);

export default router;
