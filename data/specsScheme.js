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
    task: [String],
    team: [String]
    })

const specsScheme = mongoose.model("SpecsData", DataSpecSchema)

export default specsScheme


