const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();



//send otp
exports.sendOTP = async(req,resizeBy) => {
    try{
         //fetch email from req body
        const { email } = req.body;

        //check if user alredy exist
        const userExist = await user.findOne({ email });
        if (userExist) {
            return res.status(401).json({
                success: false ,
                message: "User already exist"
            })
        }

        //generate otp
        let otp = otpGenerator.generate(6,{
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            numbers: true,
            specialChars: false
        }); 
        console.log("otp geenerated ", otp)

        const otpPayload = {email,otp};

        //create an entry for otp, means entry in database 
        const otpBody = await OTP.create(otpPayload);
        console.log("otp body",otpBody); 

        //return response succcessfully
        return res.status(200).json({
            success: true,
            message: "OTP sent successfully"
        })
    } 
    catch(error){
        console.log("error in send otp", error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        })
    }   

}


//signup


exports.signUp = async (req,res) => {
    try{
        //fetch data from req body
        const { firstName,lastName,email, password,confirmPassword,accountType,contactNumber,otp } = req.body;
        //validate
        //check if all fields are filled
        if(!firstName ||!lastName ||!email ||!password ||!confirmPassword ||!otp  ){
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }       
        //check if password and confirmPassword match
        if(password!== confirmPassword){
            return res.status(400).json({ 
                success: false,
                message: "Password and confirm password does not match"
            })
        }
        //check user already exists or not
        const existingUser = await user.findOne({ email });
        if (existingUser) {
            return res.status(401).json({
                success: false,
                message: "User already exist"
            })
        }
        //find most recent otp stored for user
        const recentOtp = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
        if(!recentOtp){
            return res.status(401).json({
                success: false,
                message: "Invalid OTP"
            })
        }
        //compare otp with the one sent in the request
        if(recentOtp.length == 0){
            //otp not found
            return res.status(400).json({
                success: false,
                message: "OTP not found"
            })
        }else if(otp !== recentOtp.otp){
            //invalid otp
            return res.status(401).json({
                success: false,
                message: "Invalid OTP"
            })
        }
        //if otp is correct then update the password in database and hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const profileDetails = await Profile.create({
            gender:null,
            dateOfBirth:null,
            about:null,
            contactNumber:null
        })
        const userPayload = {
             firstName,lastName,email, password: hashedPassword, accountType, contactNumber, additionalDetails: profileDetails._id, image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}` };
        //create a new user
        const user = await User.create(userPayload);
        
        //return response succcessfully
        return res.status(200).json({
            success: true,
            message: "User created successfully",
            user
        })
    }
    catch(error){
        console.log("error in sign up", error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        })
    }
}
//login

exports.login = async (req,res) => {
    try{
        //fetch data from req body
        const { email, password } = req.body;
        //validate
        //check if all fields are filled
        if(!email ||!password){
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }       
        //find user by email
        const user = await user.findOne({ email });
        if(!user){
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            })
        }
        //compare password with the one stored in the database
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            })
        }
        //if password is correct then return user data and create jwt token\
        const payload = {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            accountType: user.accountType
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
        user.token = token;
        user.password= undefined;
        //return response succcessfully
        return res.status(200).json({
            success: true,
            message: "Logged in successfully",
            token,
            user
        })
       
    }
    catch(error){
        console.log("error in login", error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        })
    }
}


// is students

exports.isStudent = async (req,res) => {
    try{
        if(req.user.accountType !== "Student"){
            return res.status(401).json({
                success: false,
                message: "You are not a student"
            })
        }
    }
    catch(error){
        console.log("error in isStudent", error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        })
    }
}

// is Instructor

exports.isInstructor = async (req,res) => {
    try{
        if(req.user.accountType!== "Instructor"){
            return res.status(401).json({
                success: false,
                message: "You are not an instructor"
            })
        }
    }
    catch(error){
        console.log("error in isInstructor", error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        })
    }
}


//isAdmin

exports.isAdmin = async (req,res) => {
    try{
        if(req.user.accountType!== "Admin"){
            return res.status(401).json({
                success: false,
                message: "You are not an admin"
            })
        }
    }
    catch(error){
        console.log("error in isAdmin", error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        })
    }
}

//change password
