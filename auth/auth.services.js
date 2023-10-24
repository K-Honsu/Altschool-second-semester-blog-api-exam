const UserModel = require("../models/user")
const jwt = require("jsonwebtoken")
require("dotenv").config()


const Login = async ({username, password}) => {
    try {
        const reqBody = {username, password}
        console.log(reqBody)
        const user = await UserModel.findOne({
            username : reqBody.username
        })
        console.log({user})
        if (!user) {
            return {
                status : "error",
                data : "User not found",
                code : 404
            }
        }
        const validPassword = await user.IsValidPassword(password)
            if (!validPassword) {
                return {
                    status : "error",
                    data : "Username or Password is incorrect"
                }
            }
            const token = jwt.sign({email : user.email, _id : user._id}, process.env.JWT_SECRET, {expiresIn : "1hr"})
            return {
                status : "success",
                code : 200,
                data : {
                    user,
                    token
                }
            }
    } catch (error) {
        return {
            status : "error",
            code : 422,
            data : error.message
        }
    }
}

module.exports = {
    Login
}