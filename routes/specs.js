import express, { json } from "express";
import axios from "axios";
import specsScheme from "../data/specsScheme.js";

const specsRouter = express.Router();

// get some data based on queries that you have - all the objects, but only one value from the schemes:
specsRouter.get("/", async (req, res) => {
    try {
      const specs = await specsScheme.find({}, "title description date");
      res.json(specs);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // get data of single spec by id
  specsRouter.get("/:id", async (req, res) => {
    try {
      const specID = await specsScheme.findById(req.params.id);
      res.json(specID);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

// adding spec by post command:
specsRouter.post("/", async (req, res) => {
    console.log("enter server");
    try {
      let addSpecs = new specsScheme({
        title: req.body.title,
        description: req.body.description,
        content:req.body.content,
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
      }
      res.status(201).json(newSpec);
      console.log("spec added: ", newSpec);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  // remove spec by specific ID and read the spec in the console:
specsRouter.delete("/:id", async (req, res) => {
    try {
      const deleteSpec = await specsScheme.findByIdAndDelete(req.params.id);
      res.json(deleteSpec);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // update spec by specific ID and read the spec in the console:
  specsRouter.put("/:id", async (req, res) => {
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

export default specsRouter;

