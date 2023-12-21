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

projectRouter.put("/unlink-board/", async (req, res) => {
  try {
    // Ensure req.body is an array of specIds
    const specIds = Array.isArray(req.body) ? req.body : [req.body];

    // Use Promise.all to wait for all updates to complete
    await Promise.all(specIds.map(async (specId) => {
      const spec = await specsScheme.findById(specId);

      if (spec) {
        // Update tasks to set sendToBoard to false
        const newList = spec.task.tasks.map((item) => ({
          ...item,
          sendToBoard: false,
        }));

        // Update the spec with the new project name and task list
        await specsScheme.findByIdAndUpdate(
          specId,
          {
            $set: {
              'task.projectName': '',
              'task.tasks': newList,
            },
          },
          { new: true }
        );
      }
    }));

    res.status(200).json({ success: true, message: "Specs updated successfully" });
  } catch (error) {
    console.error("Error updating specs:", error.message);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
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
    res.sendStatus(200);
  } catch (error) {
    console.log("error: ", error);
  }
});

export default projectRouter;
