import express from "express";
import Event from "../models/Events.model.js";

const router = express.Router();

// ----------------------------------------------------
// GET ALL EVENTS
// ----------------------------------------------------
router.get("/", async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    console.error("Error fetching events:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ----------------------------------------------------
// GET EVENT BY ID
// ----------------------------------------------------
router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(event);
  } catch (err) {
    console.error("Error fetching event:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ----------------------------------------------------
// CREATE NEW EVENT
// ----------------------------------------------------
router.post("/", async (req, res) => {
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
      message: "Event created",
      data: newEvent,
    });
  } catch (err) {
    console.error("Error creating event:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ----------------------------------------------------
// DELETE EVENT
// ----------------------------------------------------
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Event.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json({ success: true, message: "Event deleted" });

  } catch (err) {
    console.error("Error deleting event:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ----------------------------------------------------
// UPDATE EVENT
// ----------------------------------------------------
router.put("/:id", async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(updatedEvent);
  } catch (err) {
    console.error("Error updating event:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
