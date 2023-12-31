const express = require("express")
const blogService = require("../blog/blog.services")
const authServices = require("../auth/auth.services")
const userService = require("../users/user.service")
const jwt = require("jsonwebtoken")
const passport = require("passport")
const BlogModel = require("../models/blog")
const cookieParser = require("cookie-parser")
const { settings } = require("../utils/cloudinary")
const { countWords, calculateReadingTime } = require("../utils/reading.algorithm")
const upload = settings()
const methodOverride = require('method-override')
require("dotenv").config()

const router = express.Router()
router.use(cookieParser())
router.use(methodOverride("_method"))

router.use("/public", express.static("public"))

router.get("/welcome", async (req, res) => {
    res.render("welcome")
})

router.get("/detail/:blogId", async (req, res) => {
    const blogIds = req.params.blogId;
    const response = await blogService.getOneBlog(blogIds)

    const wordCount = countWords(response.data.body);
    const readingSpeed = 200;
    const readingTime = calculateReadingTime(wordCount, readingSpeed);
    res.render("detail", { user: null, blog: response.data, readingTime })
})

router.get("/log", async (req, res) => {
    res.render("login", { message: null })
})

router.post("/log", async (req, res) => {
    const response = await authServices.Login({
        username: req.body.username,
        password: req.body.password,
    });
    if (response.code === 200) {
        res.cookie("jwt", response.data.token, { maxAge: 360000 })
        res.redirect("blog");
    } else if (response.code === 422) {
        res.render("login", { message: response.data, user: null })
    } else {
        res.render("login", { message: response.data, user: null })
    }
})

router.get("/resetPassword/:user_id/:token", async (req, res) => {
    const user_id = req.params.user_id;
    const token = req.params.token;
    res.render("resetPassword", { user_id, token, message: null });
});

router.post("/resetPassword/:user_id/:token", async (req, res) => {
    const user_id = req.params.user_id;
    const token = req.params.token;
    const newpassword = req.body.newpassword;
    const confirmpassword = req.body.confirmpassword;

    const response = await authServices.ResetPassword({ user_id, newpassword, confirmpassword });

    if (response.code === 404) {
        res.render("resetPassword", { message: response.data, user_id, token });
    } else if (response.code === 406) {
        res.render("resetPassword", { message: response.data, user_id, token });
    } else if (response.code === 200) {
        res.render("resetPassword", { message: response.data, user_id, token });
    } else if (response.code === 422) {
        res.render("resetPassword", { message: response.data, user_id, token });
    }
});


router.get("/forgotPassword", async (req, res) => {
    res.render("forgotPassword", { message: null })
})

router.post("/forgotPassword", async (req, res) => {
    const response = await authServices.ForgotPassword({
        email: req.body.email
    })
    if (response.code === 404) {
        res.render("forgotPassword", { message: response.data })
    } else if (response.code === 422) {
        res.render("forgotPassword", { message: response.data })
    } else if (response.code === 200) {
        res.render("forgotPassword", { message: response.data })
    }
})

router.get("/resetPassword", async (req, res) => {
    res.render("resetPassword")
})

router.post("/signup", async (req, res) => {
    const response = await userService.createUser({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        username: req.body.username,
        email: req.body.email,
        gender: req.body.gender,
        password: req.body.password
    })
    if (req.body.password === req.body.username) {
        const errorMessage = "Password and username cannot be the same"
        res.render("login", { message: errorMessage })
    } else if (response.code === 201) {
        const successMessage = "Registration successful.\n Please check your email for confirmation and head over to the login page to log in and use our application.";
        res.render("login", { message: successMessage });
    } else if (response.code === 422) {
        res.render("login", { message: response.data });
    }
})

router.get("/logwgoogle", passport.authenticate("google", {
    scope: ["profile", "email"]
}))

// callback for google
router.get("/google/redirect", passport.authenticate("google"), async (req, res) => {
    const userId = req.user._id
    const token = jwt.sign({ _id: userId }, process.env.JWT_SECRET);
    res.cookie("jwt", token, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
    });
    const response = await blogService.getAllBlogs()
    const blogs = Array.isArray(response.data) ? response.data : [];
    res.redirect("/views/blog")
})

// router.get("/blog", async (req, res) => {
//     console.log("reached");
//     try {
//         const page = parseInt(req.query.page) || 1; // Extract 'page' from the query string
//         const limit = parseInt(req.query.limit) || 20; // Extract 'limit' from the query string
//         const response = await blogService.getAllBlogs(page, limit ); // Pass 'page' and 'limit' as an object
//         console.log(response);
//         const blogs = Array.isArray(response.data.blogs) ? response.data.blogs : [];
//         if (response.code === 200) {
//             return res.render("blog", {  user:null, blogs });
//         }
//     } catch (error) {
//         res.redirect("/views/log");
//         console.log(error);
//     }
// });




