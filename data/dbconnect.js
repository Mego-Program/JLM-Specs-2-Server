import specsScheme from './specsScheme.js'
import exampleData from './exampleData.js'

export async function createSpec() {
    try { 
    const createNowSpec = await specsScheme.create(   {
        title: "A",
        description: "B",
        startDate: new Date("2024-08-08"),
        endDate: new Date("2025-08-28"),
        task: ["C", "D", "E"],
        team: ["F", "G", "H"]
      },)
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
