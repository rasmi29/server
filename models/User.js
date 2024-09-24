const mongoose = require("mongoose");

//create a schema

const userSchema = new mongoose.Schema({

    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    accountType: {
        type: String,
        required: true,
        enum: ["Admin", "Student","Instructor"]
    },
    additionalDetails: {
        type:mongoose.Schema.Types.ObjectId,
        ref: "Profile",
        required: true,
    },
    courses:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
        }
    ],
    courseProgress:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CourseProgress",
        }
    ]
});

//create a model

const User = mongoose.model("User", userSchema);

module.exports = User;