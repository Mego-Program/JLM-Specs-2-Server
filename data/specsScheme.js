import { ObjectId } from 'mongodb'
import mongoose from 'mongoose'

// let DataSpecSchema = new mongoose.Schema({
// title: {type: String, required: true},
// description: String,
// startDate: {type: Date, required: true}, 
// endDate: {type: Date, required: true},
// task: [String],
// team: [ObjectId],
// owner: ObjectId
// })



let DataSpecSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: String,
    date: {type: Date, default: Date().toLocaleString({timeZone: 'Asia/Jerusalem'})},
    startDate: {type: Date, required: true}, 
    endDate: {type: Date, required: true},
    task: [Object],
    team: [String],
    comments: [
        {
          author: String,
          content: String,
        },
      ],
    });

    // check how to change the hour to Jerusalem-time 

const specsScheme = mongoose.model("Specs", DataSpecSchema, "Specs")

export default specsScheme


