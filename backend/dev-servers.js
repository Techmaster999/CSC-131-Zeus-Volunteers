import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

// ===== TEMPORARILY DISABLE MONGODB =====
// import { connectDB } from "./config/db.js";
// connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Import Routes
import participationRoutes from "./routes/participation.js";
import eventRoutes from "./models/events.js";
import reminderRoutes from "./models/reminders.js";
import notificationRoutes from "./models/notifications.js";

// Routes
app.use("/api/participation", participationRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/reminders", reminderRoutes);
app.use("/api/notifications", notificationRoutes);

// Test Route
app.get("/products", (req, res) => {
  res.send("Server is ready");
});

// Start server
const PORT = 5001;

app.listen(PORT, () => {
  console.log(`Dev server running at http://localhost:${PORT}`);
});

