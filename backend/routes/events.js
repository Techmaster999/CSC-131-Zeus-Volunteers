// routes/events.routes.js
import express from "express";
import Event from "../models/Events.model.js";

const router = express.Router();

/* ------------------------------------------------------------------
   GET ALL EVENTS  
   Frontend expects the structure: { success, count, data: [] }
-------------------------------------------------------------------*/
router.get("/", async (req, res) => {
  try {
    const events = await Event.find();

    res.json({
      success: true,
      count: events.length,
      data: events,
    });

  } catch (err) {
    console.error("Error fetching events:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* ------------------------------------------------------------------
   GET EVENT BY ID
-------------------------------------------------------------------*/
router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    res.json({
      success: true,
      data: event
    });

  } catch (err) {
    console.error("Error fetching event:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* ------------------------------------------------------------------
   CREATE NEW EVENT  (⭐ FIXED TO ACCEPT announcements & commitments ⭐)
-------------------------------------------------------------------*/
// ----------------------------------------------------
// CREATE NEW EVENT (FULLY SAVES ANNOUNCEMENTS + COMMITMENTS)
// ----------------------------------------------------
router.post("/", async (req, res) => {
  try {
    const { 
      eventName, 
      organizer, 
      date, 
      time, 
      details, 
      announcements = "", 
      commitments = "", 
      imageUrl = "" 
    } = req.body;

    if (!eventName || !organizer || !date || !time || !details) {
      return res.status(400).json({
        success: false,
        message: "eventName, organizer, date, time, and details are required.",
      });
    }

    const newEvent = new Event({
      eventName,
      organizer,
      date,
      time,
      details,
      announcements,
      commitments,
      imageUrl,
    });

    await newEvent.save();

    res.status(201).json({
      success: true,
      message: "Event created",
      data: newEvent,
    });

  } catch (err) {
    console.error("Error creating event:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


/* ------------------------------------------------------------------
   UPDATE EVENT (PUT)
-------------------------------------------------------------------*/
router.put("/:id", async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    res.json({
      success: true,
      message: "Event updated",
      data: updatedEvent
    });

  } catch (err) {
    console.error("Error updating event:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* ------------------------------------------------------------------
   DELETE EVENT
-------------------------------------------------------------------*/
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Event.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    res.json({ success: true, message: "Event deleted" });

  } catch (err) {
    console.error("Error deleting event:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
