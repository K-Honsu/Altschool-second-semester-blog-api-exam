const joi = require("joi")
const UserModel = require("../models/user")

const validateUser = async (req, res, next) => {
    try {
        const schema = joi.object({
            first_name : joi.string().min(5).required(),
            last_name : joi.string().min(5).required(),
            username : joi.string().min(5).required(),
            email : joi.string().email().required(),
            gender : joi.string().valid("male", "female"),
            password : joi.string().min(7).required(),
        })
        await schema.validateAsync(req.body, {abortEarly : true})
        const {username, password} = req.body
        if (password === username) {
            return res.status(406).json({
                status : "error",
                data : "Password cannot be the same as username"
            })
        }
        next()
    } catch (error) {
        return res.status(422).json({
            status : "error",
            data : error.message
        })
    }
}

const validateEmail = async (req, res, next) => {
    try {
        const { email } = req.body
        const existingUser = await UserModel.findOne({email : email})
        if (existingUser) {
            return res.status(422).json({
                status : "error",
                data : "Email Already exist"
            })
        }
        next()
    } catch (error) {
        return res.status(500).json({
            status : "error",
            data : error.message
        })
    }
}

const validateUsername = async (req, res, next) => {
    try {
        const { username } = req.body
        const existingUser = await UserModel.findOne({username : username})
        if (existingUser) {
            return res.status(422).json({
                status : "error",
                data : "Username Already taken"
            })
        }
        next()
    } catch (error) {
        return res.status(500).json({
            status : "error",
            data : error.message
        })
    }
}

module.exports = {
    validateUser,
    validateEmail,
    validateUsername
}