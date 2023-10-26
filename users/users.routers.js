const express = require("express")
const controller = require("./users.controllers")
const middleware = require("./users.middleware")
const globalMiddleware = require("../middlewares/global.middlewares")

const router = express.Router()

router.post("/sign-up", middleware.validateUser, middleware.validateEmail, middleware.validateUsername, controller.createUser)
router.get("/", globalMiddleware.BearerToken, controller.getUser)
router.patch("/update", globalMiddleware.BearerToken, controller.updateUserInfo)
router.delete("/delete", globalMiddleware.BearerToken, controller.deleteUser)


module.exports = router