const mongoose = require("mongoose")
require("dotenv").config()

const connect = async (url) => {
    mongoose.connect(url || process.env.MONGOOSE_URL)

    mongoose.connection.on("connected", () => {
        console.log("Connected to mongoDB successfully");
    })

    mongoose.connection.on("error", (err) => {
        console.log("Error connecting to mongoDB");
        console.log(err);
    })
}

module.exports = {
    connect
}