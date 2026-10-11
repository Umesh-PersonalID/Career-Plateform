const mongoose = require("mongoose")



async function connectToDB() {
    if (!process.env.MONGO_URI) {
        console.error("CRITICAL: MONGO_URI environment variable is missing on this server!")
        return
    }

    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Connected to Database")
    }
    catch (err) {
        console.error("MongoDB connection failed:", err.message)
    }
}

module.exports = connectToDB