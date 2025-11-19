import express from "express";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();


import { connectDB } from "./config/db.js"; // make sure it is db.js and not just db
connectDB();

const app = express();

//Middleware
app.use(express.json());
app.use(cors());

//Import Routes
//import authRoutes from "./routes/auth.js";
//import particpationRoutes from "./routes/participation.js";

//Routes
//app.use("/api/auth", authRoutes);
//app.use("/api/participation", particpationRoutes);

//test route
//app.get("/products",(req, res) => { }); {
//res.send("Server is ready");
//};

//
app.listen(5000, () => {
console.log("Server started at http://localhost:5000");
});