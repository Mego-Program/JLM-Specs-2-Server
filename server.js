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
app.use(express.json())
const port = process.env.PORT

const mongoDBCode = process.env.MONGO_DB_URI
mongoose.connect(mongoDBCode)
const connentMongo = mongoose.connection
connentMongo.on('error', (error) => console.log(error))
connentMongo.once('open', () => console.log('connected to the database'))

// get data of single spec by id
app.get("/spec/:id", async (req, res) => {
  try {
    const specID = await specsScheme.findById(req.params.id);
    res.json(specID);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// get some data based on queries that you have - all the objects, but only one value from the schemes:
app.get("/specs", async (req, res) => {
  try {
    const specs = await specsScheme.find({}, "title description startDate");
    res.json(specs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// remove spec by specific ID and read the spec in the console:
app.delete("/specs/:id", async (req, res) => {
  try {
    const deleteSpec = await specsScheme.findByIdAndDelete(req.params.id);
    console.log(deleteSpec);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// update spec by specific ID and read the spec in the console:
app.put("/specs/:id", async (req, res) => {
  try {
    console.log(req.body);
    const editSpec = await specsScheme.findByIdAndUpdate(
      req.params.id,
      req.body
    );
    res.json(editSpec);
    console.log(editSpec);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// adding spec by post command:
app.post("/specs", async (req, res) => {
  try {
    console.log('enter server');
    let addSpecs = new specsScheme({
      title: req.body.title,
      description: req.body.description,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      task: req.body.task,
      team: req.body.team,
    });
    console.log('item good');
    let newSpec = await addSpecs.save();
    console.log('save');
    res.status(201).json(newSpec);
    console.log(newSpec);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


// =================================================================

app.listen(port, (err) => {
    if (err) console.log(err);
    console.log("Server listening");
});
