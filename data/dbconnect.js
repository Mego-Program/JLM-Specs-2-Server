import specsScheme from './specsScheme.js'
import exampleData from './exampleData.js'

export async function createSpec() {
    try { 
    const createNowSpec = await specsScheme.create(exampleData[0])
    console.log(createNowSpec)
} 
catch (err) {
    console.log(err.message)
}
}


export async function findSpec() {
    try { 
    const findOneSpec = await specsScheme.find({})
    console.log(findOneSpec)
} 
catch (err) {
    console.log(err.message)
}
}
