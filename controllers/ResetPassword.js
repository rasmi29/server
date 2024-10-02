const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt =  require("bcrypt");

//rest password token
exports.resetPasswordToken = async (req, res) => {
  try {
    //get email from req body
    const { email } = req.body;
    //validate email
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }
    //generate a token
    const token = crypto.randomUUID();
    //save the token in user collection with email and token
    const updatedDetails = await User.findOneAndUpdate(
      { email: email },
      {
        token: token,
        resetPasswordExpires: Date.now() + 1000 * 60 * 5,
      },
      { new: true }
    );
    //create url
    const url = `http://localhost:3000/update-password/${token}`;
    //send mail containing the url
    await mailSender(email, "Reset Password", url);
    //return success message
    return res.status(200).json({
      success: true,
      message: "Reset Password link has been sent to your email",
    });
  } catch (error) {
    console.log("error in reset password", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

//reset password

exports.updatePassword = async (req, res) => {
  try {
    //get token and password from req body
    const { token, password, confirmPassword } = req.body;
    //validate token and password
    if (!token ||!password ||!confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Token, password and confirm password are required",
      });
    }
    //check if password and confirm password match
    if (password!== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }
    
    
    //find user by token
    const userDetails = await User.findOne({ token: token });
    if(!userDetails){
        return res.status(400).json({
          success: false,
          message: "Invalid token",
        });
    }
    //validate token expiry
    if (userDetails.resetPasswordExpires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "Token expired or invalid",
      });
    }
    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    //update password in user collection and remove the token from user
    const updatedUser = await User.findOneAndUpdate(
      { email: userDetails.email },
      { password: hashedPassword, token:"" },
      { new: true }
    );
    
    //return success message
    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });

  } catch (error) {
    console.log("error in update password", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
