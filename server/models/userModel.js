const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name : {
        type: String,
        required : [true, "Enter Name"]
    },
    email : {
        type: String,
        required : [true, "Enter Email"],
        unique : true,
    },
    password : {
        type: String,
        required : [true, "Enter Password"]
    },
    profile_pic : {
        type: String,
        default: ""
    }
},{
    timestamps : true
})

const UserModel = mongoose.model("User", userSchema)

module.exports = UserModel;