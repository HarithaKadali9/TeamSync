import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js"

dotenv.config();
const app=express();
app.use(cookieParser())
app.use(express.json());
app.use(cors({
    origin:"http://localhost:5000",
    credentials: true
}));
connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

app.listen(5000, ()=>{
    console.log("Server is running on port 5000")
})