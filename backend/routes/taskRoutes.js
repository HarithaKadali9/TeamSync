import express from "express";
import Task from "../models/Task.js";
import {protect} from "../middleware/authMiddleware.js";
import User from "../models/User.js";
const router=express.Router();

router.post("/createtask", protect, async(req, res)=>{
    try{
        if(req.user.role==="employee") return res.status(403).json({message: "Access Denied"});
        const assignedUser=await User.findById(req.body.assignedTo);
        if(!assignedUser){
            return res.status(400).json({message: "Assigned user is not found"});
        }
        const task=await Task.create({...req.body, assignedToName: assignedUser.name});
        res.json(task);
    }catch(err){
        console.log(err);
        return res.status(500).json({message: "Internal server error"})
    }
})

router.post("/gettasks", protect, async(req, res)=>{
    const filter=req.user.role==="employee" ? {assignedTo: req.user.id}: {};
    const tasks=await Task.find(filter).populate("assignedTo createdBy", "name email");
    res.json(tasks);
});

router.patch("/updatetasks/:id", protect, async(req, res)=>{
    try{
        const task=await Task.findByIdAndUpdate(req.params.id, req.body, {new: true});
        if(!task) return res.status(404).json({message: "Task not found"});

        res.json({task, message: "task status updated"});
    }catch(err){
        return res.status(500).json({message: "Internal server error"})
    }
});

export default router;