import express, { json } from "express";
import axios from "axios";
import specsScheme from "../data/specsScheme.js";

const projectRouter = express.Router();

projectRouter.get("/", async (req, res) => {
  try {
    const specs = await specsScheme.find({ "task.projectName": "" }, "title");
    res.json(specs);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

projectRouter.get("/boards/:userName", async (req, res) => {
  try {
    const response = await axios.post(
      "https://project-jerusalem-2-server.vercel.app/projects/listofprojects",
      {
        userName: req.params.userName
      }
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
      if (req.body.boardName !== null) {
        const updatedSpec = await specsScheme.findByIdAndUpdate(
          item,
          { $set: { "task.projectName": req.body.boardName } },
          { new: true }
        );
        res.status(200).json({ success: true, item: updatedSpec });
      }else{
        const spec = await specsScheme.findById(item)
        const newList = spec.task.tasks.map((item) => ({
          ...item,
          sendToBoard: false,
        }));
        const object = { projectName: null, tasks: newList };
        const updatedSpec = await specsScheme.findByIdAndUpdate(
          item,
          { $set: { task: object } },
          { new: true }
        );
        res.status(200).json({ success: true, item: updatedSpec });
      }
    } catch (error) {
      console.error("Error:", error.message);
      res
        .status(400)
        .json({ success: false, item: item, error: "Internal Server Error" });
    }
  });
});

projectRouter.put("/connect-board/:board", async (req, res) => {
  const { spec, boardName, tasks, newTask } = req.body;
  const del = { boardName: req.params.board, specId: spec.id };
  try {
    if (req.params.board !== "null") {
      const delRes = await axios.delete(
        "https://project-jerusalem-2-server.vercel.app/spec",
        { data: del }
      );
      console.log("response project: ", delRes.data);
    }
    if (boardName !== "") {

      const response = await axios.put(
        "https://project-jerusalem-2-server.vercel.app/spec/connectSpecs",
        req.body
      );
      console.log("response project: ", response.data);
    }

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
    console.log('add task: ',req.body);
    res.sendStatus(200);
  } catch (error) {
    console.log("error: ", error);
  }
});

export default projectRouter;
