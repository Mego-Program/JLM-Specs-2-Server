import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  author: { type: Object, required: true },
  content: { type: String, required: true },
  date: { type: Date, default: Date.now },
  replies: [
    {
      author: Object,
      content: String,
      date: { type: Date, default: Date.now },
    },
  ],
});

let DataSpecSchema = new mongoose.Schema({
  author: { type: Object, required: true },
  title: { type: String, required: true },
  description: String,
  content: { type: Object, required: true },
  date: { type: Date, default: new Date() },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  task: {
    projectName: String,
    tasks: { type: [Object], default: [] },
  },
  team: [Object],
  comments: [commentSchema],
});

const specsScheme = mongoose.model("Specs", DataSpecSchema, "Specs");

export default specsScheme;
