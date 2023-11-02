import express from 'express'
import router from './routers/tasksRoter.js'

const app = express()
const port = 4000
// allows json
app.use(express.json())
// log the request info
app.use('/',(req,res,next)=>{
    console.log(req.path,req.method);
    next()
})


app.get('/',(req,res)=>{
    res.send('work')
})


app.use('/specs',router)


app.listen(port,()=>{
    console.log('server is listening on port '+port);
})