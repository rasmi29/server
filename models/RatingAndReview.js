const mongoose = require("mongoose ");

const ratingAndReviewSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    rating:{
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    review:{
        type: String,
        minlength: 10,
        maxlength: 500
    }
    
});

module.exports = mongoose.model("RatingAndReview", ratingAndReviewSchema);