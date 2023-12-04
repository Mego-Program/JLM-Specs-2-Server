import express, { json } from "express";
import axios from "axios";
import specsScheme from "../data/specsScheme.js";

const projectRouter = express.Router();

projectRouter.get("/boards", async (req, res) => {
  try {
    const response = await axios.get(
      "https://project-jerusalem-2-server.vercel.app/projects/listOfProjects"
    );
    const data = response.data;
    res.json(data);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

projectRouter.put("/link-board", async (req, res) => {
  try {
    const updatedSpec = await specsScheme.findByIdAndUpdate(
        req.body.specId,
        { $set: { 'task.projectName': req.body.projectName } },
        { new: true }
      );
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

projectRouter.get('/', async (req, res) => {
    try {
        const specs = await specsScheme.find({}, "title");
        res.json(specs);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
})

export default projectRouter;
