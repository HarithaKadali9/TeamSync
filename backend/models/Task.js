import mongoose from "mongoose";

const taskSchema=new mongoose.Schema({
    title: String,
    description: String,
    status: {type: String, enum: ["To Do", "In Progress", "Completed"], default: "To Do"},
    assignedTo: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    assignedToName:String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User"},
    deadline: Date,
    comments: [{user: String, text: String, createdAt: Date}]
}, { timestamps: true });

export default mongoose.model("Task", taskSchema);