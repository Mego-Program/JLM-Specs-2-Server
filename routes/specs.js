import express from 'express'
import specsData from '../data/specsData';


const specRouter = express.Router()

// general func: Checking if the spec exist

async function getSpec(req, res, next) 
{ let spec;
    try {
        spec = await specsData.findById(req.params.id)
        if (spec == null) {
            return res.status(404).json({message: 'cannot find Spec'})
        }
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
    res.spec = spec
    next()
}

// main page of specs:

specRouter.get('/', async (req, res) => {
    try {
        const specs = await specsData.find()
        res.json(specs)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

// title: 

// specRouter.get('/title', getSpec, (req, res) => {
//     res.send('hello world')
//     res.send(res.getSpec.title)

// })

// specRouter.post('/', async (req, res) => {
//     let specs = new specsData({
//         title: req.body.title,
//         date: req.body.date,
//         description: req.body.description,
//         content: req.body.content,
//         owner: req.body.owner,
//         users: req.body.users
//     })
//     try {
//         let newSpec = await specsData.save()
//         res.status(201).json(newSpec)
//     } catch (error) {
//         res.status(400).json({message: error.message})
//     }
// })

// specRouter.delete("/id", getSpec, async (req, res) => {
//     try {
//         await res.spec.remove()
//     } catch (error) {
//         res.status(500).json({message: error.message})
//     }
//     res.spec
// })


// specRouter.patch("/id", getSpec, async (req, res) => {
//     if (req.body.title != null) {
//         res.spec.title = req.body.title
//     }
//     try {
//         const updatedSpec = await res.spec.save()
//         res.json(updatedSpec)
//     } catch (error) {
//         res.status(400).json({message: error.message})
//     }
// })



export default specRouter