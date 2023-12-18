import express, { json } from "express";
import axios from "axios";

const teamsUsersRouter = express.Router();

teamsUsersRouter.get("/", async (req, res) => {
  try {
    const response = await axios.get(
      "https://infra-jerusalem-2-server.vercel.app/allusersnameimg"
    );
    const data = response.data;
    res.json(data);
  } catch (error) {
    console.log('error');
    console.error("Error:", error.message);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

export default teamsUsersRouter;