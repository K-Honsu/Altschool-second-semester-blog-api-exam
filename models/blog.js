const mongoose = require("mongoose")
const schema = mongoose.Schema

const BlogSchema = new schema({
    author : {
        type : mongoose.Schema.ObjectId,
        ref : "users"
    },
    title : {type: String, null: false, unique : true},
    cloudinaryId : {type : String, required : true, default :  "lqv706e3pfdiohcqsn5m"},
    path : {type : String, required: true, default : "https://res.cloudinary.com/dnl3yjnre/image/upload/v1698159237/lqv706e3pfdiohcqsn5m.jpg"},
    description : {type : String, null: false},
    tag : {type : String},
    state : {type: String, enum: ["draft", "published"], default : "draft"},
    read_count : {type: Number, default : 0},
    reading_time : { type : Number },
    body : {type : String},
    is_created : {type : Date, default : new Date()}
})

const BlogModel = mongoose.model("blogs", BlogSchema)

module.exports = BlogModel