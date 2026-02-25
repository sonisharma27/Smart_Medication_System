const express =require('express');
const router=express.Router();
const UserController=require('../controllers/UserController');
const auth = require('../middlewares/auth');
router.post('/user/register',(req,res)=>{
    UserController.doRegister(req,res);
})
router.post('/user/login',(req,res)=>{
    UserController.doLogin(req,res);
})
router.post('/user/create/profile', auth, (req,res)=>{
    UserController.createProfile(req,res);
});
router.get('/user/get/profile', auth, (req,res)=>{
    UserController.getProfile(req,res);
});
router.put('/user/edit/profile', auth, (req,res)=>{
    UserController.updateProfile(req,res);
});

module.exports=router;

