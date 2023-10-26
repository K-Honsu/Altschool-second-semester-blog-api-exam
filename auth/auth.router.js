const express = require("express")
const controller = require("./auth.controller")
const middleware = require("./auth.middleware")

const router = express.Router()

router.post("/login", middleware.validateLogin, controller.Login)
router.post("/forgot-password", controller.ForgotPassword)
router.post("/reset-password/:id", middleware.validatePassword, controller.ResetPassword)

module.exports = router