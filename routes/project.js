import express, { json } from "express";
import axios from "axios";
import specsScheme from "../data/specsScheme.js";

const projectRouter = express.Router();

projectRouter.get("/", async (req, res) => {
  try {
    const specs = await specsScheme.find({}, "title");
    res.json(specs);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

projectRouter.get("/boards", async (req, res) => {
  try {
    const response = await axios.get(
      "https://project-jerusalem-2-server.vercel.app/spec/listOfProjects"
    );
    const data = response.data;
    res.json(data);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(400).json({ success: false, error: error });
  }
});

projectRouter.put("/link-board", async (req, res) => {
  req.body.specId.map(async (item) => {
    try {
      const updatedSpec = await specsScheme.findByIdAndUpdate(
        item,
        { $set: { "task.projectName": req.body.boardName } },
        { new: true }
      );
      res.status(200).json({ success: true, item: updatedSpec });
    } catch (error) {
      console.error("Error:", error.message);
      res
        .status(400)
        .json({ success: false, item: item, error: "Internal Server Error" });
    }
  });
});

projectRouter.put("/connect-board", async (req, res) => {
  console.log("enter connect-board");
  try {
    const response = await axios.put(
      "https://project-jerusalem-2-server.vercel.app/spec/connectSpecs",
      req.body
    );
    console.log("response project: ", response.data);
    res.sendStatus(200);
  } catch (error) {
    console.error("Error:", error.message);
    res.sendStatus(400);
  }
});

projectRouter.put("/add-task", async (req, res) => {
  try {
    const response = await axios.put(
      "https://project-jerusalem-2-server.vercel.app/spec/connectSpecs",
      req.body
    );
    res.sendStatus(200);
  } catch (error) {
    console.log("error: ", error);
  }
});

export default projectRouter;
