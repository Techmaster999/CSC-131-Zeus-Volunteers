import express from "express";
const router = express.Router();

import { register, login, getProfile, updateProfile, changePassword, forgotPassword, resetPassword } from "../controllers/authControllers.js";
import { protect } from "../middleware/auth.js";

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);

// Protected routes
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.put("/password", protect, changePassword);

export default router;
