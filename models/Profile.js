const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    gender: {
        type: String,
    },
    dateOfBirth:{
        type: Date,
       
    },
    about:{
        type: String,
        maxlength: 500,
        trim: true
    },
    contactNumber:{
        type:Number,
        trim: true,
        maxlength: 10
    },

});

const Profile = mongoose.model('Profile',"profileSchema");

module.exports = Profile;