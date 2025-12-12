// ----------------------------------------------------
// ENV SETUP (load first)
// ----------------------------------------------------


import dotenv from "dotenv";
dotenv.config();
console.log("DEBUG JWT_SECRET:", process.env.JWT_SECRET);

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
import reminderRoutes from "./routes/reminders.js";

// Import cron for scheduled tasks
import cron from "node-cron";
import { processReminders } from "./services/reminderServices.js";

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
app.use("/api/reminders", reminderRoutes);

// ----------------------------------------------------
// ROOT ROUTE (API INFO)
// ----------------------------------------------------
app.get("/", (req, res) => {
    res.json({
        message: "Zeus Volunteers Backend API",
        status: "running",
        endpoints: {
            auth: "/api/auth",
            events: "/api/events",
            reminders: "/api/reminders"
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
// Clean the PORT value (remove any trailing backslashes or whitespace)
const PORT = parseInt((process.env.PORT || '5001').replace(/[^\d]/g, '')) || 5001;

const server = app.listen(PORT, () => {
    console.log(`🚀 Backend API running at http://localhost:${PORT}`);
    console.log(`📡 API endpoints:`);
    console.log(`   - Auth: http://localhost:${PORT}/api/auth`);
    console.log(`   - Events: http://localhost:${PORT}/api/events`);
    console.log(`   - Reminders: http://localhost:${PORT}/api/reminders`);
});

// ----------------------------------------------------
// CRON JOB: Process reminders every 15 minutes
// ----------------------------------------------------
cron.schedule('*/15 * * * *', async () => {
    console.log('⏰ Running scheduled reminder check...');
    await processReminders();
});
console.log('⏰ Reminder cron job scheduled (every 15 minutes)');

// Handle server errors
server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error(`💥 ERROR: Port ${PORT} is already in use!`);
        console.error('Please stop the other process or use a different port.');
        process.exit(1);
    } else {
        console.error('💥 SERVER ERROR:', error);
        console.error('Stack:', error.stack);
        process.exit(1);
    }
});

// ----------------------------------------------------
// PROCESS ERROR HANDLERS  
// ----------------------------------------------------
process.on('uncaughtException', (error) => {
    console.error('💥 UNCAUGHT EXCEPTION:', error);
    console.error('Stack:', error.stack);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('💥 UNHANDLED REJECTION at:', promise);
    console.error('Reason:', reason);
});