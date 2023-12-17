import express from "express";
import mongoose from "mongoose";
import specsScheme from "./data/specsScheme.js";
import cors from "cors";
// import compression from "compression";
// import helmet from "helmet";
import dotenv from "dotenv";
import projectRouter from "./routes/project.js";
import teamsUsersRouter from "./routes/teamsUsers.js";
import specsRouter from "./routes/specs.js";
import axios from "axios";

dotenv.config();

const app = express();
const port = process.env.PORT;

const mongoDBCode = process.env.MONGO_DB_URI;
mongoose.connect(mongoDBCode);
const connectMongo = mongoose.connection;
connectMongo.on("error", (error) => console.log(error));
connectMongo.once("open", () => console.log("connected to the database"));

app.use(cors());
app.options("*");
// app.use(compression());
// app.use(helmet());
app.use(express.json());

app.use('/project', projectRouter);
app.use('/teams', teamsUsersRouter);
app.use('/specs', specsRouter)












app.get("/specs/:id/comments", async (req, res) => {
  try {
    const specID = req.params.id;
    const spec = await specsScheme.findById(specID);
    res.json(spec.comments);
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



// app.put("/spec/:id", async (req, res) => {
//   try {
//     const updatedSpec = await specsScheme.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true }
//     );

//     const savedSpec = await updatedSpec.save();

//     res.json(savedSpec);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });









// =================================================================

app.listen(port, (err) => {
  if (err) console.log(err);
  console.log("Server listening");
});
