// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import Event from "./models/Events.model.js";
import User from "./models/Accounts.model.js";
import authRoutes from "./routes/auth.js";

// 1) Load env once
dotenv.config();

// 2) Connect to DB once (after env is loaded)
await connectDB();

const app = express();

// 3) Core middleware (no duplicates)
app.use(express.json());
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
        const { firstName, lastName, userName, email, password, country, state, city } = req.body;

        if (!firstName || !lastName || !userName || !email || !password || !country || !state || !city) {
            return res
            .status(400)
            .json({ success: false, message: "All fields are required" });
        }

        const newUser = new User({ firstName, lastName, username, email, password, country, state, city, role });
        await newUser.save();

        res
            .status(201)
            .json({ success: true, message: "Account created successfully", data: newUser });
    }   catch (err) {
            next(err);
    }


});

// Auth routes
app.use("/api/auth", authRoutes);

// 7) (Optional) centralized error handler
app.use((err, _req, res, _next) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
});

import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Serve static files (like your index.html and CSS)
app.use(express.static(__dirname + "/../"));  // adjust path if needed

// Default route for root URL
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../index.html"));
});


// 8) Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
});