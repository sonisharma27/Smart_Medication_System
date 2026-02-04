const express =require('express');
const router=express.Router();
const UserController=require('../controllers/UserController');
router.post('/user/register',(req,res)=>{
    UserController.doRegister(req,res);
})
router.post('/user/login',(req,res)=>{
    UserController.doLogin(req,res);
})
module.exports=router;

