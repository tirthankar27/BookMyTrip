const mongoose = require('mongoose');

// For MongoDB 7.0 on Mac
const mongoURI = process.env.MONGO_URI;

async function connectToMongo() {
    try {
        console.log('🔗 Connecting to MongoDB 7.0...');
        
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 10000,
        });
        
        console.log('✅ MongoDB 7.0 connected successfully to: bookmytrip');
        
        // Verify connection by listing collections
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('📁 Available collections:', collections.map(c => c.name));
        
    } catch(err) {
        console.error("❌ MongoDB connection failed:", err.message);
        console.log("\n🔧 Try these commands:");
        console.log("brew services stop mongodb-community");
        console.log("brew services start mongodb-community@7.0");
        console.log("brew services list");
        process.exit(1);
    }
}

module.exports = connectToMongo;