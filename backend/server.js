// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

// Database + Models
import { connectDB } from "./config/db.js";
import Event from "./models/Events.model.js";
import User from "./models/Accounts.model.js";
import UserEvent from "./models/User_Events.models.js";

// Routes + Controllers
import authRoutes from "./routes/auth.js";
import eventRoutes from "./routes/events.js";
import {
    getEventUsers,
    getEventUsersAgg,
    addUserToEvent
} from "./controllers/eventController.js";

// Fix __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env
dotenv.config({ path: path.join(__dirname, ".env") });

// Connect to DB
await connectDB();

const app = express();

// ----------------------------------------------------
// MIDDLEWARE
// ----------------------------------------------------
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

// ----------------------------------------------------
// TEST ROUTE
// ----------------------------------------------------
app.get("/events", (_req, res) => {
    res.send("Server is ready");
});

// ----------------------------------------------------
// EVENTS: CREATE NEW EVENT
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

        const newEvent = new Event({ eventName, organizer, date, time, details });
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
            role
        } = req.body;

        if (!firstName || !lastName || !userName || !email || !password || !country || !state || !city) {
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
            role
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

// Add a user to an event
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

// Get users for an event
app.get("/api/events/:eventId/users", getEventUsers);

// Same but aggregated
app.get("/api/events/:eventId/users-agg", getEventUsersAgg);

// List all user-event links
app.get("/api/userevents", async (req, res, next) => {
    try {
        const docs = await UserEvent.find().limit(50);
        res.json({ success: true, count: docs.length, data: docs });
    } catch (err) {
        next(err);
    }
});

// ----------------------------------------------------
// MAIN ROUTES
// ----------------------------------------------------
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);

// ----------------------------------------------------
// STATIC FRONTEND ROUTING
// ----------------------------------------------------

// Serve all FIGMA-AI files at /static
app.use("/static", express.static(path.join(__dirname, "../FIGMA-AI")));

// Landing Page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../FIGMA-AI/Landing Page/index.html"));
});

// Event Browsing Page
app.use(
    "/event-browsing",
    express.static(path.join(__dirname, "../FIGMA-AI/Event Browsing Page"))
);

// Shortcut to event browsing
app.get("/events", (req, res) => {
    res.sendFile(path.join(__dirname, "../FIGMA-AI/Event Browsing Page/index.html"));
});

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
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
