const User=require('../models/User');
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
module.exports={
    doRegister,
    doLogin
}