const joi = require("joi")
const mongoose = require("mongoose")
const UserModel = require("../models/user")
const BlogModel = require("../models/blog")

const validateBlog = async (req, res, next) => {
    try {
        const schema = await joi.object({
            title : joi.string().required(),
            description : joi.string().required(),
            tag : joi.string().required(),
            reading_time : joi.number().required(),
            body : joi.string().required(),
        })
        await schema.validateAsync(req.body, {abortEarly : true})
        next()
    } catch (error) {
        return res.status(422).json({
            status : "error",
            data : error.message
        })
    }
}

const validateblogId = async (req, res, next) => {
    const id = req.params.id
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({
            status: "error",
            data: "Blog not found",
        });
    }
    try {
        const blog = await BlogModel.findById(id)
        if (!blog) {
            return res.status(404).json({
                status : "error",
                data : "Blog not found"
            })
        }
        next()
    } catch (error) {
        console.error(error)
        return res.status(422).json({
            status : "error",
            data : error.message
        })
    }
}

const validateUserId = async (req, res, next) => {
    try {
        const user_id = req.user._id
        const user = await UserModel.findById(user_id)
        if (!user) {
            return res.status(404).json({
                status : "error",
                data : "No user found with id"
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

module.exports = {
    validateBlog,
    validateUserId,
    validateblogId
}