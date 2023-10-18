const BlogModel = require("../models/blog")

const createBlog =  async (req, res) => {
    try {
        const author = req.user
        const { title, description, tag, reading_time, body} = req.body
        const blog = await BlogModel.create({
            title,
            description,
            tag, 
            reading_time,
            body,
            author : author._id
        })
        return res.status(201).json({
            status : "success",
            data : blog
        })
    } catch (error) {
        return res.status(422).json({
            status : "error",
            data : error.message
        })
    }
}

const getAllBlogs = async (req, res) => {
    try {
        const blog = await BlogModel.find()
        return res.status(200).json({
            status : "success",
            data : blog
        })
    } catch (error) {
        return res.status(422).json({
            status : "error",
            data : error.message
        })
    }
}

const updateBlog = async (req, res) => {
    try {
        const id = req.params.id
        console.log({id})
        const author = req.user._id
        console.log({author})
        const { title, description, tag, reading_time, body } = req.body
        const existingBlog = await BlogModel.findOne({ _id : id, author : author})
        console.log({existingBlog})
        if (!existingBlog) {
            return res.status(404).json({
                status : "error",
                message : "Blog not found"
            })
        }
        if (title) {
            existingBlog.title = title
        }
        if (description) {
            existingBlog.description = description
        }
        if (tag) {
            existingBlog.tag = tag
        }
        if (reading_time) {
            existingBlog.reading_time = reading_time
        }
        if (body) {
            existingBlog.body = body
        }
        await existingBlog.save()
        return res.status(200).json({
            status : "success",
            message : "Blog Updated Successfully",
            existingBlog 
        })
    } catch (error) {
        console.log({error})
        return res.status(422).json({
            status : "error",
            data : error.message
        })
    }
}

const deleteBlog = async (req, res) => {
    try {
        const id = req.params.id
        const author_id = req.user._id
        const blog = await BlogModel.findOne({_id : id, author : author_id})
        if (!blog) {
            return res.status(404).json({
                status : "error",
                data : `Blog not found`
            })
        }
        await task.deleteOne()
        return res.status(200).json({
            status : "success",
            message : "Blog deleted successfully",
        })
    } catch (error) {
        return res.status(400).json({
            status : "error",
            message : error.message
        })
    }
}


module.exports = {
    createBlog,
    getAllBlogs,
    updateBlog,
    deleteBlog
}