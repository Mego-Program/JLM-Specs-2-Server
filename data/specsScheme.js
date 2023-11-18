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
    startDate: {type: Date, required: true}, 
    endDate: {type: Date, required: true},
    task: [Object],
    team: [String]
    })

const specsScheme = mongoose.model("Specs", DataSpecSchema, "Specs")

export default specsScheme


