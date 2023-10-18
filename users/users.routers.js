const express = require("express")
const controller = require("./users.controllers")
const middleware = require("./users.middleware")

const router = express.Router()

router.post("/sign-up", middleware.validateUser, middleware.validateEmail, middleware.validateUsername, controller.createUser)


module.exports = router