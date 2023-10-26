const BlogModel = require("../models/blog")
const { cloudinaryV2, streamUploadFile } = require("../utils/cloudinary")

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
        const blog = await BlogModel.find().populate("author", "username")
        return {
            code: 200,
            status: "success",
            data: blog
        }
    } catch (error) {
        return {
            code: 422,
            status: "error",
            data: error.message
        }
    }
}

const createBlog = async (blog, author_id, file) => {
    try {
        let result = {
            cloudinaryId: '',
            path: '',
        };

        if (file) {
            result = await streamUploadFile(file);
        }
        const blogBody = blog
        const newBlog = new BlogModel()
        newBlog.author = author_id
        newBlog.title = blogBody.title
        newBlog.description = blogBody.description
        newBlog.tag = blogBody.tag
        newBlog.body = blogBody.body
        newBlog.cloudinaryId = result.public_id
        newBlog.path = result.secure_url;
        const saveBlog = await newBlog.save()
        return {
            status: "success",
            code: 201,
            message: "Blog Created Successfully",
            data: saveBlog
        }
    } catch (error) {
        return {
            status: "error",
            code: 422,
            data: error.message
        }
    }
}

const updateBlogStatus = async (blogId, author_id) => {
    try {
        const updatedBlog = await BlogModel.findByIdAndUpdate(
            { _id: blogId },
            { state: 'published' },
        );

        if (!updatedBlog) {
            return {
                status: 'error',
                code: 404,
                data: 'Blog not found',
            };
        }

        return {
            status: 'success',
            code: 200,
            message: 'Blog state updated to published',
            data: updatedBlog,
        };
    } catch (error) {
        console.error(error)
        return {
            status: 'error',
            code: 500,
            data: error.message,
        };
    }
};

const getOneBlog = async (blogId) => {
    try {
        const blog = await BlogModel.findById(
            { _id: blogId }
        ).populate("author", "username")
        if (!blog) {
            return {
                status: 'error',
                code: 404,
                data: 'Blog not found',
            };
        }
        blog.read_count += 1;
        await blog.save();
        return {
            status: 'success',
            code: 200,
            message: 'Blog with id gotten',
            data: blog,
        };
    } catch (error) {
        return {
            status: 'error',
            code: 500,
            data: error.message,
        };
    }
}

module.exports = {
    getAllBlogs,
    createBlog,
    updateBlogStatus,
    getOneBlog
}