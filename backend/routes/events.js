

// routes/events.js
import express from "express";
import { getEventUsers } from "../controllers/eventController.js";

const  router = express.Router();

// example route 
router.get("/events/:eventId/users", getEventUsers);

export default router;