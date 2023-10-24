const express = require("express")
const blogService = require("../blog/blog.services")
const userServices = require("../auth/auth.services")
const jwt = require("jsonwebtoken")
const cookieParser = require("cookie-parser")

const router = express.Router()

router.use("/public", express.static("public"))

router.get("/blog", async (req, res) => {
    const response = await blogService.getAllBlogs()
    const blogs = Array.isArray(response.data) ? response.data : [];
    res.render("blog", {blogs })
})

router.get("/login", async(req, res) => {
    res.render("login", {message : null})
})

router.post("/log", async (req, res) => {
    console.log(req.body)
    const response = await userServices.Login({
        username: req.body.username,
        password: req.body.password,
    });
    if (response.code === 200) {
        res.cookie("jwt", response.data.token, { maxAge: 360000 })
        res.redirect("blog");
    } else if (response.code === 422) {
        res.render("login", {message : response.data})
    } else {
        res.render("login", {message : response.data})
    }
});

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