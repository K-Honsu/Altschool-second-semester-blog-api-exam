const UserModel = require("../models/user")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const Login = async (req, res) => {
    try {
        const { username, password } = req.body
        const user = await UserModel.findOne({
            username : username
        })
        if (!user) {
            return res.status(404).json({
                status : "error",
                data : "User not found"
            })
        }
        const validPassword = await user.IsValidPassword(password)
        if (!validPassword) {
            return res.status(400).json({
                status : "error",
                data : "Username or Password is incorrect"
            })
        }
        const token = jwt.sign({email : user.email, _id : user._id}, process.env.JWT_SECRET, {expiresIn : "1hr"})
        return res.status(200).json({
            status : "success",
            user,
            token
        })
    } catch (error) {
        return res.status(422).json({
            status : "error",
            data : error.message
        })
    }
}

module.exports = {
    Login
}