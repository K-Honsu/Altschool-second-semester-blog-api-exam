const mongoose = require("mongoose")
const schema = mongoose.Schema
const bcrypt = require("bcrypt")

const UserSchema = new schema({
    first_name : {type: String, null: false},
    last_name : {type : String, null: false},
    username : {type: String, null: false},
    email : {type: String, null: false},
    gender : {type: String, enum:["male", "female"]},
    password : {type: String, required: true},
    is_created : {type: Date, default: new Date()}
})

UserSchema.pre("save", async function (next) {
    const user = this
    const hash = await bcrypt.hash(this.password, 10)
    this.password = hash
    next()
})

UserSchema.methods.IsValidPassword = async function (password){
    const user = this
    const compare = await bcrypt.compare(password, user.password)
    return compare
}

const UserModel = mongoose.model("users", UserSchema)

module.exports = UserModel