const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    email:{
        type:String,
        required: true
    },
    otp: {
        type: Number,
        required: true
    },
    createdAt:{
        type:Date,
        default: Date.now
    }
    

});


// afunction to send email
async function sendVerificationEmail(email,otp){
    try{
        const mailResponse = await mailSender(email,"verification email from study notion",otp);
        console.log("email sent successfully",mailResponse)
    }
    catch(error){
        console.log("error occured while sending mail :",error);
        throw error;
    }
}

OTPSchema.pre("save",async function(next){
    await sendVerificationEmail(this.email,this.otp);
    next();
})


module.exports = mongoose.model('OTP',"otpSchema");