router.use(async (req, res, next) => {
    const token = req.cookies.jwt
    if (token) {
        try {
            const decodedValue = await jwt.verify(token, process.env.JWT_SECRET, { maxAge: 24 * 60 * 60 * 1000 })
            res.locals.user = decodedValue
            next()
        } catch (error) {
            res.redirect("blog")
        }
    } else {
        next()
    }
})


router.get("/logout", (req, res) => {
    res.clearCookie("jwt")
    res.redirect("blog")
})

router.delete("/delete/:userId", async (req, res) => {
    const user_id = req.params.userId
    const response = await userService.DeleteAccount({ user_id })
    if (response.code === 200) {
        res.redirect("/views/log")
    }
})

// router.get("/blog", async (req, res) => {
//     const response = await blogService.getAllBlogs()
//     const blogs = Array.isArray(response.data) ? response.data : [];
//     return res.render("blog", { user: res.locals.user || null, blogs })
// })

// router.get("/blog", async (req, res) => {
//     try {
//         const params = req.query
//         const response = await blogService.getAllBlogs(params)
//         console.log(response)
//         const blogs = Array.isArray(response.data) ? response.data : []
//         if (response.code === 200) {
//             return res.render("blog", { user: res.locals.user || null, blogs })
//         }
//     } catch (error) {
//         res.redirect("/views/log")
//         console.log(error)
//     }
// })



router.get("/blog", async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const response = await blogService.getAllBlogs(page, limit);
    const blogs = Array.isArray(response.data.blogs) ? response.data.blogs : [];
    const totalBlogs = response.data.totalBlogs;
    const blogsPerPage = 20; // Change this according to your setup
    const pages = Math.ceil(totalBlogs / blogsPerPage);
    return res.render("blog", { user: res.locals.user || null, blogs, pages, current: page });
});




router.get("/create-blog", async (req, res) => {
    res.render("create-blog", { user: res.locals.user })
})

router.post("/create-blog", upload.single("file"), async (req, res) => {
    const author_id = res.locals.user._id
    const file = req.file
    const fileBuffer = file ? file.buffer : "https://res.cloudinary.com/dnl3yjnre/image/upload/v1698159237/lqv706e3pfdiohcqsn5m.jpg";
    const response = await blogService.createBlog(req.body, author_id, fileBuffer)
    if (response.code === 201) {
        res.redirect("blog")
    } else {
        res.render("create-blog", { error: response.data })
    }
})

router.get("/editBlog/:id", async (req, res) => {
    const blogId = req.params.id;
    const blog = await BlogModel.findById(blogId);
    if (!blog) {
        return res.render('manageblogs', { user: res.locals.user });
    }
    res.render('editBlog', { blog });
})

router.post("/editBlog/:id", upload.single("file"), async (req, res) => {
    try {
        const blogId = req.params.id
        const {title, description, body, tag} = req.body
        const response = await blogService.editBlog(blogId, title, description, body, tag)
        if (response.code === 200){
            res.redirect("/views/manageblogs")
        }
    } catch (error) {
        res.render("editBlog")
    }
})


router.get("/manageblogs", async (req, res) => {
    const response = await blogService.getBlogsByUser(res.locals.user._id);
    return res.render("manageblogs", { user: res.locals.user, blogs: response.data })
})

router.put("/blog/:blogId", async (req, res) => {
    const author_id = res.locals.user._id;
    const blogId = req.params.blogId;
    const blogResponse = await blogService.getAllBlogs()
    const response = await blogService.updateBlogStatus(blogId, author_id);
    if (response.code === 200) {
        res.redirect("/views/manageblogs");
    } else {
        res.render("manageblogs", { error: response.data, blogs: blogResponse.data })
    }
});

// router.get("/blog/:blogId", async (req, res) => {
//     const blogId = req.params.blogId
//     const response = await blogService.getOneBlog(blogId)
//     const blogResponse = await blogService.getAllBlogs()
//     if (response.code === 200) {
//         res.render("blogdetail", {blogs : blogResponse.data})
//     }
// })

// router.get("/home/:page", async (req, res) => {
//     const perPage = 20;
//     const page = parseInt(req.params.page) || 1;

//     // Calculate the skip value to retrieve the appropriate chunk of blogs
//     const skip = (page - 1) * perPage;

//     const response = await blogService.getAllBlogs(req, res);
//     console.log({ response })

//     // Slice the blogs array to get the current chunk
//     const blogs = response.data.slice(skip, skip + perPage);
//     console.log({ blogs })

//     return res.render("home", {
//         blogs,
//         current: page,
//         pages: Math.ceil(response.data.length / perPage),
//     });
// });


module.exports = router