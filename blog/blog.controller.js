const BlogModel = require("../models/blog")
const { cloudinaryV2, streamUploadFile } = require("../utils/cloudinary")
const logger = require("../logger/index")

const createBlog = async (req, res) => {
    try {
        logger.info("[CreateBlog] => create blog process started")
        const author = req.user || {}
        const file = req.file
        const { title, description, tag, reading_time, body } = req.body
        let result;
        if (file) {
            result = await streamUploadFile(file.buffer);
        } else {
            result = {
                cloudinaryId : "",
                path: ""
            };

        }
        const existingTitle = await BlogModel.findOne({ title: title })
        if (existingTitle) {
            return res.status(422).json({
                status: "error",
                data: "Title already exist"
            })
        }
        const blog = await BlogModel.create({
            title,
            description,
            tag,
            reading_time,
            cloudinaryId: result.public_id,
            path : result.secure_url,
            body,
            author: author._id || null,
        })
        logger.info("[CreateBlog] => create blog process done")
        return res.status(201).json({
            status: "success",
            data1 : blog
        })
    } catch (error) {
        logger.error(error.message)
        return res.status(422).json({
            status: "error",
            data: error.message
        })
    }
}

const getAllBlogs = async (req, res) => {
    try {
        logger.info("[getallBlog] => get all blog process started")
        let { page, size } = req.query
        if (!page) {
            page = 1
        }
        if (!size) {
            size = 20
        }
        const limit = parseInt(size)
        const skip = (page - 1) * size
        const blog = await BlogModel.find().limit(limit).skip(skip)
        logger.info("[getallBlog] => get all blog process done")
        return res.status(200).json({
            status: "success",
            page,
            size,
            data: blog
        })
    } catch (error) {
        logger.error(error.message)
        return res.status(422).json({
            status: "error",
            data: error.message
        })
    }
}

const getBlogsForUser = async (req, res) => {
    try {
        logger.info("[getblogsforUser] => get blog for specific process started")
        const author = req.user._id
        const blog = await BlogModel.find({ author: author })
        logger.info("[getblogsforUser] => get blog for specific process done")
        return res.status(200).json({
            status: "success",
            data: blog
        })
    } catch (error) {
        logger.error(error.message)
        return res.status(422).json({
            status: "error",
            data: error.message
        })
    }
}

const getoneBlog = async (req, res) => {
    try {
        logger.info("[getoneblog] => get one blog process started")
        const id = req.params.id
        const existingBlog = await BlogModel.findById({ _id: id })
        logger.info("[getoneblog] => get one blog process done")
        return res.status(200).json({
            status: "success",
            data: existingBlog
        })
    } catch (error) {
        logger.error(error.message)
        return res.status(422).json({
            status: "error",
            data: error.message
        })
    }
}

const updateBlog = async (req, res) => {
    try {
        logger.info("[updateblog] => update blog process started")
        const id = req.params.id
        const author = req.user._id
        const { title, description, tag, reading_time, body } = req.body
        const existingBlog = await BlogModel.findOne({ _id: id, author: author })
        if (!existingBlog) {
            return res.status(404).json({
                status: "error",
                message: "Blog not found"
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
        logger.info("[updateblog] => update blog process done")
        return res.status(200).json({
            status: "success",
            message: "Blog Updated Successfully",
            existingBlog
        })
    } catch (error) {
        logger.error(error.message)
        return res.status(422).json({
            status: "error",
            data: error.message
        })
    }
}

const deleteBlog = async (req, res) => {
    try {
        logger.info("[deleteblog] => delete blog process started")
        const id = req.params.id
        const author_id = req.user._id
        const blog = await BlogModel.findOne({ _id: id, author: author_id })
        if (!blog) {
            return res.status(404).json({
                status: "error",
                data: `Blog not found`
            })
        }
        await blog.deleteOne()
        logger.info("[deleteblog] => delete blog process done")
        return res.status(200).json({
            status: "success",
            message: "Blog deleted successfully",
        })
    } catch (error) {
        logger.error(error.message)
        return res.status(400).json({
            status: "error",
            message: error.message
        })
    }
}


module.exports = {
    createBlog,
    getAllBlogs,
    getoneBlog,
    updateBlog,
    deleteBlog,
    getBlogsForUser
}