const User=require('../models/User');
const Profile = require("../models/Profile");
const mongoose=require('mongoose');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const { sendOTPMail } = require("../services/mailService");

async function doRegister(req,res){
    try{
        console.log(req.body);
        const {firstName,lastName,email,password}=req.body;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)){
            return res.status(400).send({
                success:false,
                message:"Please enter a valid email address"
            });
        }

        const emailLower = email.toLowerCase();
        const isUserExist = await User.findOne({ email: emailLower });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = Date.now() + 5 * 60 * 1000;

        if (isUserExist) {
            isUserExist.otp = otp;
            isUserExist.otpExpiry = otpExpiry;
            isUserExist.isVerified = false;
            await isUserExist.save();

            console.log("OTP (Resent):", otp);
            try {
                await sendOTPMail(emailLower, otp);
            } catch (mailErr) {
                console.log("Email sending failed, but OTP is logged in console.");
            }

            return res.status(200).send({
                success: true,
                message: "OTP sent to your email"
            });
        }

        const hashedPassword=await bcrypt.hash(password,10);
        const user=new User({
            firstName,
            lastName,
            email: emailLower,
            password: hashedPassword,
            otp: otp,
            otpExpiry: otpExpiry,
            isVerified: false
        });

        await user.save();
        console.log("OTP (New Registration):", otp);
        
        try {
            await sendOTPMail(emailLower, otp);
        } catch (mailErr) {
            console.log("Email sending failed, but OTP is logged in console.");
        }

        res.status(200).send({success:true, message:"Registration successful. OTP sent to your email."});
    }catch(err){
        console.log(err);
        res.status(500).send({success:false, message:err.message})
    }
}
async function verifyOtp(req, res) {
  try {
    // let { email, otp } = req.body;

    // // 🔥 clean input
    // otp = otp.trim();

    // const user = await User.findOne({ email });

    // if (!user) {
    //   return res.status(400).send({ message: "User not found" });
    // }
    let { email, otp } = req.body;

if (!email || !otp) {
  return res.status(400).send({ message: "Email and OTP required" });
}

email = email.toLowerCase();   // 🔥 FIX
otp = otp.trim();

const user = await User.findOne({ email });

    // 🔥 DEBUG (add this once)
    console.log("Saved OTP:", user.otp);
    console.log("Entered OTP:", otp);

    // 🔥 FIXED comparison
    // if (user.otp.toString() !== otp || user.otpExpiry < Date.now()) {
    //   return res.status(400).send({ message: "Invalid or expired OTP" });
    // }
    if (!user.otp || user.otp.toString() !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).send({ message: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    res.status(200).send({
      success: true,
      message: "Email verified successfully"
    });

  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}

async function doLogin(req,res) {
    try{
        console.log(req.body);
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(400).send({
                success:false,
                message:"Email and password are required"
            });
        }

        // email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)){
            return res.status(400).send({
                success:false,
                message:"Please enter a valid email address"
            });
        }
        const user= await User.findOne({email:email});
        if(!user){
            return res.status(400).send({success:false, message:"Invalid email or password"});

        }
        if (!user.isVerified) {
  return res.status(400).send({
    success: false,
    message: "Please verify your email first"
  });
}
       const isPasswordValid=await bcrypt.compare(password,user.password);
       if( !isPasswordValid){
        return res.status(400).send({success:false, message:"Inavalid Email or password"})
       }
       const secret_key = 'b2Vfb3ZlcnRoZXJlX29yX3NvbWV0aGluZ19lbHNld2hlcmU';
       const token =jwt.sign(
        {
            _id: user._id,
            email: user.email,
            name: user.firstName

        },
        secret_key,
        {expiresIn:'3h'}
       );
       res.status(200).send({success:true, message:"Login successfuly",data: {
                name: user.firstName,
                email: user.email,
                token: token
            }})
    }catch(err){
        console.log(err);
        res.status(500).send({success:false,message:"something wents wrong"})
    }
    
}
async function createProfile(req,res){
   try {
    console.log("REQ.USER =", req.user);
        const userId = req.user._id;

        const { name, age, gender, mobile, medicalCondition, address } = req.body;
        const profileImage = req.file ? `/uploads/${req.file.filename}` : "";

        const existingProfile = await Profile.findOne({ user: userId });

        if (existingProfile) {
            return res.status(400).json({ message: "Profile already exists" });
        }

        const profile = await Profile.create({
            user: userId,
            name,
            age: Number(age),
            gender,
            mobile,
            medicalCondition,
            address,
            profileImage
        }); 
        res.status(201).json({
            message: "Profile created successfully",
            data: profile
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}
async function getProfile(req,res){
      try {
        const userId = req.user._id;
        console.log("Fetching profile for user ID:", userId);

        const profile = await Profile.findOne({ user: userId });

        if (!profile) {
            const user = await User.findById(userId);
            if (!user) {
                console.log("User not found for ID:", userId);
                return res.status(404).json({ success: false, message: "User not found" });
            }

            const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
            console.log("Profile not found. Pre-filling name:", fullName);

            return res.status(200).json({ 
                success: false, 
                message: "Profile not found",
                data: {
                    name: fullName,
                    email: user.email
                }
            });
        }

        console.log("Profile found:", profile.name);
        res.status(200).json({ success:true, data: profile});

    } catch (error) {
        console.error("Error in getProfile:", error);
        res.status(500).json({ message: error.message });
    }
}
async function updateProfile(req, res) {
  try {
    const userId = req.user._id;

        const updateData = { ...req.body };
        if (req.file) {
            updateData.profileImage = `/uploads/${req.file.filename}`;
        }
        
        if (updateData.age) {
            updateData.age = Number(updateData.age);
        }

        const updatedProfile = await Profile.findOneAndUpdate(
            { user: userId },
            updateData,
            { new: true }
        );

        if (!updatedProfile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        res.status(200).json({
            message: "Profile updated successfully",
            data: updatedProfile
        });

        

    } catch (error) {  
        res.status(500).json({ message: error.message });
}
}
async function deleteProfile(req, res) {
  try {
    const userId = req.user._id;

    const deletedProfile = await Profile.findOneAndDelete({ user: userId });

    if (!deletedProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json({
      success: true,
      message: "Profile deleted successfully"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports={
    doRegister,
    doLogin,
    verifyOtp,
    getProfile,
    updateProfile,
    createProfile,
    deleteProfile
}