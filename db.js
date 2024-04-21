const mongoose = require('mongoose')

const mongoURI = 'mongodb://localhost:27017/inotebook?readPreference=primaryPreferred'

const connectTOMongo = ()=>{
    mongoose.connect(mongoURI);
    console.log("mongo is connected successfully")
}

module.exports = connectTOMongo;