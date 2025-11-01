
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
app.listen(5001, () => {
    console.log("Server started at http://localhost:5001");
});