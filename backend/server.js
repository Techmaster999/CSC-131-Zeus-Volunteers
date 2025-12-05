// ----------------------------------------------------
// ENV SETUP (load first)
// ----------------------------------------------------


import dotenv from "dotenv";
dotenv.config();

// ----------------------------------------------------
// IMPORTS
// ----------------------------------------------------
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { connectDB } from "./config/db.js";

// Import route files
import authRoutes from "./routes/auth.js";
import eventRoutes from "./routes/events.js";

// ----------------------------------------------------
// CONNECT TO DATABASE
// ----------------------------------------------------
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
// API ROUTES
// ----------------------------------------------------
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);

// ----------------------------------------------------
// ROOT ROUTE (API INFO)
// ----------------------------------------------------
app.get("/", (req, res) => {
    res.json({
        message: "Zeus Volunteers Backend API",
        status: "running",
        endpoints: {
            auth: "/api/auth",
            events: "/api/events"
        }
    });
});

// ----------------------------------------------------
// GLOBAL ERROR HANDLER
// ----------------------------------------------------
app.use((err, _req, res, _next) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ 
        success: false, 
        message: err.message || "Server Error" 
    });
});

// ----------------------------------------------------
// START SERVER
// ----------------------------------------------------
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`🚀 Backend API running at http://localhost:${PORT}`);
    console.log(`📡 API endpoints:`);
    console.log(`   - Auth: http://localhost:${PORT}/api/auth`);
    console.log(`   - Events: http://localhost:${PORT}/api/events`);
});