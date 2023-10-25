const express = require("express")
const userRouter = require("./users/users.routers")
const authRouter = require("./auth/auth.router")
const blogRouter = require("./blog/blog.router")
const viewRouter = require("./views/views.routers")
const methodOverride = require('method-override')



const app = express()
app.use("/public", express.static("public"))

app.set("view engine", "ejs")

app.use(express.json())
app.use(express.urlencoded({ extended : true }))
app.use(methodOverride("_method"))


app.use("/auth", authRouter)
app.use("/blog", blogRouter)
app.use("/users", userRouter)
app.use("/views", viewRouter)

app.get('*', (req, res) => {
    return res.status(404).json({
        data: null,
        error: 'route not found'
    })
})


module.exports = app