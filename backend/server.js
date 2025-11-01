import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

const app=express();
connectDB();

app.get("/", (req, res)=>{
    res.send("Server is running and mongodb connected")
})
app.listen(5000, ()=>{
    console.log("Server is running on port 5000")
})