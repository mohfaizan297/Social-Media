const mongoose = require('mongoose')

module.exports = async ()=> {
    const mongoUri = 'mongodb+srv://faizanmongoose:DCTbNrpSqrjzsVtx@cluster0.1qeqw37.mongodb.net/?retryWrites=true&w=majority'
    try {
        mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true, }, ()=>{
            console.log('Database Connected')
        })
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}
