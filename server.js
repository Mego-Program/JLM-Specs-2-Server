import express, { json } from "express";
// import specRoute from './routes/specs.js'
import mongoose from "mongoose";
import specsScheme from "./data/specsScheme.js";
import { findSpec, createSpec } from "./data/dbconnect.js";
import { ObjectId } from "mongodb";
import cors from "cors";

// ===========================================
// create server with port plus route to specs

let app = express();
const port = 4000;
app.use(cors());
app.options("*");

// app.use('/specs', specRoute)

mongoose.connect(
  "mongodb+srv://refaelcohen98:refael148@cluster0.lkzzbpr.mongodb.net/"
);
const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("connected to the database"));

app.use(express.json());

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
app.post("/Specs", async (req, res) => {
  try {
    let addSpecs = new specsScheme({
      title: req.body.title,
      description: req.body.description,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      task: req.body.task,
      team: req.body.team,
    });
    let newSpec = await addSpecs.save();
    res.status(201).json(newSpec);
    console.log(newSpec);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// =================================================================

// functions from dbconncet that we need for the buildind of the db:
// createSpec()

app.listen(port, (err) => {
  if (err) console.log(err);
  console.log("Server listening on PORT", port);
});
