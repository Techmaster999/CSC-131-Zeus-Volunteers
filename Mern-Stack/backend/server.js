
import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

dotenv.config();                  // ← load env FIRST
console.log(process.env.MONGO_URI); // optional: sanity check

await connectDB();                // ← connect AFTER env is loaded

const app = express();
app.get("/products", (req, res) => {
    res.send("Server is ready");
});


// code to post the event data to the database
import Event from "./models/Events.model.js";

// testing code for Postman app.
app.use(express.json()); // allows us to accept JSON data in req.body below
app.post("/api/events", async (req, res) =>{
    const event = req.body; // ← user will send this data to DB

    if(!event.eventName || !event.organizer || !event.date || !event.time || !event.details ){
        return res.status(400).json({ success:false, message: "All fields are required" });
    }

    const newEvent = new Event(event);

    try{
        await newEvent.save();
        res.status(201).json({ success:true, message: "Event created successfully", data: newEvent });
    }
    catch(error){
        console.error("Error in creating event:", error.message);
        res.status(500).json({ success:false, message: "Server Error" });
    }
});



app.listen(5001, () => {
    console.log("Server started at http://localhost:5001");
});