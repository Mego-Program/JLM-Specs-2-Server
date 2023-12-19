import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import projectRouter from "./routes/project.js";
import teamsUsersRouter from "./routes/team.js";
import specsRouter from "./routes/specs.js";
import commentsRouter from "./routes/comments.js"; 

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
app.use(express.json());

app.use('/project', projectRouter);
app.use('/team', teamsUsersRouter);
app.use('/specs', specsRouter);
app.use('/comments', commentsRouter);


// =================================================================

app.listen(port, (err) => {
  if (err) console.log(err);
  console.log("Server listening");
});
