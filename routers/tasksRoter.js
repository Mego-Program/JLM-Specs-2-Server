import express from 'express'
import cors from 'cors'
import tasksInfo from '../data/tasks.js'

const router = express.Router()

router.use('/tasks-info', cors());


router.get('/tasks-info',(req,res)=>{
   
          res.json(tasksInfo)
      
})

export default router