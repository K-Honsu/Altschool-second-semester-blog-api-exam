const jwt = require("jsonwebtoken")
const UserModel = require("../models/user")
require("dotenv").config()


const BearerToken = async (req, res, next) => {
    try {
        const headers = req.headers
        if (!headers) {
            return res.status(400).json({
                status : "error",
                data : "You are not authorized"
            })
        }
        const token = headers.authorization.split(" ")[1]
        const decoded = await jwt.verify(token, process.env.JWT_SECRET)
        const user = await UserModel.findOne({ _id : decoded._id })
        if (!user) {
            return res.status(400).json({
                status : "error",
                data : "You are not authorized"
            })
        }
        req.user = user
        next()
    } catch (error) {
        return res.status(401).json({
            data : "Unauthorized"
        })
    }
}

module.exports = {
    BearerToken
}