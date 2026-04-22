const express =require('express');
const router=express.Router();
const UserController=require('../controllers/UserController');
const auth = require('../middlewares/auth');
const multer = require('multer');
const path = require('path');

// Multer Config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

router.post('/user/register',(req,res)=>{
    UserController.doRegister(req,res);
})
router.post('/user/verify-otp', (req, res) => {
    UserController.verifyOtp(req, res);
});
router.post('/user/login',(req,res)=>{
    UserController.doLogin(req,res);
})
router.post('/user/create/profile', auth, upload.single('profileImage'), (req,res)=>{
    UserController.createProfile(req,res);
});
router.get('/user/get/profile', auth, (req,res)=>{
    UserController.getProfile(req,res);
});
router.put('/user/edit/profile', auth, upload.single('profileImage'), (req,res)=>{
    UserController.updateProfile(req,res);
});
router.delete('/user/delete/profile', auth, (req,res)=>{
    UserController.deleteProfile(req,res);
});

module.exports=router;

