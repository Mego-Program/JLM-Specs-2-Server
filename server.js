import express, { json } from 'express'
// import specRoute from './routes/specs.js'
import mongoose from 'mongoose'
import specsData from './data/specsData.js'
import {SaveUser, PullData} from './data/dbconnect.js'


// ===========================================
// create server with port plus route to specs

let app = express()
const port = 4000


// app.use('/specs', specRoute)


mongoose.connect('mongodb+srv://refaelcohen98:refael148@cluster0.lkzzbpr.mongodb.net/')
const db = mongoose.connection
db.on('error', (error) => console.log(error))
db.once('open', () => console.log('connected to the database'))

app.use(express.json())

app.get('/', async (req, res) => {
    try {
        const specs = await specsData.find()
        res.json(specs)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})




// SaveUser()

app.listen(port, (err) => {
    if (err) console.log(err);
    console.log("Server listening on PORT", port);
});
