const express = require("express")
const blogService = require("../blog/blog.services")
const cookieParser = require("cookie-parser")

const router = express.Router()

router.use("/public", express.static("public"))


router.get("/blog", async (req, res) => {
    res.render("blog")
})

router.get("/login", async(req, res) => {
    res.render("login")
})

router.get("/welcome", async (req, res) => {
    res.render("welcome")
})


router.get("/home/:page", async (req, res) => {
    const perPage = 20;
    const page = parseInt(req.params.page) || 1;

    // Calculate the skip value to retrieve the appropriate chunk of blogs
    const skip = (page - 1) * perPage;

    const response = await blogService.getAllBlogs(req, res);
    console.log({response})

    // Slice the blogs array to get the current chunk
    const blogs = response.data.slice(skip, skip + perPage);
    console.log({blogs})

    return res.render("home", {
        blogs,
        current: page,
        pages: Math.ceil(response.data.length / perPage),
    });
});


module.exports = router