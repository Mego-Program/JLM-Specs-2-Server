import express from 'express'
import tasksInfo from '../data/tasks.js'

const router = express.Router()

router.get('/tasks-info',(req,res)=>{
   
          res.json(tasksInfo)
      
})

export default router