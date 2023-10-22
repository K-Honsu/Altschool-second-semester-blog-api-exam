const BlogModel = require("../models/blog")

const getAllBlogs = async (req, res) => {
    try {
        // let { page, size } = req.query
        // if (!page) {
        //     page = 1
        // }
        // if (!size) {
        //     size = 20
        // }
        // const limit = parseInt(size)
        // const skip = (page - 1) * size
        const blog = await BlogModel.find()
        return {
            code : 200,
            status : "success",
            data : blog
        }
    } catch (error) {
        return {
            code : 422,
            status : "error",
            data : error.message
        }
    }
}

module.exports = {
    getAllBlogs
}