const express = require("express")
const blogService = require("../blog/blog.services")
const cookieParser = require("cookie-parser")

const router = express.Router()


// router.get("/home", async (req, res) => {
//     const perPage = 20;
//     const page = parseInt(req.params.page) || 1;
//     try {
//         const response = await blogService.getAllBlogs(req, res);
//         const totalBlogs = response.data.length;

//         const blogs = response.data.slice((page - 1) * perPage, page * perPage);

//         const totalPages = Math.ceil(totalBlogs / perPage);

//         res.render("home", {
//             blogs: blogs,
//             current: page,
//             pages: totalPages,
//         });
//     } catch (error) {
//         res.render("home")
//     }
   
//     // return res.render("home", {blogs, current: page, pages: Math.ceil(count / perPage), blogs: blogs, })
// })

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


// const response = await blogService.getAllBlogs().find({}).skip((perPage * page) - perPage).limit(perPage).exec(function(err, blogs) {
//     blogService.getAllBlogs.count().exec(function(err, count) {
//         if (err) return next(err)
//     })
// })
// console.log({response})
// const blogs = Array.isArray(response.data) ? response.data : [];