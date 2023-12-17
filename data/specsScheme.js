import { ObjectId } from 'mongodb'
import mongoose from 'mongoose'

// const commentSchema = new mongoose.Schema({
//   commentId: { type: mongoose.Schema.Types.ObjectId, required: false },
//   author: { type: String, required: true },
//   content: { type: String, required: true },
//   date: { type: Date, default: Date.now },
// });



let DataSpecSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: String,
    content:{type:Object, required:true},
    date: {type: Date, default: new Date()},
    startDate: {type: Date, required: true}, 
    endDate: {type: Date, required: true},
    task: {
      projectName:String,
      tasks: { type: [Object], default: [] }, 
  },
  team: [String],
  comments: { type: Array, default: [] },

});

const specsScheme = mongoose.model("Specs", DataSpecSchema, "Specs");

export default specsScheme;



