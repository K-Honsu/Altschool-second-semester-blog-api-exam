const UserModel = require("../models/user")
const transporter = require("../mailer")

const createUser = async (req, res) => {
    try {
        const {first_name, last_name, email, username, gender, password} = req.body
        const existingUser = await UserModel.findOne({
            email : email
        })
        if (existingUser) {
            return res.status(422).json({
                status : "error",
                data : "User Already Exist"
            })
        }
        const user = await UserModel.create({
            first_name,
            last_name,
            email,
            username,
            gender,
            password
        })

        const mailerOption = {
            from : "donotreply@gmail.com",
            to : email,
            subject : "Welcome to Blog APP",
            text : `Dear ${user.username}\nThank you for creating an account with us. \n We are very glad to have you here!. We do hope you enjoy our service. \n Thank you.`
        }

        transporter.sendMail(mailerOption, (error, info) => {
            if (error) {
                console.log("Error sending mail", error);
            } else {
                console.log("Email sent", info.response)
            }
        })
        return res.status(201).json({
            status : "success",
            message : "User created successfully",
            data : user
        })
    } catch (error) {
        return res.status(422).json({
            status : "error",
            data : error.message
        })
    }
}

const getUser = async (req, res) => {
    try {
        const user_id = req.user._id
        const user = await UserModel.findById({_id : user_id})
        return res.status(200).json({
            status : "success",
            data : user
        })
    } catch (error) {
        return res.status(422).json({
            status : "error",
            message : error.message
        })
    }
}

const updateUserInfo = async (req, res) => {
    try {
        const user_id = req.user._id
        const {first_name, last_name, gender, username} = req.body
        const user = await UserModel.findById({_id : user_id})
        if (!user) {
            return res.status(404).json({
                status : "error",
                data : 'User not found'
            })
        }
        if (username) {
            user.username = username
        }
        if (gender) {
            user.gender = gender
        }
        if (last_name) {
            user.last_name = last_name
        }
        if (first_name) {
            user.first_name = first_name
        }
        await user.save()
        return res.status(200).json({
            status : "success",
            message : "User Profile Updated Successfully",
            user 
        })
    } catch (error) {
        return res.status(422).json({
            status : "error",
            message : error.message
        })
    }
}

const deleteUser = async (req, res) => {
    try {
        const user_id = req.user._id
        const user = await UserModel.findOne({_id : user_id})
        if (!user) {
            return res.status(404).json({
                status : "error",
                message : "User not found"
            })
        }
        const mailerOption = {
            from : "donotreply@gmail.com",
            to : user.email,
            subject : "Going so soon 🥹🥹",
            text : `Dear ${user.username}\n We are sad to see you go. 
            \n We hope you did enjoy our sevices. If not, we kindly ask you send us a feedback on our official twitter handle to see how we can get you back on board.
            \n Thank you.`
        }

        transporter.sendMail(mailerOption, (error, info) => {
            if (error) {
                console.log("Error sending mail", error);
            } else {
                console.log("Email sent", info.response)
            }
        })
        await user.deleteOne()
        return res.status(200).json({
            status : "success",
            message : "Profile deleted successfully"
        })
    } catch (error) {
        return res.status(422).json({
            status : "error",
            message : error.message
        })
    }
}


module.exports = {
    createUser,
    getUser,
    updateUserInfo,
    deleteUser
}