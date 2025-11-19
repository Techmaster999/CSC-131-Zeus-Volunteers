// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import Event from "./src/models/Events.model.js";

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

// 6) (Optional) centralized error handler
app.use((err, _req, res, _next) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
});

// 7) Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
});