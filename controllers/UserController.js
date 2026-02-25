const User=require('../models/User');
const Profile = require("../models/Profile");
const mongoose=require('mongoose');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
async function doRegister(req,res){
    try{
        console.log(req.body);
        const {firstName,lastName,email,password}=req.body;
        const isUserExist=await User.findOne({email:email});
        if(isUserExist){
            return res.status(400).send({success:false, message:"User already exists"});
        }
        const hashedPassword=await bcrypt.hash(password,10);

        const user=new User({firstName,lastName,email,password:hashedPassword});
        await user.save();
        res.status(200).send({success:true, message:"User registerd successfully"});
    }catch(err){
        console.log(err);
        res.status(500).send({success:false, message:err.message})
    }
}

async function doLogin(req,res) {
    try{
        console.log(req.body);
        const {email,password}=req.body;
        const user= await User.findOne({email:email});
        if(!user){
            return res.status(400).send({success:false, message:"Invalid email or password"});

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

        const existingProfile = await Profile.findOne({ user: userId });

        if (existingProfile) {
            return res.status(400).json({ message: "Profile already exists" });
        }

        const profile = await Profile.create({
            user: userId,
            name,
            age,
            gender,
            mobile,
            medicalCondition,
            address
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

        const profile = await Profile.findOne({ user: userId });

        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        res.status(200).json(profile);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function updateProfile(req, res) {
  try {
    const userId = req.user._id;

        const updatedProfile = await Profile.findOneAndUpdate(
            { user: userId },
            req.body,
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
module.exports={
    doRegister,
    doLogin,
    getProfile,
    updateProfile,
    createProfile
}