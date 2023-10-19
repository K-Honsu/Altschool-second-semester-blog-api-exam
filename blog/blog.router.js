const express = require("express")
const controller = require("./blog.controller")
const middleware = require("./blog.middleware")
const globalMiddleware = require("../middlewares/global.middlewares")

const router = express.Router()

router.post("/create", globalMiddleware.BearerToken, middleware.validateUserId, middleware.validateBlog, controller.createBlog)
router.get("/", controller.getAllBlogs)
router.get("/author-blog", globalMiddleware.BearerToken, controller.getBlogsForUser)
router.get("/:id", middleware.validateblogId, controller.getoneBlog)
router.patch("/update/:id", globalMiddleware.BearerToken, controller.updateBlog)
router.delete("/delete/:id", globalMiddleware.BearerToken, controller.deleteBlog)

module.exports = router