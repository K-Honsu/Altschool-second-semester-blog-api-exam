const UserModel = require("../models/user")
const transporter = require("../mailer")


const createUser = async ({first_name, last_name , gender, email, username, password}) => {
    try {
        const reqBody = {email, username, password, first_name, last_name, gender}
        const existingUser = await UserModel.findOne({
            email : email
        })
        if(existingUser){
            return {
                code : 422,
                status : "error",
                data : "User already exist"
            }
        }
        if (password === username ) {
            return {
                status : error,
                code : 400,
                data : "Username and password cannot be the same"
            }
        }
        const user = await UserModel.create({
            username,
            email,
            password,
            first_name,
            last_name,
            gender
        })

        const mailerOption = {
            from : "donotreply@gmail.com",
            to : email,
            subject : "Welcome to Task Manager app",
            text : `Dear ${user.username}\nThank you for creating an account with us. \n We are very glad to have you here!. We do hope you enjoy our service. \n Thank you.`
        }

        transporter.sendMail(mailerOption, (error, info) => {
            if (error) {
                console.log("Error sending mail", error);
            } else {
                console.log("Email sent", info.response)
            }
        })
        return {
            status : "success",
            code : 201,
            message : "User created successfully",
            data : user
        }
    } catch (error) {
        return {
            status : "error",
            code : 422,
            data : error.message
        }
    }
}

const DeleteAccount = async ({user_id}) => {
    try {
        const user = await UserModel.findById({_id : user_id})
        console.log(user)
        if (!user) {
            return {
                status : "error",
                code : 404,
                message : "User Not found"
            }
        }
        await user.deleteOne()
        return {
            status : "success",
            code : 200,
            message : "User Account deleled successfully"
        }
    } catch (error) {
        return {
            status : "error",
            code : 422,
            message : error.message
        }
    }
}


module.exports = {
    createUser,
    DeleteAccount
}