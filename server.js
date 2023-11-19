import express, { json } from "express";
// import specRoute from './routes/specs.js'
import bodyParser from 'body-parser';


import mongoose from 'mongoose'
import specsScheme from './data/specsScheme.js'
// import {findSpec, createSpec} from './data/dbconnect.js'
// import { ObjectId } from 'mongodb'
import cors from 'cors'
// import compression from 'compression'
// import helmet from 'helmet'
// import bunyan from 'bunyan'
// import cluster from 'cluster'
// import http from 'http'
import dotenv from 'dotenv'
// import { normalize } from 'path'
dotenv.config()

const app = express()
app.use(cors())
app.options('*')

app.use(bodyParser.json())

// app.use(compression())
// app.use(helmet());
// const server = http.createServer(app)
// const port = normalize(process.env.PORT)
const port = 4000

// const loggers = {
//     development: () => bunyan.createLogger({name: "development", level: "debug"}), 
//     production: () => bunyan.createLogger({name: "production", level: "info"}), 
//     test: () => bunyan.createLogger({name: "test", level: "fatal"})
// }

// app.use('/specs', specRoute)

const mongoDBCode = process.env.MONGO_DB_URI
mongoose.connect(mongoDBCode)
const connentMongo = mongoose.connection
connentMongo.on('error', (error) => console.log(error))
connentMongo.once('open', () => console.log('connected to the database'))




// get all the data from the data-base:
// app.get('/specs', async (req, res) => {
//   try {
//       const specs = await specsScheme.findOne({}, {}, { sort: { 'created_at' : -1 } }, function(err, post) {
//           console.log(specs);
// });
//       res.json(specs)
//   } catch (error) {
//       res.status(500).json({message: error.message})
//     }
// })


// get the first element from the data-base - randomlly, not so use:
// app.get("/specs/first", async (req, res) => {
//   try {
//     const specFirst = await specsScheme.findOne();
//     res.json(specFirst);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });
// get the specific element from the data-base:
app.get("/spec/:id", async (req, res) => {
  try {
    const specID = await specsScheme.findById(req.params.id);
    res.json(specID);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// get some data based on queries that you have:
// app.get("/specs/findByQuery", async (req, res) => {
//   try {
//     const specs = await specsScheme.find({
//       description: "Building strong connections",
//     });
//     res.json(specs);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });
// get some data based on queries that you have - all the objects, but only one value from the schemes:
app.get("/specs", async (req, res) => {
  try {
    const specs = await specsScheme.find({}, "title description");
    res.json(specs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// remove spec by specific ID and read the spec in the console:
app.delete("/Specs/:id", async (req, res) => {
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

// app.put('/spec/:id', async (req, res) => {
//     try {
//       const updatedSpec = await specsScheme.findByIdAndUpdate(req.params.id, req.body, { new: true });
//       res.json(updatedSpec);
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   });
app.put('/spec/:id', async (req, res) => {
    try {
      const updatedSpec = await specsScheme.findByIdAndUpdate(req.params.id, req.body, { new: true });
      
      const savedSpec = await updatedSpec.save();
  
      res.json(savedSpec);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete('/specs/removeSpec/:id', async (req, res) => {
    try {
      const deleteSpec = await specsScheme.findByIdAndDelete(req.params.id);
      res.json(deleteSpec);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  


// =================================================================

// functions from dbconncet that we need for the buildind of the db:
// createSpec()

app.listen(port, (err) => {
    if (err) console.log(err);
    console.log("Server listening");
});
