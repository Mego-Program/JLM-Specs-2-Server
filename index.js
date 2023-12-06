import express from "express";
import mongoose from "mongoose";
import specsScheme from "./data/specsScheme.js";
import cors from "cors";
import compression from "compression";
import helmet from "helmet";
// import bunyan from 'bunyan'
// import http from 'http'
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.options("*");
app.use(compression());
app.use(helmet());
app.use(express.json());
const port = process.env.PORT;

const mongoDBCode = process.env.MONGO_DB_URI;
mongoose.connect(mongoDBCode);
const connectMongo = mongoose.connection;
connectMongo.on("error", (error) => console.log(error));
connectMongo.once("open", () => console.log("connected to the database"));

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
    console.log("enter server");
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
    res.status(201).json(newSpec);
    console.log("spec added: ", newSpec);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

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


app.delete("/specs/removeSpec/:id", async (req, res) => {
  try {
    const deleteSpec = await specsScheme.findByIdAndDelete(req.params.id);
    res.json(deleteSpec);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/specs/:id/comments", async (req, res) => {
  try {
    const { author, content, replyTo } = req.body;
    const specID = req.params.id;

    const commentId = new mongoose.Types.ObjectId();

    let updatedSpec;

    if (replyTo) {
      // Add reply to a comment
      updatedSpec = await specsScheme.findOneAndUpdate(
        { "comments._id": new mongoose.Types.ObjectId(replyTo) },
        {
          $push: {
            "comments.$.replies": {
              _id: commentId,
              author,
              content,
            },
          },
        },
        { new: true }
      );
    } else {
      // Add new comment
      updatedSpec = await specsScheme.findByIdAndUpdate(
        specID,
        {
          $push: {
            comments: {
              _id: commentId,
              author,
              content,
              replies: [],
            },
          },
        },
        { new: true }
      );
    }

    res.json(updatedSpec.comments);
  } catch (error) {
    console.error("Error when adding comment:", error);
    res.status(500).json({ message: error.message });
  }
});

app.post("/specs/:id/comments/:commentId/replies", async (req, res) => {
  try {
    const { author, content } = req.body;
    const specID = req.params.id;
    const commentId = req.params.commentId;

    const replyId = new mongoose.Types.ObjectId();

    const updatedSpec = await specsScheme.findOneAndUpdate(
      { "_id": new mongoose.Types.ObjectId(specID), "comments._id": new mongoose.Types.ObjectId(commentId) },
      {
        $push: {
          "comments.$.replies": {
            _id: replyId,
            author,
            content,
          },
        },
      },
      { new: true }
    );

    res.json(updatedSpec.comments);
  } catch (error) {
    console.error("Error when adding reply:", error);
    res.status(500).json({ message: error.message });
  }
});

app.get("/specs/:id/comments", async (req, res) => {
  try {
    const specID = req.params.id;
    const spec = await specsScheme.findById(specID);
    res.json(spec.comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// =================================================================

app.listen(port, (err) => {
  if (err) console.log(err);
  console.log("Server listening");
});
