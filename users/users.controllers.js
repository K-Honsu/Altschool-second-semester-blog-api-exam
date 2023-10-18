const UserModel = require("../models/user")

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

module.exports = {
    createUser
}