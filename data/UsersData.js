
import mongoose from 'mongoose'

mongoose.connect('mongodb+srv://refaelcohen98:refael148@cluster0.lkzzbpr.mongodb.net/').then(() => {console.log('connet')})

let DataSpecSchema = new mongoose.Schema({
title: {type: String, required: true},
date: Date,
description: String,
content: String,
owner: Number,
users: [String]
})

export default mongoose.model("UsersData", DataSpecSchema)


