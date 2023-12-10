import express from "express";
import mongoose from "mongoose";
import specsScheme from "./data/specsScheme.js";
import cors from "cors";
import compression from "compression";
import helmet from "helmet";
import dotenv from "dotenv";
import projectRouter from "./routes/project.js";
import axios from "axios";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(cors());
app.options("*");
app.use(compression());
app.use(helmet());
app.use(express.json());

app.use('/project', projectRouter);



const mongoDBCode = process.env.MONGO_DB_URI;
mongoose.connect(mongoDBCode);
const connentMongo = mongoose.connection;
connentMongo.on("error", (error) => console.log(error));
connentMongo.once("open", () => console.log("connected to the database"));






// get some data based on queries that you have - all the objects, but only one value from the schemes:
app.get("/specs", async (req, res) => {
  try {
    const specs = await specsScheme.find({}, "title description date");
    res.json(specs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// get data of single spec by id
app.get("/specs/:id", async (req, res) => {
  try {
    const specID = await specsScheme.findById(req.params.id);
    res.json(specID);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/specs/:id/comments", async (req, res) => {
  try {
    const { author, content } = req.body;
    const specID = req.params.id;

    const updatedSpec = await specsScheme.findByIdAndUpdate(
      specID,
      {
        $push: { comments: { author, content } },
      },
      { new: true }
    );
    console.log(updatedSpec);
    res.json(updatedSpec);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/specs/:id/comments/:commentId/replies", async (req, res) => {
  try {
    const { author, content } = req.body;
    const specID = req.params.id;
    const commentID = req.params.commentId;

    const updatedSpec = await specsScheme.findByIdAndUpdate(
      specID,
      {
        $push: { "comments.$[comment].replies": { author, content } },
      },
      {
        new: true,
        arrayFilters: [{ "comment._id": mongoose.Types.ObjectId(commentID) }],
      }
    );

    res.json(updatedSpec);
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
  console.log("enter server");
  try {
    let addSpecs = new specsScheme({
      title: req.body.title,
      description: req.body.description,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      task: req.body.task,
      team: req.body.team,
      comments: req.body.comments,
    });
   
    let newSpec = await addSpecs.save();

    // send board and task to project
    if (newSpec.task.projectName !== ''){
      const list = newSpec.task.tasks.filter(item => item.sendToBoard === true);
      const spec = {title:newSpec.title, id:newSpec._id}

      const connectBoard = {
        boardName: newSpec.task.projectName,
        spec:spec,
        tasks:list,
        newSpec:true
      }
      console.log('test:',connectBoard);
      try{
          const response = await axios.put('https://project-jerusalem-2-server.vercel.app/spec/connectSpecs',connectBoard);
          console.log('response project: ',response.data);
      }catch (error){
        console.log('error project: ',error.data);
        const newList = newSpec.task.tasks.map(item => ({ ...item, sendToBoard: false }))
        const object = {projectName:'', tasks:newList}
        const updatedSpec = await specsScheme.findByIdAndUpdate(
          newSpec._id,
          { $set: { 'task': object} },
          { new: true }
        );
      }

      

      
      //add feild
    }
    res.status(201).json(newSpec);
    console.log("spec added: ", newSpec);
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
app.put("/spec/:id", async (req, res) => {
  try {
    const updatedSpec = await specsScheme.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    const savedSpec = await updatedSpec.save();

    res.json(savedSpec);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// app.delete("/specs/removeSpec/:id", async (req, res) => {
//   try {
//     const deleteSpec = await specsScheme.findByIdAndDelete(req.params.id);
//     res.json(deleteSpec);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// =================================================================

app.listen(port, (err) => {
  if (err) console.log(err);
  console.log("Server listening");
});
