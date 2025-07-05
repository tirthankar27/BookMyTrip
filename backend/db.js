const mongoose = require('mongoose');
const mongoURI = 'mongodb://localhost:27017/bookmytrip?tls=false&readPreference=primary'

async function connectToMongo() {
    try{
        await mongoose.connect(mongoURI);
        console.log('MongoDB connected');
    } catch(err){
        console.error("Conncetion error: ",err);
    }
}

module.exports = connectToMongo;