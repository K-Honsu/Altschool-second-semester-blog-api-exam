const mongoose = require("mongoose")
const schema = mongoose.Schema

const BlogSchema = new schema({
    author : {
        type : mongoose.Schema.ObjectId,
        ref : "users"
    },
    title : {type: String, null: false},
    description : {type : String, null: false},
    tag : {type : String},
    state : {type: String, enum: ["draft", "published"], default : "draft"},
    read_count : {type: Number, default : 0},
    reading_time : { type : Number },
    body : {type : String, required : true},
    is_created : {type : Date, default : new Date()}
})

const BlogModel = mongoose.model("blogs", BlogSchema)

module.exports = BlogModel