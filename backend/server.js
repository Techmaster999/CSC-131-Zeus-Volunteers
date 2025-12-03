// server.js
// .env import must be first
import dotenv from "dotenv";
// 1) Load env once
dotenv.config();
console.log("DEBUG JWT_SECRET:", process.env.JWT_SECRET); // TEMP test

import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import authRoutes from "./routes/auth.js"
import eventRoutes from "./routes/events.js"

// Database + Models
import { connectDB } from "./config/db.js";
import Event from "./models/Events.model.js";
import User from "./models/Accounts.model.js";
import UserEvent from "./models/User_Events.models.js";
import { getEventUsers } from "./controllers/eventController.js";
import { getEventUsersAgg } from "./controllers/eventController.js";
import { reviewEvent } from "./controllers/eventController.js";
import { addUserToEvent } from "./controllers/eventController.js";



// 1) Load env once
dotenv.config();

// Connect to DB
await connectDB();

const app = express();

// ----------------------------------------------------
// MIDDLEWARE
// ----------------------------------------------------
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// ----------------------------------------------------
// SIMPLE TEST ROUTE
// ----------------------------------------------------


//app.get("/events", (_req, res) => {
//    res.send("Server is ready");
//});

// ----------------------------------------------------
// EVENTS: CREATE EVENT
// ----------------------------------------------------
app.post("/api/events", async (req, res, next) => {
    try {
        const { eventName, organizer, date, time, details } = req.body;

        if (!eventName || !organizer || !date || !time || !details) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const newEvent = new Event({
            eventName,
            organizer,
            date,
            time,
            details,
            status: "pending"
        });

        await newEvent.save();

        res.status(201).json({
            success: true,
            message: "Event created successfully",
            data: newEvent,
        });
    } catch (err) {
        next(err);
    }
});

// ----------------------------------------------------
// ACCOUNT CREATION
// ----------------------------------------------------
app.post("/api/accountCreation", async (req, res, next) => {
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

        const newUser = new User({
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
        });

        await newUser.save();

        res.status(201).json({
            success: true,
            message: "Account created successfully",
            data: newUser,
        });
    } catch (err) {
        next(err);
    }
});

// ----------------------------------------------------
// USER–EVENT RELATIONSHIP ROUTES
// ----------------------------------------------------
app.post("/api/userevents", async (req, res, next) => {
    try {
        const { userId, eventId } = req.body;

        if (!userId || !eventId) {
            return res.status(400).json({
                success: false,
                message: "User ID and Event ID are required",
            });
        }

        const existing = await UserEvent.findOne({ userId, eventId });

        if (existing) {
            return res.status(409).json({
                success: false,
                message: "User is already linked to this event",
            });
        }

        const newLink = new UserEvent({ userId, eventId });
        await newLink.save();

        res.status(201).json({
            success: true,
            message: "User linked to event successfully",
            data: newLink,
        });
    } catch (err) {
        next(err);
    }
});

// Fetch users for an event
app.get("/api/events/:eventId/users", getEventUsers);

// Aggregated event users
app.get("/api/events/:eventId/users-agg", getEventUsersAgg);

// Review event (ADMIN)
app.put("/api/events/:eventId/review", reviewEvent);

// List all user-event links
app.get("/api/userevents", async (req, res, next) => {
    try {
        const docs = await UserEvent.find().limit(50);
        res.json({ success: true, count: docs.length, data: docs });
    } catch (err) {
        next(err);
    }
});

// Review event (approve/deny)
app.put("/api/events/:eventId/review", reviewEvent);

app.get("/api/reviewEvent", async(req, res, next) => {
    if(req.user.role !== "admin") {
        return res.status(403).json({ success: false, message: "Access denied" });
    }
    try {
        const query = req.query.admin === "true" ? {} : {status : "approved"};
        const events = await Event.find(query).populate("organizer", "firstName lastName userName");
        res.json({ success: true, count: events.length, data: events });
    } catch(err){
        next(err);
    }
});

// ----------------------------------------------------
// MAIN BACKEND ROUTES
// ----------------------------------------------------
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);

// ----------------------------------------------------
// ERROR HANDLER
// ----------------------------------------------------
app.use((err, _req, res, _next) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
});

// ----------------------------------------------------
// START SERVER
// ----------------------------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use("/static", express.static(path.join(__dirname, "../FIGMA-AI")));

// Root route -> Landing Page HTML
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../FIGMA-AI/Landing Page/index.html"));
});
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
