const crypto = require("crypto")
const UserModel = require("../models/user")
const jwt = require("jsonwebtoken")
const transporter = require("../mailer")
require("dotenv").config()

const Login = async (req, res) => {
    try {
        const { username, password } = req.body
        const user = await UserModel.findOne({
            username : username
        })
        if (!user) {
            return res.status(404).json({
                status : "error",
                data : "User not found"
            })
        }
        const validPassword = await user.IsValidPassword(password)
        if (!validPassword) {
            return res.status(400).json({
                status : "error",
                data : "Username or Password is incorrect"
            })
        }
        const token = jwt.sign({email : user.email, _id : user._id}, process.env.JWT_SECRET, {expiresIn : "1hr"})
        return res.status(200).json({
            status : "success",
            user,
            token
        })
    } catch (error) {
        return res.status(422).json({
            status : "error",
            data : error.message
        })
    }
}

const ForgotPassword = async (req, res) => {
    try {
        const { email } = req.body
        const user = await UserModel.findOne({email:email})
        if (!user) {
            return res.status(404).json({
                status : "error",
                message : "User not found"
            })
        }
        const token = crypto.randomBytes(20).toString('hex');
        const resetLink = `http://localhost:3005/reset-password/${user._id}/${token}`
        const mailerOption = {
            from : "donotreply@gmail.com",
            to : email,
            subject : "Blog App Password Change",
            text : `You are receiving this mail because you opted in to change your password. Click this link reset your password: ${resetLink}`
        }
        transporter.sendMail(mailerOption, (error, info) => {
            if (error) {
                console.log("Error sending mail", error);
            } else {
                console.log("Email sent", info.response)
            }
        })
        return res.status(200).json({
            status : "success",
            message : "mail sent successfully"
        })
    } catch (error) {
        return res.status(422).json({
            status : "error",
            message : error.message
        })
    }
}

const ResetPassword = async (req, res) => {
    try {
        const { id } = req.params
        const { newpassword, confirmpassword } = req.body
        const user = await UserModel.findOne({_id : id})
        if (!user) {
            return res.status(404).json({
                status : "error",
                message : "User not found"
            })
        }
        if( newpassword != confirmpassword ) {
            return res.status(406).json({
                status : "error",
                message : "Password do not match."
            })
        }
        user.password = newpassword
        await user.save()
        return res.status(200).json({
            status : "success",
            message : "Password updated successfully. Kindly login with your newly created password."
        })
    } catch (error) {
        return res.status(422).json({
            status : "error",
            message : error.message
        })
    }
}

module.exports = {
    Login,
    ForgotPassword,
    ResetPassword
}