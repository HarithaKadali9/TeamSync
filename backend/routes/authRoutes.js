import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router=express.Router();

router.post("/signup", async(req, res)=>{
    try{
        const {name, email, password, role}=req.body;
        const existing=await User.findOne({email});
        if(existing){
            return res.status(400).json({message: "User already exists"});
        }
        const hashed=await bcrypt.hash(password, 10);
        const user=await User.create({name, email, password: hashed, role});

        const {password: removed, ...userData}=user.toObject();
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7*24*60*60*1000,
        })
        res.status(201).json({
            message: "Signup successfull",
            user: userData,
        })
    }catch(err){
        res.status(500).json({message: "Internal server error"});
    }
})

router.post("/login", async(req, res)=>{
    try{
        const {email, password}=req.body;
        const user=await User.findOne({email});
        if(!user){
            return res.status(400).json({message: "User not found"});
        }
        const isMatch=await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({message: "Invalid password"});
        }

        const token=jwt.sign({id: user._id, role: user.role}, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7*24*60*60*1000,
        })
        res.status(200).json({token, role: user.role, name: user.name, message: "Login Successfull!"});
    }catch(err){
        return res.status(500).json({message: "Internal server error"})
    }
})

export default router;