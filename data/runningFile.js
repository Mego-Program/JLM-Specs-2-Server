import mongoose from 'mongoose'

mongoose.connect('mongodb+srv://refaelcohen98:refael148@cluster0.lkzzbpr.mongodb.net/').then(() => {console.log('this is server.js')})

async function saveUser() {
    try { 
    const check = await UsersData.create({title: "title", 
    description: 'hhhh',
    content: "cohen",
    owner: 11111,
    users: ['r', 'a', 'c']})
    console.log(check)
} 
catch (e) {
    console.log(e.message)
}
}
saveUser()

// rest api - איך מאזינים לבקשות כאלו באקספרס
// המידע יעבור ברגע שהמשימה עולה לגמרי, כלומר רק שיש משהו אחד מסודר מוכן 
// 


// =========================================================================