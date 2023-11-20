import express from 'express'
import mongoose from 'mongoose'
import specsScheme from './data/specsScheme.js'
import cors from 'cors'
import compression from 'compression'
import helmet from 'helmet'
import bunyan from 'bunyan'
import http from 'http'
import dotenv from 'dotenv'
dotenv.config()

const app = express()
app.use(cors())
app.options('*')
app.use(compression())
app.use(helmet());
const port = process.env.PORT

const mongoDBCode = process.env.MONGO_DB_URI
mongoose.connect(mongoDBCode)
const connentMongo = mongoose.connection
connentMongo.on('error', (error) => console.log(error))
connentMongo.once('open', () => console.log('connected to the database'))




app.use(express.json())


// get all the data from the data-base: 
app.get('/specs', async (req, res) => {
    try {
        const specs = await specsScheme.find()
        res.json(specs)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})
// get the first element from the data-base - randomlly, not so use:
app.get('/specs/first', async (req, res) => {
    try {
        const specFirst = await specsScheme.findOne()
        res.json(specFirst)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})
// get the specific element from the data-base:
app.get('/spec/:id', async (req, res) => {
    try {
        const specID = await specsScheme.findById(req.params.id)
        res.json(specID)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})
// get some data based on queries that you have: 
app.get('/specs/findByQuery', async (req, res) => {
    try {
        const specs = await specsScheme.find({description: 'Building strong connections'})
        res.json(specs)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})
// get some data based on queries that you have - all the objects, but only one value from the schemes: 
app.get('/specs/findByValue', async (req, res) => {
    try {
        const specs = await specsScheme.find({}, 'title description')
        res.json(specs)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})
// remove spec by specific ID and read the spec in the console:
app.get('/specs/removeSpec/:id', async (req, res) => {
    try {
        const deleteSpec = await specsScheme.findByIdAndDelete(req.params.id)
        console.log(deleteSpec)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})
// update spec by specific ID and read the spec in the console:
app.get('/specs/editSpec/:id', async (req, res) => {
    try {
        const editSpec = await specsScheme.findByIdAndUpdate((req.params.id), {title: 'shragi feldhaim hes the father of israel'})
        res.json(editSpec)
        console.log(editSpec)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})
// adding spec by post command:
app.post('/specs/addSpec', async (req, res) => {
    console.log(req.body);
    let addSpecs = new specsScheme({
        title: req.body.title,
        description: req.body.description,
        startDate: req.body.startDate, 
        endDate: req.body.endDate,
        task: req.body.task,
        team: req.body.team
    })
    try {
        let newSpec = await specsScheme.save()
        res.status(201).json(newSpec)
        console.log(newSpec)
    } catch (error) {
        res.status(400).json({message: error.message})
    }
})

// createSpec()
// =================================================================

// functions from dbconncet that we need for the buildind of the db:
// createSpec()

app.listen(port, (err) => {
    if (err) console.log(err);
    console.log("Server listening");
});
