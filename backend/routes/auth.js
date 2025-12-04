import express from "express";
const router = express.Router();

import { register, login, getProfile, updateProfile } from "../controllers/authControllers.js";
import { protect } from "../middleware/auth.js";

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected routes
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

export default router;
