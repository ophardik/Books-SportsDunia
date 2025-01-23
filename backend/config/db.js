const mongoose = require("mongoose");
require("dotenv").config(); // This loads the .env file

async function connectToMongoDB() {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected with database");
    } catch (error) {
        console.log("Error in connecting with Database");
        process.exit(1); // Exit with a failure code
    }
}

module.exports = connectToMongoDB;
