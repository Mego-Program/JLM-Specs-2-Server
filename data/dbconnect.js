import specsData from '../data/specsData.js'
import exampleData from './exampleData.js'

export async function SaveUser() {
    try { 
    const check = await specsData.create(exampleData)
    console.log(check)
} 
catch (err) {
    console.log(err.message)
}
}
// SaveUser()

export async function PullData() {
    try { 
    const checkOneSpec = await specsData.find({title: "Recipe 6"})
    console.log(checkOneSpec)
} 
catch (err) {
    console.log(err.message)
}
}
// PullData()

// export default [SaveUser, PullData]