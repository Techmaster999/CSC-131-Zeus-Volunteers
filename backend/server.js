// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import Event from "./models/Events.model.js";
import User from "./models/Accounts.model.js";
import authRoutes from "./routes/auth.js";
import UserEvent from "./models/User_Events.models.js";
import { getEventUsers } from "./controllers/eventController.js";
import { getEventUsersAgg } from "./controllers/eventController.js";
import morgan from "morgan";
import { addUserToEvent } from "./controllers/eventController.js";



// 1) Load env once
dotenv.config();

// 2) Connect to DB once (after env is loaded)
await connectDB();

const app = express();

// console log of all calls to server
app.use(morgan("dev"));

// 3) Core middleware (no duplicates)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));  // <-- add this
app.use(cors());

// 4) Health/check route
app.get("/events", (_req, res) => {
        res.send("Server is ready");
});

// 5) Events API
app.post("/api/events", async (req, res, next) => {
    try {
        const { eventName, organizer, date, time, details } = req.body;

        if (!eventName || !organizer || !date || !time || !details) {
            return res
            .status(400)
            .json({ success: false, message: "All fields are required" });
        }

        const newEvent = new Event({ eventName, organizer, date, time, details });
        await newEvent.save();

        res
            .status(201)
            .json({ success: true, message: "Event created successfully", data: newEvent });
    }   catch (err) {
            next(err);
        }
});

app.get("/accountCreation", (_req, res) => {
        res.send("Server is ready");
});

// 6) User account creation API
app.post("/api/accountCreation", async (req, res, next) => {
    try{
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

        if (!firstName || !lastName || !userName || !email || !password || !country || !state || !city || !role || !phone) {
            return res
            .status(400)
            .json({ success: false, message: "All fields are required" });
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

        res
            .status(201)
            .json({ success: true, message: "Account created successfully", data: newUser });
    }   catch (err) {
            next(err);
    }


});

// 7) User_Events routes 
// Adds a user to an event

app.post("/api/userevents", async (req, res, next) => {
    try {
        const { userId, eventId } = req.body;
        
        if (!userId || !eventId) {
            return res.status(400)
            .json({ success: false, message: "User ID and Event ID are required" });
        }

        const existingLink = await UserEvent.findOne({ userId, eventId });
        if(existingLink){
            return res.status(409) // conflict status code
            .json({success: false, message: "User is already linked to this event" });
        }


        const newLink = new UserEvent({ userId, eventId });
        await newLink.save();

        res.status(201).json({
            success: true,
            message: "User linked to event successfully",
            data: newLink
        });
    }
    catch (err) {
        next(err);
    }
});
app.get("/api/events/:eventId/users", getEventUsers);
// new aggregation endpoint
app.get("/api/events/:eventId/users-agg", getEventUsersAgg);

app.get("/api/userevents", async (req, res, next) => {
    try {
        const docs = await UserEvent.find().limit(50);
        res.json({ success: true, count: docs.length, data: docs });
    } catch (err) {
        next(err);
    }
});





// Auth routes
app.use("/api/auth", authRoutes);

// 8) (Optional) centralized error handler
app.use((err, _req, res, _next) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
});

import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Serve everything in FIGMA-AI at /static
app.use("/static", express.static(path.join(__dirname, "../FIGMA-AI")));

// Root route -> Landing Page HTML
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../FIGMA-AI/Landing Page/index.html"));
});





// 9) Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port http://localhost:${PORT}`);
});

